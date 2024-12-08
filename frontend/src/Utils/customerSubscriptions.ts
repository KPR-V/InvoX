import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { ethers } from "ethers";

interface PlanInfo {
    name: string;
    subscriptionFee: string;
    purchaseDate: string;
}

interface RequestData {
    contentData: {
        invoiceItems: Array<{
            name: string;
        }>;
        creationDate: string;
    };
    expectedAmount: ethers.BigNumber;
}

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

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const getCustomerSubscriptions = async (walletAddress: string): Promise<PlanInfo[]> => {
    try {
        const requests2 = await requestClient2.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: walletAddress,
        });

        const requestDatas2 = await Promise.all(
            requests2.map(async (request) => await request.getData())
        );

        const subscriptions: PlanInfo[] = requestDatas2.map(request => ({
            name: request.contentData.invoiceItems[0].name,
            subscriptionFee: ethers.utils.formatEther(request.expectedAmount),
            purchaseDate: formatDate(request.contentData.creationDate),
        }));

        console.log("Fetched subscriptions:", subscriptions);
        return subscriptions;

    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
    }
};