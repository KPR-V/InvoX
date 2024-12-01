import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-6 text-indigo-900">
        Welcome to Decentralized Freelancer Marketplace
      </h1>
      <p className="mb-8 text-xl text-gray-700">
        Manage your invoices on-chain and get paid securely.
      </p>
      <Link
        to="/dashboard"
        className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
      >
        Get Started
      </Link>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Create Invoices
          </h2>
          <p className="text-gray-600">
            Easily create and manage your invoices on the blockchain.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Secure Payments
          </h2>
          <p className="text-gray-600">
            Receive payments directly to your wallet through smart contracts.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Analytics
          </h2>
          <p className="text-gray-600">
            Track your earnings and invoice status with detailed analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
