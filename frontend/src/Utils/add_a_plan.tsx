import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json";
// const walletAddress = "0xDA257AAB75b0F631990F9BF5A1b9479C105E9d93";

import { CONTRACT_ADDRESS } from "./All_plans_of_a_business";

export const addPlan = async (title: string, description: string, price: number, duration: number,walletAddress:string) => {
  if (!walletAddress) {
    console.error("Wallet address is required");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    console.log("Calling addPlan...");

    // Call the addPlan function with the provided parameters
    const tx = await contract.addPlan(title, description, price, duration);
    console.log("Transaction submitted:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Plan creation failed:", error);
  }
};
