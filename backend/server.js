import { RequestNetwork,Types,Utils } from "@requestnetwork/request-client.js";
// import { payRequest } from "@requestnetwork/payment-processor";
import { EthereumPrivateKeySignatureProvider } from "@requestnetwork/epk-signature";
import { ethers } from "ethers";
import {
    approveErc20,
    hasSufficientFunds,
    hasErc20Approval,
    payRequest,
  } from "@requestnetwork/payment-processor";
import dotenv from "dotenv";
const request_sepolia_gateway = "https://sepolia.gateway.request.network"
dotenv.config({
  path: ".env",
});
// console.log("process.env.PRIVATE_KEY", process.env.PRIVATE_KEY);

const signatureProvider = new EthereumPrivateKeySignatureProvider({
  method: Types.Signature.METHOD.ECDSA,
  privateKey: process.env.PRIVATE_KEY
});
  
   
    const requestnetwork = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: request_sepolia_gateway,
      },
      signatureProvider:signatureProvider,
      useMockStorage: true,
    });
    // console.log("requestnetwork", requestnetwork);

const payeeIdentity = "0x5352b10D192475cA7Fa799e502c29Ab3AA28657F";
const payerIdentity = "0x1c32A90A83511534F2582E631314569ff6C76875";
const paymentRecipient = "0x5352b10D192475cA7Fa799e502c29Ab3AA28657F";
const feeRecipient = "0x5352b10D192475cA7Fa799e502c29Ab3AA28657F";

const requestParameters  = {
  requestInfo: {
    currency: {
      type: Types.RequestLogic.CURRENCY.ERC20,
      value: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C",
      network: "sepolia",
    },
    expectedAmount: ethers.utils.parseEther("0.0001").toString(),
    payee: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
    payer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerIdentity,
    },
    timestamp: Utils.getCurrentTimestampInSecond(),
  },
  paymentNetwork: {
    id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
    parameters: {
      paymentNetworkName: "sepolia",
      paymentAddress: paymentRecipient,
      feeAddress: feeRecipient,
      feeAmount: ethers.utils.parseEther("0.0").toString(),
      tokenAddress: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C",
    },
  },
  contentData: {
    reason: "Test ERC20 payment",
    dueDate: "2023.06.16",
  },
  signer: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: payeeIdentity,
  },
};


  const request = await requestnetwork.createRequest(requestParameters);
  const confirmedrequest= await request.waitForConfirmation();
  // console.log("request created successfully", request.requestId);
//  console.log(JSON.stringify(confirmedrequest));
const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/s3PEr8RVAHhn6_iToiOIhuAdMsFynrYi");

// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const requestdata = request.getData();
const payerWallet = new ethers.Wallet(process.env.PRIVATE_KEY2, provider);
// console.log("staring payment for the request ", requestdata.requestId);
const _hasSufficientFunds = await hasSufficientFunds({
  request : requestdata,
  address: payerWallet.address,
  providerOptions: { provider: provider }
});
console.log("hasSufficientFunds", _hasSufficientFunds);
if (!_hasSufficientFunds) {
  console.log(`Insufficient Funds: ${payerWallet.address}`);
}
const _hasErc20Approval = await hasErc20Approval(
  requestdata,
  payerIdentity,
  provider
);
console.log(`_hasErc20Approval = ${_hasErc20Approval}`);

if (!_hasErc20Approval) {
  console.log(`Requesting approval...`);
  const approvalTx = await approveErc20(requestdata, payerWallet);
  await approvalTx.wait(2);
  console.log(`Approval granted. ${approvalTx.hash}`);
}
  const paymentx = await payRequest(requestdata, payerWallet);
await paymentx.wait(2);
    console.log(`Payment complete. ${paymentx.hash}`);
  // console.log("payment sent successfully", paymentx.confirmations);

let startTime = Date.now();
while (requestdata.balance?.balance < requestdata.expectedAmount) {
  requestdata = await request.refresh();
  console.log(`current balance = ${requestdata.balance?.balance}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Check if 5 seconds have passed, and if so, break out of the loop
  if (Date.now() - startTime >= 5000) {
    console.log("Timeout: Exiting loop after 5 seconds.");
    break;
  }
}
