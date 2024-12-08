import React, { useState, useEffect } from "react";
import PaymentWidget from "@requestnetwork/payment-widget/react";
import {getAllPlans} from "../Utils/getAllPlans";
interface Offers {
  name: string;
  type: string;
  amount: number;
  description: string;
  image?: string;
  duration: number;
}
interface ExploreProps {
  setchange:any;
 }

const Explore: React.FC<ExploreProps> = ({setchange}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offers | null>(null);
  const [modalType, setModalType] = useState<"details" | "buy">("details");
  const [offers, setOffers] = useState<Offers[]>([]);
  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await getAllPlans();
      if (plans) {
        setOffers(plans);
      }
    };
    fetchPlans();
  }, []);
      

  const [isPaymentWidgetReady, setIsPaymentWidgetReady] = useState(false);

  // Preload payment widget
  useEffect(() => {
    setIsPaymentWidgetReady(true);
  }, []);

  const handleViewDetails = (offer: Offers, event: React.MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  document.body.style.overflow = "hidden";
  setSelectedOffer(offer);
    setModalType("details");
  setIsModalOpen(true);
};

  const handleBuySubscription = (offer: Offers, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    document.body.style.overflow = "hidden";
    setSelectedOffer(offer);
    setModalType("buy");
    setIsModalOpen(true);
  };
const closeModal = () => {
  // Re-enable scrolling on the body
  document.body.style.overflow = "unset";
  setIsModalOpen(false);
};
  const paymentWidget = (
    <PaymentWidget
      sellerInfo={{
        logo: selectedOffer?.image,
        name: selectedOffer?.name || "Company",
      }}
      productInfo={{
        name:`Duration: ${selectedOffer?.duration.toString()} ${selectedOffer?.duration.toString() == "1" ? "month" : "months"}`  || "Subscription",
        description: selectedOffer?.description || "",
        image: selectedOffer?.image || "",
      }}
      amountInUSD={selectedOffer?.amount || 0}
      sellerAddress="0x1c32A90A83511534F2582E631314569ff6C76875"
      supportedCurrencies={[
        "REQ-mainnet",
        "ETH-mainnet",
        "USDC-mainnet",
        "USDT-mainnet",
        "MNT-mainnet",
        "AXS-mainnet",
        "AUDIO-mainnet",
        "RAI-mainnet",
        "SYLO-mainnet",
        "LDO-mainnet",
        "UST-mainnet",
        "MIR-mainnet",
        "INJ-mainnet",
        "OCEAN-mainnet",
        "ANKR-mainnet",
        "RLY-mainnet",
        "ETH-sepolia-sepolia",
        "fUSDT-sepolia",
        "fUSDC-sepolia",
        "DAI-bsc",
        "BUSD-bsc",
        "USDC-avalanche",
        "USDT-avalanche",
        "AVAX-avalanche",
        "USDC-optimism",
        "USDT-optimism",
        "DAI-optimism",
        "FTM-fantom",
      ]}
      persistRequest={true}
      onPaymentSuccess={(request) => {
        console.log("Payment successful:", request);
        setTimeout(() => {
          setchange(true);
          closeModal();
        }, 5000);
      }}
      onError={(error) => {
        console.error(error);
      }}
    />
  );
console.log(offers);
  return (
    <>
      <div className="pb-10 border-b-[1px] border-orange-400 w-[90%] mx-auto">
        <div className="mt-20 mb-20 text-center text-5xl tracking-tighter font-montserrat font-light hover:text-orange-400 transition-colors duration-300 cursor-pointer text-white ">
          Explore Offers
        </div>
        <div
          className="container w-[90%] h-[60rem] bg-zinc-950 mt-5 border-y-2 border-orange-400 mx-auto rounded-3xl overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-zinc-950 shadow-lg rounded-xl p-5 flex flex-col justify-between h-[20rem] border-[0.1px] border-zinc-600 hover:shadow-normal hover:shadow-orange-400 transition-all 1000ms"
            >
              <div>
                <h3 className="text-3xl font-bold text-zinc-300 pt-6">
                  {offer.name}
                </h3>
                <p className="text-base text-gray-200 pt-4">
                  <span className="text-orange-400 text-lg">Duration:</span>{" "}
                  {offer.duration} {offer.duration > 1 ? "months" : "month"}
                </p>
                <p className="text-base text-gray-200 pt-2">
                  <span className="text-lg">Amount:</span> <span>$</span>
                  {offer.amount}
                </p>
                <p className=" text-gray-400 text-sm line-clamp-3 pt-4">
                  {offer.description}
                </p>
              </div>
              <button
                type="button"
                className="bg-transparent w-[90%] mx-auto text-white py-2 px-4 rounded hover:bg-zinc-900 hover:text-orange-400"
                onClick={(e) => handleViewDetails(offer, e)}
              >
                View Details
              </button>
              <button
                type="button"
                className="bg-transparent w-[90%] mx-auto text-white py-2 px-4 rounded hover:bg-zinc-900 hover:text-orange-400"
                onClick={(e) => handleBuySubscription(offer, e)}
              >
                Buy Subscription
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedOffer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          tabIndex={-1}
        >
          <div
            className="bg-zinc-900 p-8 rounded-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-orange-400 font-bold">
                {selectedOffer.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-orange-400"
              >
                ✕
              </button>
            </div>

            {modalType === "details" ? (
              <div>
                <p className="text-zinc-300 mb-2">
                  Duration: {selectedOffer.duration}{" "}
                  {selectedOffer.duration > 1 ? "months" : "month"}
                </p>
                <p className="text-zinc-300 mb-4">
                  Amount: ${selectedOffer.amount}
                </p>
                <p className="text-zinc-400">{selectedOffer.description}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-zinc-300 mb-4">
                  <p className="mb-2">
                    {" "}
                    Duration: {selectedOffer.duration}{" "}
                    {selectedOffer.duration > 1 ? "months" : "month"}
                  </p>
                  <p>Amount: ${selectedOffer.amount}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  {isPaymentWidgetReady ? (
                    paymentWidget
                  ) : (
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-400"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Explore;
