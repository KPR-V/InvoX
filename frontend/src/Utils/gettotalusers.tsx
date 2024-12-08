export const getTotalUsers = async (walletAddress:string) => {
  const response = await fetch("/.netlify/functions/getTotalUsers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });

  const data = await response.json();
  return data.totalUsers; // The number of unique users
};
