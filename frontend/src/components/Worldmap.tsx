import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
// import { getCustomerDistribution } from "../Utils/heatmap"

import { useData } from "../Utils/datacontext";

// Function to determine color based on customer count
const getColor = (count: number) => {
  if (count >= 300) return "#c2410c"; // Darkest orange
  if (count >= 200) return "#ea580c"; // Dark orange
  if (count >= 100) return "#f97316"; // Medium orange
  if (count > 0) return "#fb923c"; // Light orange
  return "#ffffff"; // White for no customers
};

const Worldmap: React.FC = () => {
  const [customerData, setCustomerData] = useState<Record<string, number>>({});
  const { bwalletAddress } = useData();

  useEffect(() => {
    const fetchCustomerDistribution = async () => {
      if (bwalletAddress) {
        const distribution = await getCustomerDistribution(bwalletAddress);
        setCustomerData(distribution);
      }
    };

    fetchCustomerDistribution();
  }, [bwalletAddress]);

  return (
    <div className="w-[30%] h-60 bg-zinc-950 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-light text-zinc-300 text-center">
        Global Customer Distribution
      </h2>
      <div className="w-full h-full">
        <ComposableMap
          projection="geoMercator"
          className="rounded-xl"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Geographies geography="https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/countries.geojson">
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties?.name || "";
                const customerCount = customerData[countryName] || 0;
                const color = getColor(customerCount);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={countryName ? color : "#2a2a2a"}
                    stroke="#000"
                    strokeWidth={0.5}
                    onClick={() => console.log(`${countryName}: ${customerCount} customers`)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default Worldmap;