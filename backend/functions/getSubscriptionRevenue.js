const { RequestNetwork, Types } = require("@requestnetwork/request-client.js");
const { ethers } = require("ethers");

const requestClient2 = new RequestNetwork({
  nodeConnectionConfig: {
    baseURL: "https://gnosis.gateway.request.network/",
  },
});

const parseInvoiceItem = (invoiceItem) => {
  const [name, duration] = invoiceItem.split(" - ");
  const durationMonths = parseInt(duration.replace(" months", ""));
  return { name, durationMonths };
};

exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Validate request body
  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Request body is missing" })
    };
  }

  // Safe JSON parsing
  let walletAddress;
  try {
    const body = JSON.parse(event.body);
    walletAddress = body.walletAddress;
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON in request body" })
    };
  }

  if (!walletAddress) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Wallet address is required" })
    };
  }

  try {
    const requests2 = await requestClient2.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: walletAddress,
    });

    const requestDatas2 = await Promise.all(
      requests2.map(async (request) => await request.getData())
    );

    const revenueByPlan = requestDatas2.reduce((acc, request) => {
      const invoiceItem = request.contentData.invoiceItems[0].name;
      const { name, durationMonths } = parseInvoiceItem(invoiceItem);
      const amount = parseFloat(
        ethers.utils.formatEther(request.expectedAmount)
      );

      if (!acc[name]) {
        acc[name] = {
          name: name,
          amount: 0,
          duration: `${durationMonths} month${durationMonths > 1 ? "s" : ""}`,
          description: request.contentData.invoiceItems[0].description || "",
        };
      }
      acc[name].amount += amount;
      return acc;
    }, {});

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(Object.values(revenueByPlan))
    };
  } catch (error) {
    console.error("Error getting subscription revenue:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
