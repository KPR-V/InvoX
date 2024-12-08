import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { ethers } from "ethers";

// Initialize RequestNetwork clients
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

// Calculate Total Revenue in ETH
const calculateTotalRevenueETH = (requestDatas2) => {
  try {
    const totalETH = requestDatas2.reduce((total, request) => {
      return (
        total + parseFloat(ethers.utils.formatEther(request.expectedAmount))
      );
    }, 0);
    return totalETH.toFixed(4); // Return with 4 decimal places
  } catch (error) {
    console.error("Error calculating ETH revenue:", error);
    return 0;
  }
};

export const handler = async (event) => {
  try {
    // Parse the body to get walletAddress (or other necessary data)
    const { walletAddress } = JSON.parse(event.body);

    if (!walletAddress) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing walletAddress in the request body",
        }),
      };
    }

    // Fetch requests from both networks
    const requests2 = await requestClient2.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: walletAddress,
    });

    // Get request data from each request
    const requestDatas2 = await Promise.all(
      requests2.map(async (request) => await request.getData())
    );

    // Calculate total revenue in ETH
    const totalRevenueETH = calculateTotalRevenueETH(requestDatas2);

    // Return the calculated revenue
    return {
      statusCode: 200,
      body: JSON.stringify({ totalRevenueETH }),
    };
  } catch (error) {
    console.error("Error in serverless function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
