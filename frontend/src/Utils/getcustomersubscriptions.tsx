const getCustomerSubscriptions = async (walletAddress:string) => {
  try {
   
    const apiUrl = `https://invox-pay.netlify.app/.netlify/functions/getCustomerSubscriptions?walletAddress=${walletAddress}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Subscriptions:", data.subscriptions);
    return data.subscriptions;
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return [];
  }
};

let walletAddress=""
getCustomerSubscriptions(walletAddress).then((subscriptions) => {
console.log("Fetched subscriptions:", subscriptions);
});
