import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useData } from "../Utils/datacontext";
const CustomerCard: React.FC = () => {
 
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
const { walletAddress, setWalletAddress } = useData();
  const sendWalletToBackend = async (address: string) => {
    try {
      const response = await fetch('http://localhost:3000/customer/wallet', {
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

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to continue!");
      return;
    }
    setIsConnecting(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Test Network",
                  nativeCurrency: {
                    name: "Sepolia ETH",
                    symbol: "SepoliaETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.infura.io/v3/"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          }
        }
      }
      setWalletAddress(address);
      await sendWalletToBackend(address);

      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        setWalletAddress(accounts[0]);
        await sendWalletToBackend(accounts[0]);
      });
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      if (error.code === 4001) {
        alert("Please connect to MetaMask.");
      } else {
        alert("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative w-[30%] mx-auto ">
      <div className="bg-zinc-950 rounded-2xl p-6 flex flex-col justify-around border-running shadow-3xl shadow-orange-400">
        <h2 className="text-2xl font-bold mb-3 text-center ">Customer Login</h2>
        <div>
          {walletAddress ? (
            <button
              className="w-full bg-zinc-950 border-2 border-orange-400 text-white py-2 px-4 rounded"
              onClick={goToDashboard}
            >
              Go to Customer Dashboard
            </button>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className={`w-full py-2 px-4 rounded ${
                !isConnecting
                  ? "bg-orange-400 text-black hover:bg-orange-500 hover:text-white"
                  : "bg-orange-400  text-black"
              }`}
            >
              {isConnecting ? "Connecting..." : "Connect Metamask Wallet"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
