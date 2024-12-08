import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

interface ConnectWalletModalProps {
    onClose: () => void;
  }
  
  const Gotobusinessdashboard: React.FC<ConnectWalletModalProps> = ({ onClose }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };
    checkWalletConnection();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to continue!");
      return;
    }

    if (walletAddress) {
      alert("Wallet already connected!");
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        await switchToSepoliaNetwork();
      }

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || null);
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      alert(error.code === 4001 ? "Connection rejected by user." : "Connection failed. Try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to Sepolia network if not already connected
  const switchToSepoliaNetwork = async () => {
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
  };

  // Navigate to dashboard
  const goToDashboard = () => {
    navigate("/dashboardbusiness");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-zinc-950 p-12 rounded-2xl shadow-orange-400 w-[400px] text-center border-running border-orange-400 shadow-3xl">
        <h2 className="text-2xl font-light font-montserrat mb-6 text-zinc-300">Already Registered?</h2>

        {walletAddress ? (
          <button
            onClick={goToDashboard}
            className="w-full py-2 mt-5 px-4 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Go to Business Dashboard
          </button>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-2 px-4 mt-5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
          </button>
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
