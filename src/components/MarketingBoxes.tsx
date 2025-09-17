import React, { useState, useEffect } from "react";
import EbookGallery from "./EbookGallery"; // ⬅️ Import your EbookGallery component

const MarketingBoxes = () => {
  const [activeView, setActiveView] = useState<"home" | "refer" | "ebooks">("home");

  const [boxes] = useState([
    { title: "Refer a client" },
    { title: "About Property Investors" },
    { title: "Sharable Media" },
    { title: "eBooks" },
  ]);

  useEffect(() => {
    if (activeView === "refer") {
      const portalId = "46099113";
      const formId = "60609263-83bc-400b-a7eb-0c7f188d7bd4";

      // Only load script if not already loaded
      if (
        !document.querySelector(
          "script[src='https://js.hsforms.net/forms/embed/v2.js']"
        )
      ) {
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
  }, [activeView]);

  return (
    <div className="p-4">
      {/* Show dashboard boxes if home */}
      {activeView === "home" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {boxes.map((box, index) => (
            <div
              key={index}
              className="bg-[#d02c37] text-white p-12 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center justify-center text-2xl font-bold"
              onClick={() => {
                if (box.title === "Refer a client") {
                  setActiveView("refer");
                } else if (box.title === "eBooks") {
                  setActiveView("ebooks");
                }
              }}
            >
              {box.title}
            </div>
          ))}
        </div>
      )}

      {/* Show refer form */}
      {activeView === "refer" && (
        <div className="relative">
          <button
            onClick={() => setActiveView("home")}
            className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <div id="hubspotForm" className="w-full"></div>
        </div>
      )}

      {/* Show eBooks gallery */}
      {activeView === "ebooks" && (
        <div className="relative">
          <button
            onClick={() => setActiveView("home")}
            className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <EbookGallery />
        </div>
      )}
    </div>
  );
};

export default MarketingBoxes;
