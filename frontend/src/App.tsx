import { useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Businesssection from "./components/Businesssection";
import Customersection from "./components/Customersection";
import Customerdashboard from "./components/Customerdashboard";
import Businessdashboard from "./components/Businessdashboard";
import Hero from "./components/Hero";
import Gotobusinessdashboard from "./components/Gotobusinessdashboard";
import { DataProvider } from "./Utils/datacontext";
function App() {
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
    <DataProvider>
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
        <Route path="/dashboard" element={<Customerdashboard />} />
        <Route path="/dashboardbusiness" element={<Businessdashboard />} />
      </Routes>
    </Router>
    </DataProvider>
  );
}

export default App;
