import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json";

import { CONTRACT_ADDRESS } from "./All_plans_of_a_business";

export const getAllPlans = async () => {
  try {
    // Connect to Ethereum provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log("Fetching all plans from the contract...");

    // Call the getAllPlans function from the contract
    const plans = await contract.getAllPlans();

    // Log the plans retrieved from the contract
    console.log("Plans retrieved:", plans);

    return plans;
  } catch (error) {
    console.error("Failed to fetch plans:", error);
  }
};
