import {RequestNetwork, Types} from "@requestnetwork/request-client.js";
const requestClient = new RequestNetwork({
    nodeConnectionConfig: { 
        baseURL: "https://sepolia.gateway.request.network/",

    },
});

const identityAddress ="0x828cCc45007EFC1c1d1c221c279B5ac8a7C85592";
const requests = await requestClient.fromIdentity({
    type:Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: identityAddress,
});
// console.log(requests);
const requestDatas = requests.map((request) => request.getData());
console.log(requestDatas);


// const requestId="01eb582767b20d463a67d6444c912bd93c0c380e2fd29322e54cfdfd7d7c00cc02";
// const x =await RequestNetwork.fromRequestId(requestId);
// console.log(x.getData());