import React, { useState } from "react";

interface Subscription {
  companyName: string;
  subscriptionType: string;
  subscriptionStatus: string;
  subscriptionAmount: string;
}

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
setSubscriptions([
  {
    companyName: "Amazon",
    subscriptionType: "Premium",
    subscriptionStatus: "Active",
    subscriptionAmount: "$120",
  },
  {
    companyName: "Netflix",
    subscriptionType: "Gold",
    subscriptionStatus: "Inactive",
    subscriptionAmount: "$100",
  },
  {
    companyName: "Spotify",
    subscriptionType: "Silver",
    subscriptionStatus: "Active",
    subscriptionAmount: "$50",
  },
]);
  return (
    <div className="w-[90%] mx-auto pb-10">
      <div className="mb-20 mt-20 text-center text-5xl tracking-tighter text-zinc-300 font-light font-montserrat hover:text-orange-400 transition-colors duration-300 cursor-pointer">
        Manage Subscriptions
      </div>

      <div className="container w-[90%] h-[40rem] bg-zinc-950 mt-5 border-y-2 border-orange-400 mx-auto rounded-3xl overflow-y-auto p-6">
        <table className="w-full text-left text-zinc-300">
          <thead className="sticky -top-6 bg-zinc-950">
            <tr>
              <th className="px-4 py-2 border-b border-orange-400">
                Company Name
              </th>
              <th className="px-4 py-2 border-b border-orange-400">
                Subscription Type
              </th>
              <th className="px-4 py-2 border-b border-orange-400">
                Subscription Status
              </th>
              <th className="px-4 py-2 border-b border-orange-400">
                Subscription Amount
              </th>
              <th className="px-4 py-2 border-b border-orange-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription, index) => (
              <tr key={index} className="hover:bg-zinc-800">
                <td className="px-4 py-2 border-b border-gray-700">
                  {subscription.companyName}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {subscription.subscriptionType}
                </td>
                <td
                  className={`px-4 py-2 border-b border-gray-700 ${
                    subscription.subscriptionStatus === "Active"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {subscription.subscriptionStatus}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {subscription.subscriptionAmount}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  <button className="bg-orange-400 text-white py-1 px-3 rounded hover:bg-orange-500">
                    {subscription.subscriptionStatus === "Active"
                      ? "Manage"
                      : "Renew"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscriptions;
