import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json";

export const CONTRACT_ADDRESS = "0x4B93F9CBf63d77b21B91Bb0AA7bc115091BF421C";

export const getPlansForBusiness = async (walletAddress: string) => {
  try {
    // Connect to Ethereum provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log("Fetching all plans of a particular business...");

    // Call the getPlansForBusiness function from the contract
    const plans = await contract.getPlansForBusiness(walletAddress);

    // Convert BigNumber objects to strings or numbers
    const formattedPlans = plans.map((plan: any) => ({
      name: plan.title,
      amount: ethers.utils.formatUnits(plan.price, 0), // Convert price to string with 18 decimal places
      duration: plan.duration.toNumber(), // Convert to number
      description: plan.description,
      isActive: plan.isActive, // Include the isActive property
    }));

    // Log the plans retrieved from the contract
    // console.log("Plans retrieved:", formattedPlans);

    return formattedPlans;
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return [];
  }
};