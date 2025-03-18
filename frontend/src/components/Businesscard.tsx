import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { payFeeAndCreateBusiness } from "../Utils/CreateBusiness";
import { useData } from "../Utils/datacontext";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";

const BusinessCard: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const { bwalletAddress, bsetWalletAddress, setIsBusinessCreated } = useData();
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  
  // Sync wallet address with Wagmi
  useEffect(() => {
    if (isConnected && address) {
      bsetWalletAddress(address);
      sendWalletToBackend(address);
    }
  }, [address, isConnected, bsetWalletAddress]);

  const sendWalletToBackend = async (address: string) => {
    try {
      const response = await fetch('/.netlify/functions/business-wallet', {
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

  // Validation logic
  const isFormValid = () => {
    return (
      businessName.trim() !== "" &&
      businessType.trim() !== "" &&
      businessEmail.trim() !== "" &&
      businessEmail.includes('@') &&
      registrationNumber.trim() !== ""
    );
  };

  const handlePayFeeAndCreateBusiness = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields with valid information.");
      return;
    }

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

        <div className="">
          <div className="mb-4 ">
            <label className="block text-sm font-medium mb-1 ">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border rounded p-2 bg-transparent "
              placeholder="Enter business name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">Phone Number</label>
            <input
              type="number"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full border rounded p-2 bg-transparent"
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
        </div>

        <div className="space-y-4">
          {!bwalletAddress ? (
            <div className="flex justify-center ">
              <ConnectButton  label="Connect Wallet to Register" />
            </div>
          ) : (
            <button
              onClick={handlePayFeeAndCreateBusiness}
              disabled={isCreatingBusiness || !isFormValid()}
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
