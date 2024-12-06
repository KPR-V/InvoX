import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Customerhero from "./Customerhero";
import Explore from "./Explore";
import Subscriptions from "./Subscriptions";
import Navbar from "./Navbar";

const Customerdashboard = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'subscriptions'>('explore');
  const navigate = useNavigate();
  const customerHeroRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-zinc-950">
      <Navbar
        firstbutton="Home"
        secondbutton="Explore"
        thirdbutton="Subscriptions"
        onFirstButtonClick={() => navigate("/")}
        onSecondButtonClick={() => {
          setActiveTab('explore');
          handleScrollToSection(exploreRef);
        }}
        onThirdButtonClick={() => {
          setActiveTab('subscriptions');
          handleScrollToSection(exploreRef);
        }}
      />

      <section className="min-h-screen flex items-center" id="hero">
        <div ref={customerHeroRef} className="w-full">
          <Customerhero />
        </div>
      </section>

      <section className="min-h-screen" id="explore">
        <div ref={exploreRef} className="pt-10">
         
          {/* <div className="flex justify-center gap-8 mb-10">
            <button 
              onClick={() => setActiveTab('explore')}
              className={`text-2xl font-semibold ${
                activeTab === 'explore' ? 'text-orange-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Explore Businesses
            </button>
            <button 
              onClick={() => setActiveTab('subscriptions')}
              className={`text-2xl font-semibold ${
                activeTab === 'subscriptions' ? 'text-orange-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Manage Subscriptions
            </button>
          </div> */}
          
          <div>
            {activeTab === 'explore' ? <Explore /> : <Subscriptions />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Customerdashboard;
