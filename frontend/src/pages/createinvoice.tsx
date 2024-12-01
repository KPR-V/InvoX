import { useState } from "react";
import { ethers } from "ethers";

interface CreateInvoiceProps {
  signer: ethers.Signer | null;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ signer }) => {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) {
      alert("Please connect your wallet");
      return;
    }

    // TODO: Implement invoice creation logic with smart contract interaction
    console.log("Creating invoice:", {
      clientName,
      clientAddress,
      amount,
      dueDate,
      description,
      isRecurring,
    });

    // Reset form
    setClientName("");
    setClientAddress("");
    setAmount("");
    setDueDate("");
    setDescription("");
    setIsRecurring(false);

    alert("Invoice created successfully!");
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-indigo-900">
          Create Invoice
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label
                className="block text-indigo-600 text-sm font-bold mb-2"
                htmlFor="clientName"
              >
                Client Name
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                id="clientName"
                type="text"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                className="block text-indigo-600 text-sm font-bold mb-2"
                htmlFor="clientAddress"
              >
                Client Wallet Address
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                id="clientAddress"
                type="text"
                placeholder="Enter client wallet address"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                className="block text-indigo-600 text-sm font-bold mb-2"
                htmlFor="amount"
              >
                Amount (ETH)
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                className="block text-indigo-600 text-sm font-bold mb-2"
                htmlFor="dueDate"
              >
                Due Date
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <label
                className="block text-indigo-600 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Invoice Description
              </label>
              <textarea
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                id="description"
                placeholder="Enter invoice description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <span className="ml-2 text-indigo-600">Recurring Payment</span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
              type="submit"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
