import React, { useState, useEffect } from 'react';

interface Transaction {
  planName: string;
  amountPaid: string;
  customerWallet: string;
}

const Transactionhistory: React.FC = () => {
  // Sample initial transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      planName: "Gold",
      amountPaid: "$200",
      customerWallet: "0xABC123DEF456",
    },
    {
      planName: "Premium",
      amountPaid: "$300",
      customerWallet: "0xDEF789GHI012",
    },
    {
      planName: "Silver",
      amountPaid: "$100",
      customerWallet: "0xGHI345JKL678",
    },
  ]);

  // Simulate real-time updates for new transactions (you can replace this with actual API calls)
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction: Transaction = {
        planName: "Diamond",
        amountPaid: "$500",
        customerWallet: `0x${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
      };
      setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
    }, 5000); // Update every 5 seconds (for example)
    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  return (
    <div className="w-[30%] h-60 bg-zinc-950 p-4 rounded-xl shadow-lg overflow-hidden border-x-[1px] border-orange-300 ">
      <h2 className="text-2xl text-zinc-300 font-light mb-4 text-center">Transaction History</h2>

      {/* Transaction List Container with scroll */}
      <div className="h-full overflow-y-auto scrollbar-hidden">
        {transactions.map((transaction, index) => (
          <div key={index} className="bg-zinc-900 p-3 mb-3 rounded-lg shadow-md">
            <div className="flex justify-between text-orange-300">
              <span className=" text-zinc-200">Plan:</span>
              <span>{transaction.planName}</span>
            </div>
            <div className="flex justify-between text-orange-300">
              <span className=" text-zinc-200">Amount Paid:</span>
              <span>{transaction.amountPaid}</span>
            </div>
            <div className="flex justify-between text-orange-300">
              <span className=" text-zinc-200">Wallet Address:</span>
              <span>{transaction.customerWallet}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactionhistory;
