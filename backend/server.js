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
import crypto from "crypto";
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



const encryptData = (data, secretKey) => {
  const iv = crypto.randomBytes(18);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  };
};

const decryptData = (encryptedData, iv, secretKey) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc', 
    Buffer.from(secretKey),
    Buffer.from(iv, 'hex')
  );  
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
};

// Modified business creation endpoint
app.post("/createbusiness", async (req, res) => {
  const businessData = {
    name: req.body.name,
    email: req.body.email, 
    registration_number: req.body.registration_number,
    address: req.body.address,
    phone_number: req.body.phone_number
  };

  // Generate hash for on-chain storage
 // this is a one way hash and cannot be decrypted 
  // const businessHash = ethers.utils.keccak256(
  //   ethers.utils.defaultAbiCoder.encode(
  //     ['string', 'string', 'string', 'string', 'string'],
  //     [businessData.name, businessData.email, businessData.registration_number, 
  //      businessData.address, businessData.phone_number]
  //   )
  // );

  
  const secretKey = process.env.ENCRYPTION_KEY; 
  const encrypted = encryptData(businessData, secretKey);
// store this encrypted data to blockchain
  
  
  
  
  

  res.json({
    message: "Business data stored successfully"
  });
});


app.get("/business/:walletaddress", async (req, res) => {
  const walletaddress = req.params.walletaddress;
  
  // Fetch encrypted data from blockchain using wallet address
 
  





  
  // For demo, using mock stored data
  const storedData = {
    encryptedData: "encrypted-hex-string",
    iv: "iv-hex-string"
  };

  const secretKey = process.env.ENCRYPTION_KEY;
  const decryptedData = decryptData(
    storedData.encryptedData,
    storedData.iv,
    secretKey
  );

  res.json(decryptedData);

});

app.post("/createplans/:walletaddress", async (req, res) => {
  const { walletaddress } = req.params;
  const plansData = req.body;
  // Generate hash for on-chain storage
  const seceret_key = process.env.ENCRYPTION_KEY;
  const encrypted = encryptData(plansData, seceret_key);
  // store this encrypted data to blockchain








  res.json({
    message: "Plans created successfully"
  });

})
 
app.get("/plans/:walletaddress", async (req, res) => { 
  const walletaddress = req.params.walletaddress;
  // Fetch encrypted data from blockchain using wallet address
 






  
  // For demo, using mock stored data
  const plansData = {
    encryptedData: "encrypted-hex-string",
    iv: "iv-hex-string"
  };

  const secretKey = process.env.ENCRYPTION_KEY;
  const decryptedData = decryptData(
    plansData.encryptedData,
    plansData.iv,
    secretKey
  );

  res.json(decryptedData);

})

app.get("/payment-gateway", async (req, res) => { 

  const { } = req.body;
  
  //here i will use request network to create a payment gateway



})
















app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
