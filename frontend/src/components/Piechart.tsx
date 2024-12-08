import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { getSubscriptionRevenue } from '../Utils/getsubscriptionrevenue';
import { useData } from '../Utils/datacontext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ethers } from "ethers";
ChartJS.register(ArcElement, Tooltip, Legend);

interface Plan {
  name: string;
  amount: number;
  duration: string;
  description: string;
}

const Piechart: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bwalletAddress ,bsetWalletAddress} = useData();

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
    const fetchSubscriptions = async () => {
      if (!bwalletAddress) {
        setLoading(false);
        return;
      }

      try {
        const data = await getSubscriptionRevenue(
          bwalletAddress
        );
       setPlans(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [bwalletAddress]);

  if (loading) {
    return (
      <div className="w-[30%] h-60 bg-zinc-950 shadow-lg flex items-center justify-center">
        <p className="text-zinc-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[30%] h-60 bg-zinc-950 shadow-lg flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Handle case where there are no plans
  if (plans.length === 0) {
    const emptyData = {
      labels: [],
      datasets: [
        {
          label: "Revenue",
          data: [100], // Fake data to show a single white chart
          backgroundColor: ["#FFFFFF"], // White background
          borderColor: "#FFFFFF", // White border
          borderWidth: 2,
        },
      ],
    };
    const emptyOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: () => {
              return ""; // No tooltip since there's no data
            },
          },
        },
        legend: {
          display: false, // Hide legend
        },
      },
      maintainAspectRatio: false,
    };

    return (
      <div className="w-[30%] h-60 bg-zinc-950 shadow-lg flex flex-col items-center justify-center">
        <h2 className="text-2xl text-zinc-300 font-light mb-4">Revenue Distribution</h2>
        <div className="w-full h-full mt-5">
          <Pie data={emptyData} options={emptyOptions} />
        </div>
      </div>
    );
  }

  // If plans exist, display normal pie chart
  const totalRevenue = plans.reduce((total, plan) => total + plan.amount, 0);

  const data = {
    labels: plans.map((plan) => plan.name),
    datasets: [
      {
        label: "Revenue",
        data: plans.map((plan) => (plan.amount / totalRevenue) * 100), // Calculate the revenue percentage
        backgroundColor: [
          "#F97316", // Dark Orange
          "#FB923C", // Light Orange
          "#FDBA74", // Peach Orange
          "#FED7AA", // Pale Orange
          "#FEF3C7", // Soft Orange
        ],
        borderColor: "#000",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value.toFixed(2)}% of Total Revenue`; // Show percentage
          },
        },
      },
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#f97316", // Orange text
          font: {
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-[30%] h-60 bg-zinc-950 shadow-lg flex flex-col items-center justify-center">
      <h2 className="text-2xl text-zinc-300 font-light mb-4">Revenue Distribution</h2>
      <div className="w-full h-full mt-5">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default Piechart;
