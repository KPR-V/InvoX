import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json";
import { useContractWrite } from 'wagmi';

export const payFeeAndCreateBusiness = async (
  name: string,
  email: string,
  phone: string,
  registrationNumber: string,
  walletAddress: string
): Promise<boolean> => {
  if (!walletAddress) {
    console.error("Wallet address is required");
    return false;
  }

  try {
    // Since we're using ethers v5 with the contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Create contract instance with the checksummed address
    const checksummedAddress = ethers.utils.getAddress(import.meta.env.VITE_CONTRACT_ADDRESS);
    const contract = new ethers.Contract(checksummedAddress, CONTRACT_ABI, signer);

    console.log("Calling registerBusiness...");
    console.log("Contract address:", checksummedAddress);
    console.log("Wallet address:", walletAddress);

    // Call the registerBusiness function
    const tx = await contract.registerBusiness(name, email, phone, registrationNumber);
    console.log("Transaction submitted:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    return true;
  } catch (err) {
    console.error("Registration failed:", err);
    const error = err as { code?: string };
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      alert('Insufficient funds to create business. Please check your wallet balance.');
    } else if (error.code === 'USER_REJECTED') {
      alert('Transaction was rejected. Please try again.');
    } else {
      alert('Failed to create business. Please check console for details.');
    }
    return false;
  }
};

