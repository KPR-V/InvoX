import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { ethers } from "ethers";

// Define PlanInfo interface structure
const requestClient = new RequestNetwork({
    nodeConnectionConfig: { 
        baseURL: "https://sepolia.gateway.request.network/",
    },
});

const requestClient2 = new RequestNetwork({
    nodeConnectionConfig: { 
        baseURL: "https://gnosis.gateway.request.network/",
    },
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export const calculateTotalRevenueETH = (requestDatas2) => {
    try {
        const totalETH = requestDatas2.reduce((total, request) => {
            return total + parseFloat(ethers.utils.formatEther(request.expectedAmount));
        }, 0);
        return totalETH.toFixed(4); // Return with 4 decimal places
    } catch (error) {
        console.error("Error calculating ETH revenue:", error);
        return 0;
    }
};
export const convertETHtoUSD = async (ethAmount) => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const ethPrice = data.ethereum.usd;
        const usdAmount = parseFloat(ethAmount) * ethPrice;
        return usdAmount.toFixed(2); // Return with 2 decimal places
    } catch (error) {
        console.error("Error converting to USD:", error);
        return 0;
    }
};
const getLastMonthMetrics = (requestDatas2) => {
    try {
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        
        let newUsers = 0;
        let monthlyRevenue = 0;
        
        requestDatas2.forEach(request => {
            const creationDate = new Date(request.contentData.creationDate);
            if (creationDate >= oneMonthAgo) {
                newUsers++;
                monthlyRevenue += parseFloat(ethers.utils.formatEther(request.expectedAmount));
            }
        });

        return {
            newUsers,
            monthlyRevenue: monthlyRevenue.toFixed(4)
        };
    } catch (error) {
        console.error("Error calculating monthly metrics:", error);
        return {
            newUsers: 0,
            monthlyRevenue: 0
        };
    }
};
export const getTotalUsers = async (walletAddress) => {
    try {
        const requests2 = await requestClient2.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: walletAddress,
        });

        const requestDatas2 = await Promise.all(
            requests2.map(async (request) => await request.getData())
        );

        // Get unique payer addresses
        const uniqueUsers = new Set(
            requestDatas2.map(request => request.payer.value)
        );

        return uniqueUsers.size;
    } catch (error) {
        console.error("Error getting total users:", error);
        return 0;
    }
};
export const getSubscriptionRevenue = async (walletAddress) => {
    try {
        const requests2 = await requestClient2.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: walletAddress,
        });

        const requestDatas2 = await Promise.all(
            requests2.map(async (request) => await request.getData())
        );

        // Group by subscription name and sum amounts
        const revenueByPlan = requestDatas2.reduce((acc, request) => {
            const planName = request.contentData.invoiceItems[0].name;
            const amount = parseFloat(ethers.utils.formatEther(request.expectedAmount));
            
            if (!acc[planName]) {
                acc[planName] = {
                    name: planName,
                    amount: 0,
                    duration: "Monthly", // You can modify this if needed
                    description: request.contentData.invoiceItems[0].description || ""
                };
            }
            acc[planName].amount += amount;
            return acc;
        }, {});

        // Convert to array format for pie chart
        const pieChartData = Object.values(revenueByPlan);
        return pieChartData;
    } catch (error) {
        console.error("Error getting subscription revenue:", error);
        return [];
    }
};
const demonstrateBusinessMetrics = async () => {
    const walletAddress = "0x828cCc45007EFC1c1d1c221c279B5ac8a7C85592";
    
    try {
        // Get all requests for this business
        const requests2 = await requestClient2.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: walletAddress,
        });

        const requestDatas2 = await Promise.all(
            requests2.map(async (request) => await request.getData())
        );

        // Calculate metrics
        const totalRevenueETH = calculateTotalRevenueETH(requestDatas2);
        const totalRevenueUSD = await convertETHtoUSD(totalRevenueETH);
        const monthlyMetrics = getLastMonthMetrics(requestDatas2);
        const totalUsers = await getTotalUsers(walletAddress);
        console.log("Total unique users:", totalUsers);
        const revenueData = await getSubscriptionRevenue(walletAddress);
        console.log("\nRevenue by subscription:");
        revenueData.forEach(plan => {
            console.log(`${plan.name}: ${plan.amount} ETH`);
        });
        // Log results
        console.log("\n=== Business Metrics ===");
        console.log(`Business Address: ${walletAddress}`);
        console.log(`Total Revenue (ETH): ${totalRevenueETH} ETH`);
        console.log(`Total Revenue (USD): $${totalRevenueUSD}`);
        console.log(`\n=== Last Month Metrics ===`);
        console.log(`New Users: ${monthlyMetrics.newUsers}`);
        console.log(`Revenue: ${monthlyMetrics.monthlyRevenue} ETH`);
        
        // // Log all transactions
        // console.log("\n=== All Transactions ===");
        // requestDatas2.forEach((request, index) => {
        //     console.log(`\nTransaction ${index + 1}:`);
        //     console.log(`Amount: ${ethers.utils.formatEther(request.expectedAmount)} ETH`);
        //     console.log(`Date: ${formatDate(request.contentData.creationDate)}`);
        //     console.log(`Status: ${request.state}`);
        // });

    } catch (error) {
        console.error("Error demonstrating metrics:", error);
    }
};

// Execute the function
demonstrateBusinessMetrics();