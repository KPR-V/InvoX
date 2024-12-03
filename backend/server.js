import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";
import { EthereumPrivateKeySignatureProvider } from "@requestnetwork/epk-signature";
import { ethers } from "ethers";
import {
    approveErc20,
    hasSufficientFunds,
    hasErc20Approval,
    payRequest,
  } from "@requestnetwork/payment-processor";
import dotenv from "dotenv";
import express from "express";
const request_sepolia_gateway = "https://sepolia.gateway.request.network"
dotenv.config({
  path: ".env",
});

const app = express();
const port = process.env.PORT || 3000;

const signatureProvider = new EthereumPrivateKeySignatureProvider({
  method: Types.Signature.METHOD.ECDSA,
  privateKey: process.env.PRIVATE_KEY,
}); 
   
const requestnetwork = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: request_sepolia_gateway,
      },
      signatureProvider: signatureProvider,
      // useMockStorage: true,
    });





  app.post("/createrequest", async (req, res) => {
  const { payeeIdentity, payerIdentity, paymentRecipient,expectedAmount ,body } = req.body;
  // const payeeIdentity = "0x5352b10D192475cA7Fa799e502c29Ab3AA28657F";
  // const payerIdentity = "0x1c32A90A83511534F2582E631314569ff6C76875";
  // const paymentRecipient = "0x5352b10D192475cA7Fa799e502c29Ab3AA28657F";
  // const feeRecipient = "0x5352b10D192475cA7Fa799e502c29Ab3AA28657F";
const requestParameters  = {
  requestInfo: {
    currency: {
      type: Types.RequestLogic.CURRENCY.ERC20,
      value: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C",
      network: "sepolia",
    },
    expectedAmount: ethers.utils.parseEther(`${expectedAmount}`).toString(),
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
      feeAddress: "0x5352b10D192475cA7Fa799e502c29Ab3AA28657F",
      feeAmount: ethers.utils.parseEther('0.0').toString(),
      tokenAddress: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C",
    },
  },
  contentData: {
     body : body
  },
  signer: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: payeeIdentity,
  },
};

    
        const request = await requestnetwork.createRequest(requestParameters);
      const confirmedrequest = await request.waitForConfirmation();
      res.send(confirmedrequest);
  

});





app.get("/dothepayment", async (req, res) => {
  const {payerWallet}=req.body;
  const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL);
  const request = await requestnetwork.fromIdentity({
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: payerWallet.address,
  })
  const requestdata = request.getData();
  // const payerWallet = new ethers.Wallet(process.env.PRIVATE_KEY2, provider);
  
  const _hasSufficientFunds = await hasSufficientFunds({
    request : requestdata,
    address: payerWallet.address,
    providerOptions: { provider: provider }
  });
  
  console.log("hasSufficientFunds", _hasSufficientFunds);
  
  if (!_hasSufficientFunds) {
    console.log(`Insufficient Funds: ${payerWallet.address}`);
    res.send("Insufficient Funds");
    return;
  }
  
  const _hasErc20Approval = await hasErc20Approval(requestdata,payerWallet.address,provider);
  
  
  
  
  if (!_hasErc20Approval) {
    const approvalTx = await approveErc20(requestdata, payerWallet);
    await approvalTx.wait(2);
  }
  
    const paymentx = await payRequest(requestdata, payerWallet);
  await paymentx.wait(2);



 
  while (requestdata.balance?.balance < requestdata.expectedAmount) {
    const requestdata1 = await request.refresh();
    console.log(`current balance = ${requestdata1.balance?.balance}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (requestdata1.balance?.balance === requestdata.expectedAmount+requestdata.balance?.balance) {
      console.log("payment confirmed");
      break;
    }
  }

 });


app.get("/getrequest", async (req, res) => {
  const { payerWallet } = req.body;
  // const provider = new ethers.providers.JsonRpcProvider(
  //   process.env.JSON_RPC_URL
  // );
  const request = await requestnetwork.fromIdentity({
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: payerWallet.address,
  });
  const requestdata = request.getData();

  res.send(requestdata);
   


 });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
