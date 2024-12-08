import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json"

import { CONTRACT_ADDRESS } from "./All_plans_of_a_business";

export const payFeeAndCreateBusiness = async (name: string, email: string, phone: string, registrationNumber: string,walletAddress:string) => {
  if (!walletAddress) {
    console.error("Wallet address is required");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    console.log("Calling registerBusiness...");

    // Call the registerBusiness function without sending Ether
    const tx = await contract.registerBusiness(name, email, phone, registrationNumber);
    console.log("Transaction submitted:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
