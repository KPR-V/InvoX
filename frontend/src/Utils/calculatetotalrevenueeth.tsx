export const fetchRevenue = async (walletAddress: string) => {
  try {
    const response = await fetch(`https://invox-pay.netlify.app/.netlify/functions/calculateTotalRevenueETH`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.totalRevenueETH;
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return null;
  }
};
