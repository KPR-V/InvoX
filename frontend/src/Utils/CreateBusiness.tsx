import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json"
const walletAddress = "0xDA257AAB75b0F631990F9BF5A1b9479C105E9d93";
const CONTRACT_ADDRESS = "0x85FfbE0a64AD242C3FD29F2c31c605dcaE0581b0";

export const payFeeAndCreateBusiness = async (name: string, email: string, phone: string, registrationNumber: string) => {
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
