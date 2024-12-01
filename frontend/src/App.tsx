import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router,Route,Routes,Navigate,useNavigate} from "react-router-dom";
import Header from "./components/header";
import LandingPage from "./pages/landingpage";
import Dashboard from "./pages/dashboard";
import CreateInvoice from "./pages/createinvoice";
import InvoiceDetail from "./pages/invoicedetail";
import Analytics from "./pages/analytics";
import "./index.css"


function AppContent() {
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (provider) {
      provider.on("network", (_, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload();
        }
      });
      return () => {
        provider.removeAllListeners("network");
      };
    }
  }, [provider]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        
        setProvider(provider)
        setSigner(signer)
        setUserAddress(address)
        navigate('/dashboard')
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      console.log("Please install MetaMask!")
    }
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!userAddress) {
      return <Navigate to="/" replace />
    }
    return <>{children}</>
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      <Header userAddress={userAddress} onConnectWallet={connectWallet} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard userAddress={userAddress} provider={provider} />
            </ProtectedRoute>
          } />
          <Route path="/create-invoice" element={
            <ProtectedRoute>
              <CreateInvoice signer={signer} />
            </ProtectedRoute>
          } />
          <Route path="/invoice/:id" element={
            <ProtectedRoute>
              <InvoiceDetail provider={provider} signer={signer} />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics userAddress={userAddress} provider={provider} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

