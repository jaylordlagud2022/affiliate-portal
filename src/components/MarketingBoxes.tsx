import React, { useState, useEffect } from "react";
import EbookGallery from "./EbookGallery";
import VideoGallery from "./VideoGallery";
import {
  UserPlus,
  Info,
  Share2,
  BookOpen,
  X,
  Award,
  MessageSquare,
  Video,
  User,
  PlayCircle,
  Download,
} from "lucide-react";

const MarketingBoxes = () => {
  const [activeView, setActiveView] = useState<
    "home" | "ebooks" | "media" | "videos" | "videogallery" | "success"
  >("home");

  const [activeFolder, setActiveFolder] = useState<
    "investors" | "webinar" | "success" | null
  >(null);

  const [showReferModal, setShowReferModal] = useState(false);

  const [boxes] = useState([
    {
      key: "refer",
      title: "Refer a client",
      icon: <UserPlus className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      key: "about",
      title: "About Property Investors",
      icon: <Info className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      key: "media",
      title: "Sharable Media",
      icon: <Share2 className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      key: "ebooks",
      title: "eBooks",
      icon: <BookOpen className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
  ]);

  const [mediaBoxes] = useState([
    {
      key: "success",
      title: "Success Studies",
      icon: <Award className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      key: "testimonials",
      title: "Testimonials",
      icon: <MessageSquare className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      key: "videos",
      title: "Video Content",
      icon: <Video className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      key: "bio",
      title: "Consultant Bio",
      icon: <User className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
  ]);

  const getLoggedInEmail = (): string | null => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed?.hubspot?.email || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (showReferModal) {
      const portalId = "46099113";
      const formId = "60609263-83bc-400b-a7eb-0c7f188d7bd4";
      const formContainer = document.getElementById("hubspotForm");
      if (formContainer) formContainer.innerHTML = "";

      const loadForm = () => {
        if ((window as any).hbspt) {
          (window as any).hbspt.forms.create({
            region: "na1",
            portalId,
            formId,
            target: "#hubspotForm",
            onFormReady: ($form: any) => {
              const hiddenEmail = $form.querySelector("input[name='email']");
              if (hiddenEmail)
                hiddenEmail.value = getLoggedInEmail() || "no-email@example.com";
            },
          });
        }
      };

      if (
        !document.querySelector(
          "script[src='https://js.hsforms.net/forms/embed/v2.js']"
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://js.hsforms.net/forms/embed/v2.js";
        script.async = true;
        script.onload = loadForm;
        document.body.appendChild(script);
      } else loadForm();
    }
  }, [showReferModal]);

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <div className="flex justify-start mt-12">
      <button
        onClick={onClick}
        className="bg-[#d02c37] text-white px-4 py-3 rounded hover:bg-black transition font-medium w-[200px]"
      >
        ← Back
      </button>
    </div>
  );

  return (
    <div className="p-4">
      {/* HOME */}
      {activeView === "home" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {boxes.map((box) => (
            <div
              key={box.key}
              className="bg-[#EFEFEF] rounded-xl shadow-md flex flex-col items-center justify-center w-full h-64 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                if (box.key === "refer") setShowReferModal(true);
                if (box.key === "ebooks") setActiveView("ebooks");
                if (box.key === "media") setActiveView("media");
                if (box.key === "about") {
                  const link = document.createElement("a");
                  link.href = "/About Property Investors 2025.pdf";
                  link.download = "Property-Investors.pdf";
                  link.click();
                }
              }}
            >
              {box.icon}
              <span className="tracking-[-2.7px] text-[2em] font-medium text-center mb-2">
                {box.title}
              </span>
              <button className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]">
                Open
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MEDIA */}
      {activeView === "media" && (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {mediaBoxes.map((box) => (
              <div
                key={box.key}
                className="bg-[#EFEFEF] rounded-xl shadow-md flex flex-col items-center justify-center w-full h-64 hover:shadow-lg transition cursor-pointer"
                onClick={() => {
                  if (box.key === "success") setActiveView("success");
                  else if (box.key === "testimonials") {
                    const link = document.createElement("a");
                    link.href =
                      "/Investor persepctives - Authentic stories, proven success 4.pdf";
                    link.download =
                      "Investor-Perspectives-Authentic-Stories.pdf";
                    link.click();
                  } else if (box.key === "videos") setActiveView("videos");
                }}
              >
                {box.icon}
                <span className="tracking-[-2.7px] text-[2em] font-medium text-center mb-2">
                  {box.title}
                </span>
                <button className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]">
                  {box.key === "testimonials" ? "Download" : "Open"}
                </button>
              </div>
            ))}
          </div>
          <BackButton onClick={() => setActiveView("home")} />
        </div>
      )}

      {/* VIDEO CONTENT SUBMENU */}
      {activeView === "videos" && (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Investor Mistake */}
            <div
              className="bg-[#EFEFEF] rounded-xl shadow-md flex flex-col items-center justify-center h-64 hover:shadow-lg cursor-pointer"
              onClick={() => {
                setActiveFolder("investors");
                setActiveView("videogallery");
              }}
            >
              <PlayCircle className="w-[65px] h-[65px] text-[#d02c37] mb-2" />
              <span className="tracking-[-2.7px] text-[2em] font-medium mb-2 text-center">
                Investor Mistake
              </span>
              <button className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]">
                Open
              </button>
            </div>

            {/* Webinar */}
            <div
              className="bg-[#EFEFEF] rounded-xl shadow-md flex flex-col items-center justify-center h-64 hover:shadow-lg cursor-pointer"
              onClick={() => {
                setActiveFolder("webinar");
                setActiveView("videogallery");
              }}
            >
              <PlayCircle className="w-[65px] h-[65px] text-[#d02c37] mb-2" />
              <span className="tracking-[-2.7px] text-[2em] font-medium mb-2 text-center">
                Webinar
              </span>
              <button className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]">
                Open
              </button>
            </div>
          </div>
          <BackButton onClick={() => setActiveView("media")} />
        </div>
      )}

      {/* SUCCESS STUDIES */}
      {activeView === "success" && (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div
              className="bg-[#EFEFEF] rounded-xl shadow-md flex flex-col items-center justify-center h-64 hover:shadow-lg cursor-pointer"
              onClick={() => {
                setActiveFolder("success");
                setActiveView("videogallery");
              }}
            >
              <Video className="w-[65px] h-[65px] text-[#d02c37] mb-2" />
              <span className="tracking-[-2.7px] text-[2em] font-medium text-center mb-2">
                Videos
              </span>
              <button className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]">
                Open
              </button>
            </div>

            <div
              className="bg-[#EFEFEF] rounded-xl shadow-md flex flex-col items-center justify-center h-64 hover:shadow-lg cursor-pointer"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Success Studies August 2025 Update.pdf";
                link.download = "Success-Studies-August-2025-Update.pdf";
                link.click();
              }}
            >
              <Download className="w-[65px] h-[65px] text-[#d02c37] mb-2" />
              <span className="tracking-[-2.7px] text-[2em] font-medium text-center mb-2">
                Download
              </span>
              <button className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]">
                Download
              </button>
            </div>
          </div>
          <BackButton onClick={() => setActiveView("media")} />
        </div>
      )}

      {/* VIDEO GALLERY */}
      {activeView === "videogallery" && activeFolder && (
        <div className="relative">
          <VideoGallery selectedCategory={activeFolder} />
          <BackButton
            onClick={() => {
              if (activeFolder === "success") setActiveView("success");
              else setActiveView("videos");
            }}
          />
        </div>
      )}

      {/* EBOOKS */}
      {activeView === "ebooks" && (
        <div className="relative">
          <EbookGallery />
          <BackButton onClick={() => setActiveView("home")} />
        </div>
      )}

      {/* REFER A CLIENT */}
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
    </div>
  );
};

export default MarketingBoxes;
