import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart: React.FC = () => {
  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Premium Plan",
        data: [5000, 7000, 8000, 7500, 9500, 9000, 10000, 11000, 10500, 9000, 7500, 7000],
        borderColor: "#f97316", // Orange
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Gold Plan",
        data: [4000, 6000, 7000, 6500, 8500, 5000, 9000, 9500, 9700, 10000, 10500, 12000],
        borderColor: "#fbbf24", // Lighter Orange
        backgroundColor: "rgba(251, 191, 36, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Silver Plan",
        data: [3000, 4000, 5000, 4500, 6000, 5800, 6500, 7000, 7500, 8500, 9000, 9500],
        borderColor: "#fde68a", // Lightest Orange
        backgroundColor: "rgba(253, 230, 138, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#f3f4f6",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#f3f4f6",
        },
        grid: {
          color: "transparent", // No vertical gridlines
        },
      },
      y: {
        ticks: {
          color: "#f3f4f6",
        },
        grid: {
          color: "#374151", // Horizontal gridlines
        },
      },
    },
  };

  return (
    <div className="w-[55%] bg-zinc-950  p-4">
      <div className="relative h-60">
        <Line data={data} options={options} />
      </div>
      <div className="text-center text-zinc-300 mt-4 text-lg">
        Total Revenue by Plans (Monthly)
      </div>
    </div>
  );
};

export default LineChart;
