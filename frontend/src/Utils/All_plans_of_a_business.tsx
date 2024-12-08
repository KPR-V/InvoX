import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json";

const CONTRACT_ADDRESS = "0x85FfbE0a64AD242C3FD29F2c31c605dcaE0581b0";

export const getAllPlans = async () => {
  try {
    // Connect to Ethereum provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log("Fetching all plans of a particular business...");

    // Call the getAllPlans function from the contract
    const plans = await contract.getPlansForBusiness();

    // Log the plans retrieved from the contract
    console.log("Plans retrieved:", plans);

    return plans;
  } catch (error) {
    console.error("Failed to fetch plans:", error);
  }
};