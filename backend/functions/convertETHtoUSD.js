const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const { ethAmount } = JSON.parse(event.body);

    // Validate input
    if (!ethAmount || isNaN(parseFloat(ethAmount))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid ETH amount provided" }),
      };
    }

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ETH price");
    }

    const data = await response.json();
    
    if (!data.ethereum?.usd) {
      throw new Error("Invalid response from price API");
    }

    const ethPrice = data.ethereum.usd;
    const usdAmount = (parseFloat(ethAmount) * ethPrice).toFixed(2);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ usdAmount }),
    };

  } catch (error) {
    console.error("Error converting to USD:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Internal Server Error",
        message: error.message 
      }),
    };
  }
};
