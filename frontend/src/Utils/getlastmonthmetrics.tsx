interface MonthlyMetrics {
  newUsers: number;
  uniqueUsers: number;
  monthlyRevenue: string;
}

export const getLastMonthMetrics = async (walletAddress: string): Promise<MonthlyMetrics> => {
  const response = await fetch("https://invox-pay.netlify.app/.netlify/functions/getLastMonthMetrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
