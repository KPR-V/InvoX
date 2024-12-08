export const convertETHtoUSD = async (ethAmount: string): Promise<string> => {
  try {
    const response = await fetch(
      "https://invox-pay.netlify.app/.netlify/functions/convertETHtoUSD",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ethAmount }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: { usdAmount: string } = await response.json();
    return data.usdAmount;
  } catch (error) {
    console.error("Error converting ETH to USD:", error);
    return "0";
  }
};
