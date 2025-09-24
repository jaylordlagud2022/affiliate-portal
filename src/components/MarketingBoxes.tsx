import React, { useState, useEffect } from "react";
import EbookGallery from "./EbookGallery"; // ⬅️ Import your EbookGallery component

const MarketingBoxes = () => {
  const [activeView, setActiveView] = useState<"home" | "ebooks">("home");
  const [showReferModal, setShowReferModal] = useState(false);

  const [boxes] = useState([
    { title: "Refer a client" },
    { title: "About Property Investors" },
    { title: "Sharable Media" },
    { title: "eBooks" },
  ]);

  // 🔑 Get logged-in email from localStorage
  const getLoggedInEmail = (): string | null => {
    const storedUser = localStorage.getItem("currentUser");
    console.log("🔑 Raw currentUser:", storedUser);

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const hubspotData = parsed.hubspot || {};
        return hubspotData.email || null; // ✅ use email directly
      } catch (e) {
        console.error("❌ Error parsing currentUser:", e);
      }
    }
    return null;
  };

  useEffect(() => {
    if (showReferModal) {
      const portalId = "46099113";
      const formId = "60609263-83bc-400b-a7eb-0c7f188d7bd4";

      // Clear previous form if reopening
      const formContainer = document.getElementById("hubspotForm");
      if (formContainer) {
        formContainer.innerHTML = "";
      }

      const loadForm = () => {
        if ((window as any).hbspt) {
          (window as any).hbspt.forms.create({
            region: "na1",
            portalId,
            formId,
            target: "#hubspotForm",
            onFormReady: ($form: any) => {
              // ✅ Fill hidden email field
              const hiddenEmail = $form.querySelector("input[name='email']");
              if (hiddenEmail) {
                hiddenEmail.value = getLoggedInEmail() || "no-email@example.com";
                console.log("✅ Hidden email set:", hiddenEmail.value);
              } else {
                console.warn("⚠️ Email hidden field not found in form.");
              }
            },
          });
        }
      };

      // Only load HubSpot script once
      if (!document.querySelector("script[src='https://js.hsforms.net/forms/embed/v2.js']")) {
        const script = document.createElement("script");
        script.src = "https://js.hsforms.net/forms/embed/v2.js";
        script.async = true;
        script.onload = loadForm;
        document.body.appendChild(script);
      } else {
        loadForm();
      }
    }
  }, [showReferModal]);

  return (
    <div className="p-4">
      {/* Dashboard Boxes */}
      {activeView === "home" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {boxes.map((box, index) => (
            <div
              key={index}
              className="bg-[#EFEFEF] text-[#d02c37] p-12 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center justify-center text-2xl font-bold"
              onClick={() => {
                if (box.title === "Refer a client") {
                  setShowReferModal(true);
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

      {/* Refer a Client Modal */}
      {showReferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <button
              onClick={() => setShowReferModal(false)}
              className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              ✕
            </button>
            <div className="w-full flex items-center justify-center">
              <div id="hubspotForm" className="w-full max-w-lg"></div>
            </div>
          </div>
        </div>
      )}

      {/* eBooks gallery */}
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
