const { RequestNetwork, Types } = require("@requestnetwork/request-client.js");

const requestClient2 = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: "https://gnosis.gateway.request.network/",
  },
});


exports.handler = async (event, context) => {
  const { walletAddress } = JSON.parse(event.body);

  if (!walletAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Wallet address is required" }),
    };
  }

  try {
  
    const requests2 = await requestClient2.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: walletAddress,
    });

    // Get request data
    const requestDatas2 = await Promise.all(
      requests2.map(async (request) => await request.getData())
    );

    // Get unique payer addresses
    const uniqueUsers = new Set(
      requestDatas2.map((request) => request.payer.value)
    );

    // Return the total unique users
    return {
      statusCode: 200,
      body: JSON.stringify({ totalUsers: uniqueUsers.size }),
    };
  } catch (error) {
    console.error("Error getting total users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
