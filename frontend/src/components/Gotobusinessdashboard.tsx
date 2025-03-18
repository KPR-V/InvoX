import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ethers } from "ethers";
import { useData } from "../Utils/datacontext";
import contractABI from "../Utils/contractABI.json";

interface ConnectWalletModalProps {
    onClose: () => void;
}
  
const Gotobusinessdashboard: React.FC<ConnectWalletModalProps> = ({ onClose }) => {
  const { bwalletAddress, bsetWalletAddress, setIsBusinessCreated, isBusinessCreated } = useData();
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  
  // Convert contract address to checksum address
  const contractAddress = ethers.utils.getAddress(import.meta.env.VITE_CONTRACT_ADDRESS);
  
  // Sync wallet address with Wagmi
  useEffect(() => {
    if (isConnected && address) {
      const checksumAddress = ethers.utils.getAddress(address);
      bsetWalletAddress(checksumAddress);
      checkBusinessExists(checksumAddress);
    }
  }, [address, isConnected, bsetWalletAddress]);

  // Check if business exists for this wallet address
  const checkBusinessExists = async (walletAddress: string) => {
    setIsChecking(true);
    try {
      if (typeof window.ethereum === "undefined") {
        console.error("No Ethereum provider found");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      
      // Call the getBusiness function from your contract
      const business = await contract.getBusiness(walletAddress);
      
      // If business name exists, business is created
      const exists = business && business.name && business.name.length > 0;
      setIsBusinessCreated(exists);
      
    } catch (error) {
      console.error("Error checking if business exists:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // Navigate to dashboard
  const goToDashboard = () => {
    navigate("/dashboardbusiness");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-zinc-950 p-12 rounded-2xl shadow-orange-400 w-[400px] text-center border-running border-orange-400 shadow-3xl">
        <h2 className="text-2xl font-light font-montserrat mb-6 text-zinc-300">Business Dashboard Access</h2>

        {!bwalletAddress ? (
          <div className="space-y-4">
            <p className="text-zinc-300 mb-4">Connect your wallet to access your business dashboard</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : isChecking ? (
          <div className="text-center text-zinc-300">
            <p>Checking business registration...</p>
          </div>
        ) : isBusinessCreated ? (
          <button
            onClick={goToDashboard}
            className="w-full py-2 mt-5 px-4 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Go to Business Dashboard
          </button>
        ) : (
          <div className="text-center text-zinc-300">
            <p>No business registration found for this wallet address.</p>
            <p className="mt-3">Please register your business first.</p>
            <button
              onClick={onClose}
              className="w-full py-2 mt-5 px-4 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Close and Register
            </button>
          </div>
        )}
        <button
          className="absolute text-2xl top-4 right-6 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Gotobusinessdashboard;
