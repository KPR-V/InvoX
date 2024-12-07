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
  const [change, setchange] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (change) {
      setActiveTab('subscriptions');
      setchange(false); // Reset the change state
    }
  }, [change]);

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
          <div>
            {activeTab === 'explore' ? <Explore  setchange={setchange} /> : <Subscriptions />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Customerdashboard;
