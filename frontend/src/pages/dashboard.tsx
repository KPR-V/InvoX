import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

interface Invoice {
  id: string;
  clientName: string;
  amount: string;
  dueDate: string;
  status: string;
}

interface DashboardProps {
  userAddress: string | null;
  provider: ethers.providers.Web3Provider | null;
}

const Dashboard: React.FC<DashboardProps> = ({ userAddress, provider }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalIncome, setTotalIncome] = useState("0");
  const [outstandingPayments, setOutstandingPayments] = useState("0");

  useEffect(() => {
    const fetchInvoices = async () => {
      if (provider && userAddress) {
        // TODO: Implement fetching invoices from smart contract
        // This is a placeholder. Replace with actual smart contract interaction
        const mockInvoices: Invoice[] = [
          {
            id: "1",
            clientName: "Client A",
            amount: "1.5",
            dueDate: "2023-12-31",
            status: "Paid",
          },
          {
            id: "2",
            clientName: "Client B",
            amount: "2.0",
            dueDate: "2024-01-15",
            status: "Pending",
          },
          {
            id: "3",
            clientName: "Client C",
            amount: "1.0",
            dueDate: "2024-01-01",
            status: "Overdue",
          },
          // Add more mock invoices to demonstrate scrolling
          {
            id: "4",
            clientName: "Client D",
            amount: "3.0",
            dueDate: "2024-02-01",
            status: "Pending",
          },
          {
            id: "5",
            clientName: "Client E",
            amount: "2.5",
            dueDate: "2024-02-15",
            status: "Paid",
          },
          {
            id: "6",
            clientName: "Client F",
            amount: "1.8",
            dueDate: "2024-03-01",
            status: "Overdue",
          },
          {
            id: "7",
            clientName: "Client G",
            amount: "4.0",
            dueDate: "2024-03-15",
            status: "Pending",
          },
        ];
        setInvoices(mockInvoices);

        // Calculate total income and outstanding payments
        const total = mockInvoices.reduce(
          (sum, invoice) => sum + parseFloat(invoice.amount),
          0
        );
        const outstanding = mockInvoices
          .filter((invoice) => invoice.status !== "Paid")
          .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);

        setTotalIncome(total.toFixed(2));
        setOutstandingPayments(outstanding.toFixed(2));
      }
    };

    fetchInvoices();
  }, [provider, userAddress]);

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-4xl font-bold mb-6 text-indigo-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            Total Income
          </h2>
          <p className="text-3xl font-bold text-green-600">{totalIncome} ETH</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            Outstanding Payments
          </h2>
          <p className="text-3xl font-bold text-yellow-600">
            {outstandingPayments} ETH
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            Total Invoices
          </h2>
          <p className="text-3xl font-bold text-blue-600">{invoices.length}</p>
        </div>
      </div>
      <div className="flex-grow bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
          <table className="min-w-full">
            <thead className="bg-indigo-100 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.amount} ETH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        invoice.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/invoice/${invoice.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
