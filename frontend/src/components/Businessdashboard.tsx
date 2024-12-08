import { useState } from "react";
import Analyticscard from "./Analyticscard";
import Linechart from "./Linechart";
import Myplans from "./Myplans";
import Piechart from "./Piechart";
import Worldmap from "./Worldmap";
import Transactionhistory from "./Transactionhistory";
import PlanModal from "./PlanModal";


const Businessdashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  
  

  // Function to open the modal
  const handleCreateNewPlan = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle plan creation
  const  handleCreatePlan= (newPlan: { name: string; amount: number; duration: string; description: string }) => {
    setPlans([...plans, newPlan]);

    // Update revenue and customer count (simplified logic for demo purposes)
    
  };

  return (
    <>
      <div className="bg-zinc-950 w-full h-full">
        <div className="flex flex-col w-[90%] mx-auto h-full bg-zinc-950">
          <div className="heading flex justify-between p-2 my-10">
          <div className="text-5xl font-montserrat text-gray-400 font-light bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-pink-500 animate-gradient bg-[length:300%_300%]">
              Business Dashboard
            </div>
            <button
              className="w-40 h-12 bg-orange-400 rounded-lg font-semibold"
              onClick={handleCreateNewPlan}
            >
              Create New Plan
            </button>
          </div>
          <div className="flex flex-col justify-between mb-10 bg-zinc-950">
            <div className="firstrow w-[100%]">
              <div className="cards w-[100%] flex justify-between">
                <div className="w-[22%]">
                  <Analyticscard Header="Total Revenue" Number="$13856" />
                </div>
                <div className="w-[22%]">
                  <Analyticscard Header="Total Customers" Number="215" />
                </div>
                <div className="w-[22%]">
                  <Analyticscard Header="Revenue this Month" Number="2643" />
                </div>
                <div className="w-[22%]">
                  <Analyticscard Header="Customers this Month" Number="42" />
                </div>
              </div>
            </div>
            <div className="secondrow w-[100%] h-60 mt-10 flex justify-between">
              <Linechart />
              <Myplans />
            </div>
            <div className="thirdrow w-[100%] h-64 bg-zinc-950 mt-24 flex justify-between">
              <Piechart plans={plans}/>
              <Worldmap />
              <Transactionhistory />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreatePlan={()=>{}}
      />
    </>
  );
};

export default Businessdashboard;
