import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../Utils/datacontext";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ethers } from "ethers";

const CustomerCard: React.FC = () => {
  const navigate = useNavigate();
  const { walletAddress, setWalletAddress } = useData();
  const { address, isConnected } = useAccount();

  // Effect to handle wallet connection
  React.useEffect(() => {
    if (isConnected && address) {
      const checksumAddress = ethers.utils.getAddress(address);
      setWalletAddress(checksumAddress);
      sendWalletToBackend(checksumAddress);
    }
  }, [address, isConnected, setWalletAddress]);

  const sendWalletToBackend = async (address: string) => {
    try {
      const response = await fetch('/.netlify/functions/customer-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!response.ok) {
        throw new Error('Failed to send customer wallet address');
      }

      const data = await response.json();
      console.log('Customer wallet address sent successfully:', data);
    } catch (error) {
      console.error('Error sending customer wallet address:', error);
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative w-[30%] mx-auto">
      <div className="bg-zinc-950 rounded-2xl p-6 flex flex-col justify-around border-running shadow-3xl shadow-orange-400">
        <h2 className="text-2xl font-bold mb-3 text-center">Customer Login</h2>
        <div>
          {walletAddress ? (
            <button
              className="w-full bg-zinc-950 border-2 border-orange-400 text-white py-2 px-4 rounded"
              onClick={goToDashboard}
            >
              Go to Customer Dashboard
            </button>
          ) : (
            <div className="flex justify-center">
              <ConnectButton label="Connect Wallet to Login" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
