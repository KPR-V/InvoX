import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsProps {
  userAddress: string | null;
  provider: ethers.providers.Web3Provider | null;
}

const Analytics: React.FC<AnalyticsProps> = ({ userAddress, provider }) => {
  const [earningsData, setEarningsData] = useState<any>(null);
  const [invoiceStatusData, setInvoiceStatusData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (provider && userAddress) {
        // TODO: Implement fetching analytics data from smart contract
        // This is a placeholder. Replace with actual smart contract interaction
        const mockEarningsData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Earnings (ETH)",
              data: [1.2, 1.8, 2.5, 2.0, 2.8, 3.1],
              backgroundColor: "rgba(99, 102, 241, 0.6)",
            },
          ],
        };
        setEarningsData(mockEarningsData);

        const mockInvoiceStatusData = {
          labels: ["Paid", "Pending", "Overdue"],
          datasets: [
            {
              data: [65, 25, 10],
              backgroundColor: ["#10B981", "#FBBF24", "#EF4444"],
            },
          ],
        };
        setInvoiceStatusData(mockInvoiceStatusData);
      }
    };

    fetchAnalyticsData();
  }, [provider, userAddress]);

  if (!earningsData || !invoiceStatusData) {
    return (
      <div className="text-center text-2xl text-indigo-600">
        Loading analytics data...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-4xl font-bold mb-6 text-indigo-900">Analytics</h1>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Earnings Over Time
          </h2>
          <div className="flex-grow">
            <Bar
              data={earningsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "ETH",
                      color: "#4F46E5",
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: "#4F46E5",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Invoice Status Distribution
          </h2>
          <div className="flex-grow flex items-center justify-center">
            <Pie
              data={invoiceStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#4F46E5",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
