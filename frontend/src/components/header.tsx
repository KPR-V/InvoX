import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface HeaderProps {
  userAddress: string | null;
  onConnectWallet: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ userAddress, onConnectWallet }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Freelancer Marketplace
        </Link>
        <div className="flex items-center space-x-4">
          {userAddress && (
            <button
              onClick={copyToClipboard}
              className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {copied
                ? "Copied!"
                : `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
            </button>
          )}
          <nav>
            <ul className="flex space-x-4">
              {userAddress && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-blue-200 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/create-invoice"
                      className="hover:text-blue-200 transition-colors"
                    >
                      Create Invoice
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/analytics"
                      className="hover:text-blue-200 transition-colors"
                    >
                      Analytics
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          {!userAddress && (
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors font-medium"
              onClick={onConnectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
