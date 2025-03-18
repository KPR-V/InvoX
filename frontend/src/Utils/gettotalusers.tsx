export const getTotalUsers = async (walletAddress: string): Promise<number> => {
  try {
    const response = await fetch('https://invox-pay.netlify.app/.netlify/functions/getTotalUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.totalUsers;
  } catch (error) {
    console.error('Error fetching total users:', error);
    return 0;
  }
};
