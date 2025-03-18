import { useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from "./Utils/walletConfig";
import Navbar from "./components/Navbar";
import Businesssection from "./components/Businesssection";
import Customersection from "./components/Customersection";
import Customerdashboard from "./components/Customerdashboard";
import Businessdashboard from "./components/Businessdashboard";
import Hero from "./components/Hero";
import Gotobusinessdashboard from "./components/Gotobusinessdashboard";
import { DataProvider, useData } from "./Utils/datacontext";

// Create a client for React Query
const queryClient = new QueryClient();

// Protected Route component
const ProtectedBusinessRoute = ({ children }: { children: React.ReactNode }) => {
  const { isBusinessAuthenticated, isBusinessCreated } = useData();
  
  if (!isBusinessAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (!isBusinessCreated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const ProtectedCustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useData();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Component with RainbowKit
const AppWithProviders = () => {
  const businessSectionRef = useRef<HTMLDivElement>(null);
  const customerSectionRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll Handlers
  const handleFirstButtonClick = () => {
    if (businessSectionRef.current) {
      businessSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSecondButtonClick = () => {
    if (customerSectionRef.current) {
      customerSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Show the modal when "Business Dashboard" is clicked
  const handleThirdButtonClick = () => {
    setIsModalOpen(true);
  };

  // Close Modal Handler
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div
              className="bg-zinc-950 h-full w-full !scroll-smooth"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* Internet Explorer 10+ */,
              }}
            >
              <Navbar
                firstbutton="Create Business"
                secondbutton="Customer Login"
                thirdbutton="Business Dashboard"
                onFirstButtonClick={handleFirstButtonClick}
                onSecondButtonClick={handleSecondButtonClick}
                onThirdButtonClick={handleThirdButtonClick}
              />
              <Hero />
              <div ref={businessSectionRef}>
                <Businesssection />
              </div>
              <div ref={customerSectionRef}>
                <Customersection />
              </div>
              {isModalOpen && <Gotobusinessdashboard onClose={closeModal} />}
            </div>
          }
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedCustomerRoute>
              <Customerdashboard />
            </ProtectedCustomerRoute>
          } 
        />
        <Route 
          path="/dashboardbusiness" 
          element={
            <ProtectedBusinessRoute>
              <Businessdashboard />
            </ProtectedBusinessRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <DataProvider>
            <AppWithProviders />
          </DataProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
