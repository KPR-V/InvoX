import React, { useState, useEffect } from "react";
import { useData } from "../Utils/datacontext";
interface Subscription {
  name: string;
  duration: string;
  subscriptionFee: string;
  purchaseDate: string;
}

const Subscriptions: React.FC = () => {
  const { walletAddress } = useData();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const fetchSubscriptionsForWallet = async () => {
      if (!walletAddress) return;

      console.log("Wallet address available:", walletAddress);
      // Here you can add API call to fetch subscriptions for this wallet
      // For example:
      // const userSubscriptions = await fetchUserSubscriptions(walletAddress);
      // setSubscriptions(userSubscriptions);
    };

    fetchSubscriptionsForWallet();
  }, [walletAddress]);

  return (
    <div className="w-[90%] mx-auto pb-10">
      <div className="mb-20 mt-20 text-center text-5xl tracking-tighter text-zinc-300 font-light font-montserrat hover:text-orange-400 transition-colors duration-300 cursor-pointer">
        Manage Subscriptions
      </div>

      <div className="container w-[90%] h-[40rem] bg-zinc-950 mt-5 border-y-2 border-orange-400 mx-auto rounded-3xl overflow-y-auto p-6">
        {subscriptions.length === 0 ? (
          <div className="text-center text-zinc-300">No subscriptions found</div>
        ) : (
          <table className="w-full text-left text-zinc-300">
            <thead className="sticky -top-6 bg-zinc-950">
              <tr>
                <th className="px-4 py-2 border-b border-orange-400">Name</th>
                <th className="px-4 py-2 border-b border-orange-400">Duration</th>
                <th className="px-4 py-2 border-b border-orange-400">Fee (ETH)</th>
                <th className="px-4 py-2 border-b border-orange-400">Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b border-orange-400">{subscription.name}</td>
                  <td className="px-4 py-2 border-b border-orange-400">{subscription.duration}</td>
                  <td className="px-4 py-2 border-b border-orange-400">{subscription.subscriptionFee}</td>
                  <td className="px-4 py-2 border-b border-orange-400">{subscription.purchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;