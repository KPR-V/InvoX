import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

interface InvoiceDetailProps {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ provider, signer }) => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (provider && id) {
        // TODO: Implement fetching invoice details from smart contract
        // This is a placeholder. Replace with actual smart contract interaction
        const mockInvoice = {
          id,
          clientName: "Client A",
          clientAddress: "0x1234...5678",
          amount: "1.5",
          dueDate: "2023-12-31",
          description: "Web development services",
          status: "Pending",
          createdAt: "2023-06-01",
        };
        setInvoice(mockInvoice);
      }
    };

    fetchInvoiceDetails();
  }, [provider, id]);

  const handlePayment = async () => {
    if (!signer || !invoice) {
      alert("Please connect your wallet or wait for invoice details to load");
      return;
    }

    // TODO: Implement payment logic with smart contract interaction
    console.log("Processing payment for invoice:", invoice.id);
    alert("Payment processed successfully!");
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Invoice Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Invoice #{invoice.id}</h2>
          <p className="text-gray-600">Created on: {invoice.createdAt}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Client Information</h3>
          <p>
            <strong>Name:</strong> {invoice.clientName}
          </p>
          <p>
            <strong>Address:</strong> {invoice.clientAddress}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Invoice Details</h3>
          <p>
            <strong>Amount:</strong> {invoice.amount} ETH
          </p>
          <p>
            <strong>Due Date:</strong> {invoice.dueDate}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
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
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p>{invoice.description}</p>
        </div>
        {invoice.status === "Pending" && (
          <div className="mt-6">
            <button
              onClick={handlePayment}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Pay Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
