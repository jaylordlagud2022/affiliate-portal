import React, { useState, useEffect } from "react";

const MarketingBoxes = () => {
  const [showModal, setShowModal] = useState(false);

  const [boxes] = useState([
    { title: "Refer a client" },
    { title: "About Property Investors" },
    { title: "Sharable Media" },
    { title: "eBooks" },
  ]);

  useEffect(() => {
    if (showModal) {
      const portalId = "46099113";
      const formId = "60609263-83bc-400b-a7eb-0c7f188d7bd4";

      // Only load script if not already loaded
      if (!document.querySelector("script[src='https://js.hsforms.net/forms/embed/v2.js']")) {
        const script = document.createElement("script");
        script.src = "https://js.hsforms.net/forms/embed/v2.js";
        script.async = true;
        script.onload = () => {
          if ((window as any).hbspt) {
            (window as any).hbspt.forms.create({
              region: "na1",
              portalId,
              formId,
              target: "#hubspotForm",
            });
          }
        };
        document.body.appendChild(script);
      } else {
        if ((window as any).hbspt) {
          (window as any).hbspt.forms.create({
            region: "na1",
            portalId,
            formId,
            target: "#hubspotForm",
          });
        }
      }
    }
  }, [showModal]);

  return (
    <div className="p-4">
      {/* Dashboard Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bg-[#d02c37] text-white p-12 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center justify-center text-2xl font-bold"
            onClick={() => {
              if (box.title === "Refer a client") {
                setShowModal(true);
              }
            }}
          >
            {box.title}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 sm:mx-auto p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                const container = document.getElementById("hubspotForm");
                if (container) container.innerHTML = ""; // clear form safely
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✕
            </button>

            {/* HubSpot Form Container */}
            <div id="hubspotForm" className="w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingBoxes;
