import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const BusinessCard: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [isFeePaid, setIsFeePaid] = useState(false);
  const [isBusinessCreated, setIsBusinessCreated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

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
       window.ethereum.on("accountsChanged", (accounts: string[]) => {
         setWalletAddress(accounts[0]);
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


  const payFeeAndCreateBusiness = async () => {
    if (walletAddress) {
      try {
        console.log("Paying fee...");
        setIsFeePaid(true);
        setIsBusinessCreated(true);
      } catch (error) {
        console.error("Fee payment failed:", error);
      }
    }
  };

  const goToDashboard = () => {
    navigate("/dashboardbusiness"); 
  };

  return (
    <div className="relative w-[30%] mx-auto ">
      <div className="bg-zinc-950 rounded-2xl p-6 flex flex-col  border-running shadow-3xl shadow-orange-400 min-h-[500px] justify-between">
        <h2 className="text-2xl font-bold mb-4">Business Registration</h2>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter business name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Business Type
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select type</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Service</option>
              <option value="Corporation">Corporation</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Business Email
            </label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter business email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Registration Number
            </label>
            <input
              type="number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter registration number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Business Description
            </label>
            <input
              type="textarea"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full border rounded  p-2"
              placeholder="Enter business Description"
            />
          </div>
        </div>

        <div>
          {!walletAddress ? (
            <button
              onClick={connectWallet}
              className="w-full bg-orange-400 text-black py-2 px-4 rounded hover:bg-orange-500"
            >
              Connect Metamask Wallet
            </button>
          ) : !isFeePaid ? (
            <button
              onClick={payFeeAndCreateBusiness}
              className="w-full bg-green-500 text-black py-2 px-4 rounded hover:bg-green-600"
            >
              Pay Fee & Create Business
            </button>
          ) : (
            <button
              onClick={goToDashboard}
              className="w-full bg-zinc-950 text-white py-2 px-4 rounded border-2 border-orange-400"
            >
              Go to Business Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
