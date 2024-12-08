import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

// Hardcoded customer data with country names and the number of customers
const customerData: Record<string, number> = {
  USA: 150,
  India: 300,
  Germany: 100,
  Brazil: 80,
  Australia: 120,
  China: 200,
  Canada: 50,
  Russia: 10,
  Japan: 140,
  UK: 90,
  France: 110,
  Mexico: 130,
  Italy: 60,
  SouthAfrica: 40,
  Spain: 70,
};

// Function to determine color based on customer count
const getColor = (count: number) => {
  if (count >= 300) return "#c2410c"; // Darkest orange (Most customers)
  if (count >= 200) return "#ea580c"; // Dark orange
  if (count >= 100) return "#f97316"; // Medium orange
  if (count > 0) return "#fb923c"; // Light orange
  return "#ffffff"; // White for no customers
};

const Worldmap: React.FC = () => {
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
          {/* Fetching world geography data */}
          <Geographies geography="https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/countries.geojson">
            {({ geographies }) =>
              geographies.map((geo) => {
                // Get the country name from the geo data
                const countryName = geo.properties?.name || "";

                // Check if the country exists in the customer data and get the count
                const customerCount = customerData[countryName] || 0;

                // Determine the color for land (countries)
                const color = customerCount ? getColor(customerCount) : "#ffffff"; // Lightest for no customers

                // Water bodies are represented when there's no country data (empty name)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={countryName ? color : "#2a2a2a"} // Water bodies are zinc-950 color
                    stroke="#000"
                    strokeWidth={0.5}
                    onClick={() => console.log(`Clicked ${countryName}`)} // Optionally log clicked country
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
