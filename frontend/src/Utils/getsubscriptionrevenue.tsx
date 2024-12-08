export const getSubscriptionRevenue = async (walletAddress:string) => {
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

  const data = await response.json();
  return data; // The revenue data for each subscription plan
};
