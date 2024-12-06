import {RequestNetwork, Types} from "@requestnetwork/request-client.js";
import { ethers } from "ethers";   
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
