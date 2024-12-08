// Subscriptions.tsx
import React, { useState, useEffect } from "react";
import { getCustomerSubscriptions } from "../Utils/getcustomersubscriptions";
import { useData } from "../Utils/datacontext";

interface Subscription {
  name: string;
  duration: string;
  subscriptionFee: string;
  purchaseDate: string;
}

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { walletAddress } = useData();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        const fetchedSubscriptions = await getCustomerSubscriptions(walletAddress);
        setSubscriptions(fetchedSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [walletAddress]);

  const parseSubscriptionName = (fullName: string) => {
    const parts = fullName.split('Duration:');
    const name = parts[0].replace('Name :', '').trim();
    const duration = parts[1]?.trim() || '';
    return { name, duration };
  };

  if (loading) {
    return <div className="text-center text-zinc-300">Loading...</div>;
  }

  return (
    <div className="w-[90%] mx-auto pb-10">
      <div className="mb-20 mt-20 text-center text-5xl tracking-tighter text-zinc-300 font-light font-montserrat hover:text-orange-400 transition-colors duration-300 cursor-pointer">
        My Subscriptions
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
              {subscriptions.map((subscription, index) => {
                const { name, duration } = parseSubscriptionName(subscription.name);
                return (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b border-orange-400">{name}</td>
                    <td className="px-4 py-2 border-b border-orange-400">{duration}</td>
                    <td className="px-4 py-2 border-b border-orange-400">{subscription.subscriptionFee}</td>
                    <td className="px-4 py-2 border-b border-orange-400">{subscription.purchaseDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;