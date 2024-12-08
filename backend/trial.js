import {RequestNetwork, Types} from "@requestnetwork/request-client.js";
import { ethers } from "ethers";   
import express from 'express';
import cors from 'cors';

const requestClient = new RequestNetwork({
    nodeConnectionConfig: { 
        baseURL: "https://sepolia.gateway.request.network/",

    },
});
const requestClient2 = new RequestNetwork({
    nodeConnectionConfig: { 
        baseURL: "https://gnosis.gateway.request.network/",

    },
});

const identityAddress ="0x828cCc45007EFC1c1d1c221c279B5ac8a7C85592";
const requests = await requestClient.fromIdentity({
    type:Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: identityAddress,
});
const requests2 = await requestClient2.fromIdentity({
    type:Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: identityAddress,
});
// console.log(requests);
const requestDatas = requests.map((request) => request.getData());
const requestDatas2 = requests2.map((request) => request.getData());
// console.log(requestDatas[0]);
console.log(requestDatas2[0].contentData.invoiceItems[0].name);
// due date from .contentData.paymentTerms.dueDate
// creation date from .contentData.creationDate
// value in wei from    const weiValue requestDatas[0].expectedAmount
//const etherValue = ethers.utils.formatEther(weiValue)
//plan name .contentData.invoiceItems[0].name

const app = express();
app.use(cors());
app.use(express.json());


const walletAddresses = {
  business: [],
  customer: []
};


app.post('/business/wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Business wallet address is required' });
    }
    
   
    if (!walletAddresses.business.includes(walletAddress)) {
      walletAddresses.business.push(walletAddress);
    }
    console.log('Received business wallet address:', walletAddress);
    
    res.status(200).json({ 
      message: 'Business wallet address received successfully',
      address: walletAddress,
      allBusinessAddresses: walletAddresses.business
    });
  } catch (error) {
    console.error('Error processing business wallet address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/customer/wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Customer wallet address is required' });
    }
    
  
    if (!walletAddresses.customer.includes(walletAddress)) {
      walletAddresses.customer.push(walletAddress);
    }
    console.log('Received customer wallet address:', walletAddress);
    
    res.status(200).json({ 
      message: 'Customer wallet address received successfully',
      address: walletAddress,
      allCustomerAddresses: walletAddresses.customer
    });
  } catch (error) {
    console.error('Error processing customer wallet address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


