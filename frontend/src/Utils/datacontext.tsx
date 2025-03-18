import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface Business {
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  walletAddress: string;  
}

interface Plan {
  title: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface DataContextType {
  business: Business | null;
  plans: Plan[];
  setBusiness: (business: Business | null) => void;
  setPlans: (plans: Plan[]) => void;
  isAuthenticated: boolean;
  isBusinessAuthenticated: boolean;
  isBusinessCreated: boolean;
  setIsBusinessCreated: (value: boolean) => void;
  bwalletAddress: string;
  bsetWalletAddress: (address: string) => void;
  logout: () => void;
  businessLogout: () => void;
  walletAddress: string
  setWalletAddress: (address: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage
  const loadFromStorage = (key: string, defaultValue: any) => {
    if (typeof window === "undefined") return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const [business, setBusiness] = useState<Business | null>(() => loadFromStorage("business", null));
  const [walletAddress, setWalletAddress] = useState<string>(() => loadFromStorage("walletAddress", ""));
  const [plans, setPlans] = useState<Plan[]>(() => loadFromStorage("plans", []));
  const [bwalletAddress, bsetWalletAddress] = useState<string>(() => loadFromStorage("bwalletAddress", ""));
  const [isBusinessCreated, setIsBusinessCreated] = useState<boolean>(() => loadFromStorage("isBusinessCreated", false));
  
  // Derived authentication states
  const isAuthenticated = Boolean(walletAddress);
  const isBusinessAuthenticated = Boolean(bwalletAddress);

  // Save to localStorage when state changes
  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("walletAddress", JSON.stringify(walletAddress));
    }
  }, [walletAddress]);

  useEffect(() => {
    if (bwalletAddress) {
      localStorage.setItem("bwalletAddress", JSON.stringify(bwalletAddress));
    }
  }, [bwalletAddress]);

  useEffect(() => {
    if (business) {
      localStorage.setItem("business", JSON.stringify(business));
    }
  }, [business]);

  useEffect(() => {
    localStorage.setItem("plans", JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem("isBusinessCreated", JSON.stringify(isBusinessCreated));
  }, [isBusinessCreated]);

  // Logout functions
  const logout = () => {
    setWalletAddress("");
    localStorage.removeItem("walletAddress");
  };

  const businessLogout = () => {
    bsetWalletAddress("");
    setBusiness(null);
    localStorage.removeItem("bwalletAddress");
    localStorage.removeItem("business");
    localStorage.removeItem("isBusinessCreated");
  };

  const value = {
    business,
    plans,
    setBusiness,
    setPlans,
    isAuthenticated,
    isBusinessAuthenticated,
    isBusinessCreated,
    setIsBusinessCreated,
    bwalletAddress,     
    bsetWalletAddress,
    walletAddress,
    setWalletAddress,
    logout,
    businessLogout
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};