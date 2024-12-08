import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { ethers } from "ethers";

const requestClient2 = new RequestNetwork({
    nodeConnectionConfig: { 
        baseURL: "https://gnosis.gateway.request.network/",
    },
});

export const getCustomerDistribution = async (walletAddress) => {
    try {
        const requests2 = await requestClient2.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: walletAddress,
        });

        const requestDatas2 = await Promise.all(
            requests2.map(async (request) => await request.getData())
        );

        const countryDistribution = requestDatas2.reduce((acc, request) => {
            const country = request.contentData.buyerInfo?.address?.country || "Unknown";
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {});

        return countryDistribution;
    } catch (error) {
        console.error("Error getting customer distribution:", error);
        return {};
    }
};