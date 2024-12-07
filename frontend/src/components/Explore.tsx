import React, { useState } from "react";

interface Offers {
  name: string;
  type: string;
  amount: number;
  description: string;
}

const Explore: React.FC = () => {
  const [offers, setOffers] = useState<Offers[]>([
    {
      name: "Spotify",
      type: "Silver",
      amount: 50,
      description: "Innovating the future of technology.",
    },
    {
      name: "Spotify",
      type: "Gold",
      amount: 100,
      description: "Eco-friendly products for a sustainable planet.",
    },
    {
      name: "Spotify",
      type: "Diamond",
      amount: 250,
      description: "Professional services tailored to your needs.",
    },
    {
      name: "Netflix",
      type: "Standard",
      amount: 10,
      description: "Innovating the future of technology.",
    },
    {
      name: "Netflix",
      type: "Premium",
      amount: 30,
      description: "Eco-friendly products for a sustainable planet.",
    },
    {
      name: "Netflix",
      type: "Elite",
      amount: 70,
      description: "Professional services tailored to your needs.",
    },
    {
      name: "Tech Innovators",
      type: "Normal",
      amount: 150,
      description: "Innovating the future of technology.",
    },
    {
      name: "Amazon",
      type: "Premium",
      amount: 500,
      description: "Eco-friendly products for a sustainable planet.",
    },
    {
      name: "Service Pros",
      type: "Standard",
      amount: 20,
      description: "Professional services tailored to your needs.",
    },
  ]);

  return (
    <>
      <div className=" pb-10 border-b-[1px] border-orange-400 w-[90%] mx-auto">
        <div className="mt-20 mb-20 text-center text-5xl tracking-tighter font-montserrat font-light transition-colors duration-300 cursor-pointer text-white ">
          Explore Offers
        </div>
        <div
          className="container w-[90%] h-[60rem] bg-zinc-950 mt-5 border-y-2 border-orange-400 mx-auto rounded-3xl overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* Internet Explorer 10+ */,
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
                  <span className="text-orange-400 text-lg">Type:</span> {offer.type}
                </p>
                <p className="text-base text-gray-200 pt-2">
                 <span className="text-lg">Amount:</span> <span>$</span>{offer.amount}
                </p>
                <p className=" text-gray-400 text-sm line-clamp-3 pt-4">
                  {offer.description}
                </p>
              </div>
              <button className=" bg-transparent w-[90%] mx-auto text-white py-2 px-4 rounded hover:bg-zinc-900 hover:text-orange-400">
                View Details
              </button>
              <button className=" bg-transparent w-[90%] mx-auto text-white py-2 px-4 rounded hover:bg-zinc-900 hover:text-orange-400">
                Buy Subscription
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
