import { useState } from "react";
import Analyticscard from "./Analyticscard";
import Linechart from "./Linechart";
import Myplans from "./Myplans";
import Piechart from "./Piechart";
import Worldmap from "./Worldmap";
import Transactionhistory from "./Transactionhistory";
import PlanModal from "./PlanModal";
import { useEffect } from "react";
import { useData } from "../Utils/datacontext";
import {fetchRevenue} from "../Utils/calculatetotalrevenueeth";
import { convertETHtoUSD } from "../Utils/convertethtousd";
import { getLastMonthMetrics } from "../Utils/getlastmonthmetrics";
import { getTotalUsers } from "../Utils/gettotalusers";

const Businessdashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<string>("0");
  const [totalRevenueUSD, setTotalRevenueUSD] = useState<string>("0");
  const [monthlyMetrics, setMonthlyMetrics] = useState({ 
    newUsers: 0, 
    uniqueUsers: 0,  // Add this new state
    monthlyRevenue: "0" 
  });
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const { bwalletAddress } = useData();
   useEffect(() => {
     const fetchData = async () => {
       if (!bwalletAddress) {
         setLoading(false);
         return;
       }

       try {
         const revenue = await fetchRevenue(bwalletAddress);
         setTotalRevenue(revenue || "0");
         
         // Convert ETH to USD
         if (revenue) {
           const usdAmount = await convertETHtoUSD(revenue);
           setTotalRevenueUSD(usdAmount);
         }

         // Fetch last month's metrics
         const metrics = await getLastMonthMetrics(bwalletAddress);
         setMonthlyMetrics(metrics);

         // Fetch total users
         const users = await getTotalUsers(bwalletAddress);
         setTotalUsers(users);
       } catch (error) {
         console.error("Error fetching data:", error);
       } finally {
         setLoading(false);
       }
     };

     fetchData();
   }, [bwalletAddress]);

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
                {loading ? (
                  <div className="w-full flex justify-between">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[22%] h-32 bg-zinc-900 animate-pulse rounded-xl"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="w-[22%]">
                      <Analyticscard
                        Header="Total Revenue"
                        Number={`${totalRevenueUSD} USD`}
                      />
                    </div>
                    <div className="w-[22%]">
                      <Analyticscard
                        Header="Total Customers"
                        Number={totalUsers.toString()}
                      />
                    </div>
                    <div className="w-[22%]">
                      <Analyticscard
                        Header="Revenue this Month"
                        Number={`${monthlyMetrics.monthlyRevenue} ETH`}
                      />
                    </div>
                    <div className="w-[22%]">
                      <Analyticscard
                        Header="Customers this Month"
                        Number={monthlyMetrics.uniqueUsers.toString()}  // Changed from newUsers to uniqueUsers
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="secondrow w-[100%] h-60 mt-10 flex justify-between">
              {loading ? (
                <div className="w-full flex justify-between">
                  <div className="w-[65%] bg-zinc-900 animate-pulse rounded-xl"></div>
                  <div className="w-[30%] bg-zinc-900 animate-pulse rounded-xl"></div>
                </div>
              ) : (
                <>
                  <Linechart />
                  <Myplans />
                </>
              )}
            </div>
            <div className="thirdrow w-[100%] h-64 bg-zinc-950 mt-24 flex justify-between">
              {loading ? (
                <div className="w-full flex justify-between">
                  <div className="w-[30%] bg-zinc-900 animate-pulse rounded-xl"></div>
                  <div className="w-[30%] bg-zinc-900 animate-pulse rounded-xl"></div>
                  <div className="w-[30%] bg-zinc-900 animate-pulse rounded-xl"></div>
                </div>
              ) : (
                <>
                  <Piechart />
                  <Worldmap />
                  <Transactionhistory />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreatePlan={() => {}}
      />
    </>
  );
};

export default Businessdashboard;
