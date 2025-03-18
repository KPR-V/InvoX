interface SubscriptionRevenue {
  name: string;
  amount: number;
  duration: string;
  description: string;
}

export const getSubscriptionRevenue = async (walletAddress: string): Promise<SubscriptionRevenue[]> => {
  try {
    const response = await fetch(
      "https://invox-pay.netlify.app/.netlify/functions/getSubscriptionRevenue",
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
    return data;
  } catch (error) {
    console.error("Error fetching subscription revenue:", error);
    return [];
  }
};
