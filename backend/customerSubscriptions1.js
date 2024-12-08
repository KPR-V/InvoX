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

export const getCustomerSubscriptions = async (walletAddress) => {
    try {
        const requests2 = await requestClient2.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: walletAddress,
        });

        const requestDatas2 = await Promise.all(
            requests2.map(async (request) => await request.getData())
        );

        const subscriptions = requestDatas2.map(request => {
            const invoiceItem = request.contentData.invoiceItems[0].name;
            const { name, durationMonths } = parseInvoiceItem(invoiceItem);
            return {
                name: name,
                duration: `${durationMonths} month${durationMonths > 1 ? 's' : ''}`,
                subscriptionFee: ethers.utils.formatEther(request.expectedAmount),
                purchaseDate: formatDate(request.contentData.creationDate),
                payerAddress: request.payer.value,
                status: request.state
            };
        });

        return subscriptions;
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
    }
};

