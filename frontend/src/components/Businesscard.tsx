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
  const { bwalletAddress, bsetWalletAddress } = useData();
  const [businessDescription, setBusinessDescription] = useState("");
  const [isFeePaid, setIsFeePaid] = useState(false);
  const [isBusinessCreated, setIsBusinessCreated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          bsetWalletAddress(accounts[0]);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const sendWalletToBackend = async (address: string) => {
    try {
      const response = await fetch('http://localhost:3000/business/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!response.ok) {
        throw new Error('Failed to send business wallet address');
      }

      const data = await response.json();
      console.log('Business wallet address sent successfully:', data);
    } catch (error) {
      console.error('Error sending business wallet address:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to continue!");
      return;
    }

    if (bwalletAddress) {
      alert("Wallet already connected!");
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      bsetWalletAddress(address);
      await sendWalletToBackend(address); // Send wallet address to backend

      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        await switchToSepoliaNetwork();
      }

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        bsetWalletAddress(accounts[0] || "");
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
        bwalletAddress
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
      <div className="bg-zinc-950 rounded-2xl p-6 flex flex-col shadow-3xl shadow-orange-400 border-running border-orange-400 min-h-[500px] justify-between">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Business Registration
        </h2>

        <div className="text-black">
          <div className="mb-4 ">
            <label className="block text-sm font-medium mb-1 ">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border rounded p-2 bg-transparent"
              placeholder="Enter business name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">Phone Number</label>
            <input
              type="number"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter business phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">Business Email</label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="w-full border rounded p-2 bg-transparent"
              placeholder="Enter business email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">Registration Number</label>
            <input
              type="number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full border rounded p-2 bg-transparent"
              placeholder="Enter registration number"
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">Business Description</label>
            <input
              type="textarea"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full border rounded p-2 bg-transparent"
              placeholder="Enter business description"
            />
          </div> */}
        </div>

        <div>
          {!bwalletAddress ? (
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
              className="w-full bg-orange-400 text-black py-2 px-4 rounded hover:bg-orange-500 disabled:opacity-50"
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
