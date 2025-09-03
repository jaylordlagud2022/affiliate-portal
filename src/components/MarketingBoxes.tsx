import React, { useState } from "react";

const MarketingBoxes = () => {
  const [boxes] = useState([
    { title: "eBook" },
    { title: "Email Template" },
    { title: "Forms" },
    { title: "QR Portal" },
  ]);

  return (
    <div className="p-4">
      {/* Dashboard Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bg-[#d02c37] text-white p-12 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center justify-center text-2xl font-bold"
          >
            {box.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketingBoxes;
