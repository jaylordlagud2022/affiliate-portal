import React, { useState, useEffect } from "react";
import EbookGallery from "./EbookGallery";
import { UserPlus, Info, Share2, BookOpen, X } from "lucide-react";

const MarketingBoxes = () => {
  const [activeView, setActiveView] = useState<"home" | "ebooks">("home");
  const [showReferModal, setShowReferModal] = useState(false);

  const [boxes] = useState([
    { key: "refer", title: "Refer a client", icon: <UserPlus className="w-[65px] h-[65px] text-[#d02c37] mb-2" /> },
    { key: "about", title: "About Property Investors", icon: <Info className="w-[65px] h-[65px] text-[#d02c37] mb-2" /> },
    { key: "media", title: "Sharable Media", icon: <Share2 className="w-[65px] h-[65px] text-[#d02c37] mb-2" /> },
    { key: "ebooks", title: "eBooks", icon: <BookOpen className="w-[65px] h-[65px] text-[#d02c37] mb-2" /> },
  ]);

  // 🔑 Get logged-in email from localStorage
  const getLoggedInEmail = (): string | null => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const hubspotData = parsed.hubspot || {};
        return hubspotData.email || null;
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
              const hiddenEmail = $form.querySelector("input[name='email']");
              if (hiddenEmail) {
                hiddenEmail.value = getLoggedInEmail() || "no-email@example.com";
              }
            },
          });
        }
      };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {boxes.map((box) => (
            <div
              key={box.key}
              className="bg-[#EFEFEF] border border-gray-200 rounded-xl shadow-md flex flex-col items-center justify-center w-full h-64 hover:shadow-lg transition"
              onClick={() => {
                if (box.key === "refer") setShowReferModal(true);
                if (box.key === "ebooks") setActiveView("ebooks");
              }}
            >
              {box.icon}
              <span className="tracking-[-2.7px] text-[2em] font-medium text-center mb-2">
                {box.title}
              </span>
              <button
                className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]"
              >
                Open
              </button>
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
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X size={24} />
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
