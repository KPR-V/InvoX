import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { payFeeAndCreateBusiness } from "../Utils/CreateBusiness";
import { useData } from "../Utils/datacontext";
const BusinessCard: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  // const [walletAddress, setWalletAddress] = useState("");
  const { walletAddress, setWalletAddress } = useData();
  const [businessDescription, setBusinessDescription] = useState("");
  const [isFeePaid, setIsFeePaid] = useState(false);
  const [isBusinessCreated, setIsBusinessCreated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
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

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || "");
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

  const handlePayFeeAndCreateBusiness = async () => {
    setIsCreatingBusiness(true);
    try {
      const success = await payFeeAndCreateBusiness(
        businessName,
        businessEmail,
        businessType,
        registrationNumber,
        walletAddress
      );
      if (success) {
        setIsFeePaid(true);
        setIsBusinessCreated(true);
        navigate("/dashboardbusiness");
      } else {
        alert("Failed to create business. Please try again.");
      }
    } catch (error) {
      console.error("Error creating business:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsCreatingBusiness(false);
    }
  };

  return (
    <div className="relative w-[30%] mx-auto">
      <div className="bg-zinc-950 rounded-2xl p-6 flex flex-col shadow-3xl shadow-orange-400 min-h-[500px] justify-between">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Business Registration
        </h2>

        <div className="text-black">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter business name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Business Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select type</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Corporation">Corporation</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Business Email</label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter business email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Registration Number</label>
            <input
              type="number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter registration number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Business Description</label>
            <input
              type="textarea"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter business description"
            />
          </div>
        </div>

        <div>
          {!walletAddress ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-orange-400 text-black py-2 px-4 rounded hover:bg-orange-500 disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect Metamask Wallet"}
            </button>
          ) : (
            <button
              onClick={handlePayFeeAndCreateBusiness}
              disabled={isCreatingBusiness}
              className="w-full bg-green-500 text-black py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isCreatingBusiness ? "Creating Business..." : "Pay Fee & Create Business"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
