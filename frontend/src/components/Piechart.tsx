import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Plan {
  name: string;
  amount: number;
  duration: string;
  description: string;
}

interface PiechartProps {
  plans: Plan[];
}

const Piechart: React.FC<PiechartProps> = ({ plans }) => {
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
