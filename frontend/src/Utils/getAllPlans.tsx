import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json";
import { CONTRACT_ADDRESS } from "./All_plans_of_a_business";

export const getAllPlans = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log("Fetching all plans from the contract...");
    const plans = await contract.getAllPlans();

    // Convert BigNumber objects to strings or numbers
    const formattedPlans = plans.map((plan: any) => ({
      name: plan.title,
      type: "Standard", // You can modify this based on your needs
      amount: parseInt(ethers.utils.formatUnits(plan.price, 0)), // Convert price to number
      description: plan.description,
      isActive: plan.isActive,
      duration: plan.duration.toNumber()
    }));

    console.log("Formatted plans:", formattedPlans);
    return formattedPlans;
    
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return [];
  }
};