import { createContext, useContext, ReactNode, useState } from "react";


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
  setBusiness: (business: Business) => void;
  setPlans: (plans: Plan[]) => void;
  bwalletAddress: string; // Add this field
  bsetWalletAddress: (address: string) => void; // Add this function
  walletAddress: string
  setWalletAddress: (address: string) => void;
}


const DataContext = createContext<DataContextType | undefined>(undefined);


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [bwalletAddress, bsetWalletAddress] = useState<string>("");  // Add this state
  const value = {
    business,
    plans,
    setBusiness,
    setPlans,
    bwalletAddress,     
    bsetWalletAddress,
    walletAddress,
    setWalletAddress
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