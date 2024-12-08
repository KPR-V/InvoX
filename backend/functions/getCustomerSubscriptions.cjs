const { RequestNetwork, Types } = require("@requestnetwork/request-client.js");
const { ethers } = require("ethers");

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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

exports.handler = async (event) => {
  const { walletAddress } = JSON.parse(event.body);

  try {
    const requests2 = await requestClient2.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: walletAddress,
    });

    const requestDatas2 = await Promise.all(
      requests2.map(async (request) => await request.getData())
    );

    const subscriptions = requestDatas2.map((request) => ({
      name: request.contentData.invoiceItems[0].name,
      subscriptionFee: ethers.utils.formatEther(request.expectedAmount),
      purchaseDate: formatDate(request.contentData.creationDate),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(subscriptions),
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
