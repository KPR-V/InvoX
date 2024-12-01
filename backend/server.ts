import { RequestNetwork,Types,Utils } from "@requestnetwork/request-client.js";
import { payRequest } from "@requestnetwork/payment-processor";
import { EthereumPrivateKeySignatureProvider } from "@requestnetwork/epk-signature";
import { ethers } from "ethers";

const request_sepolia_gateway = "https://sepolia.gateway.request.network"


  const requestinvoice = async () => {
   
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: request_sepolia_gateway,
      },
    //   signatureProvider:signatureProvider,
      useMockStorage: true,
    });
    console.log("requestClient", requestClient);
  };
  requestinvoice();