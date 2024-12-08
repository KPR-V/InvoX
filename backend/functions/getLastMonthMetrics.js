const { RequestNetwork, Types } = require("@requestnetwork/request-client.js");
const { ethers } = require("ethers");

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

// Handler function to get metrics for last month
exports.handler = async (event, context) => {
  // Parse wallet address from request body
  const { walletAddress } = JSON.parse(event.body);

  if (!walletAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Wallet address is required" }),
    };
  }

  try {
    // Fetch data from the Request Network
    const requests2 = await requestClient2.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: walletAddress,
    });

    // Get request data
    const requestDatas2 = await Promise.all(
      requests2.map(async (request) => await request.getData())
    );

    // Calculate the last month's metrics
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    let newUsers = 0;
    let monthlyRevenue = 0;

    requestDatas2.forEach((request) => {
      const creationDate = new Date(request.contentData.creationDate);
      if (creationDate >= oneMonthAgo) {
        newUsers++;
        monthlyRevenue += parseFloat(
          ethers.utils.formatEther(request.expectedAmount)
        );
      }
    });

    // Return the metrics for last month
    return {
      statusCode: 200,
      body: JSON.stringify({
        newUsers,
        monthlyRevenue: monthlyRevenue.toFixed(4), // Return with 4 decimal places
      }),
    };
  } catch (error) {
    console.error("Error calculating monthly metrics:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
