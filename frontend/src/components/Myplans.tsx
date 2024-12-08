import React, { useState, useEffect } from "react";
import { getPlansForBusiness } from "../Utils/All_plans_of_a_business";
import { useData } from "../Utils/datacontext";
import { ethers } from "ethers";
interface Plan {
  name: string;
  amount: number; // Change to string to match formatted amount
  duration: number; // Change to number to match formatted duration
  description: string;
}

const Myplans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { bwalletAddress , bsetWalletAddress } = useData();
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
  useEffect(() => {
    const fetchPlans = async () => {
      if (!bwalletAddress) {
        setLoading(false);
        return;
      }

      try {
        const fetchedPlans = await getPlansForBusiness(bwalletAddress);
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [bwalletAddress]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[40%] h-60 bg-zinc-950 rounded-2xl p-6 shadow-lg border-x-[1px] border-orange-300">
      <h2 className="text-2xl font-light text-center text-zinc-300 mb-4">
        Company Plans
      </h2>

      <div className="h-[80%] overflow-y-auto scrollbar-hidden">
        {plans.length === 0 ? (
          <div className="text-center text-zinc-300">No plans available</div>
        ) : (
          <table className="w-full text-left text-zinc-300">
            <thead className="sticky top-0 bg-zinc-950">
              <tr>
                <th className="py-2 border-b text-center border-orange-300">Plan Name</th>
                <th className="py-2 border-b text-center border-orange-300">Amount</th>
                <th className="py-2 border-b text-center border-orange-300">Duration</th>
                {/* <th className="py-2 border-b text-center border-orange-300">Description</th> */}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={index}>
                  <td className="py-2 border-b text-center border-orange-300">{plan.name}</td>
                  <td className="py-2 border-b text-center border-orange-300">{plan.amount}</td>
                  <td className="py-2 border-b text-center border-orange-300">{plan.duration}</td>
                  {/* <td className="py-2 border-b text-center border-orange-300">{plan.description}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Myplans;