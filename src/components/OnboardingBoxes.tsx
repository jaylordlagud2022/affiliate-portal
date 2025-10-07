import React, { useState } from "react";
import { LayoutDashboard, Megaphone, UserCheck, Settings, X } from "lucide-react";

const OnboardingBoxes = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const [boxes] = useState([
    {
      title: "Dashboard",
      video: "https://www.youtube.com/embed/tgbNymZ7vqY",
      icon: <LayoutDashboard className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      title: "Marketing",
      video: "https://www.youtube.com/embed/tgbNymZ7vqY",
      icon: <Megaphone className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      title: "Partner Status",
      video: "https://www.youtube.com/embed/tgbNymZ7vqY",
      icon: <UserCheck className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
    {
      title: "Account",
      video: "https://www.youtube.com/embed/tgbNymZ7vqY",
      icon: <Settings className="w-[65px] h-[65px] text-[#d02c37] mb-2" />,
    },
  ]);

  const openModal = (videoUrl: string) => {
    setActiveVideo(videoUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveVideo(null);
  };

  return (
    <div className="p-4">
      {/* Onboarding Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {boxes.map((box, index) => (
          <div
            key={index}
            onClick={() => openModal(box.video)}
            className="bg-[#EFEFEF] border border-gray-200 rounded-xl shadow-md flex flex-col items-center justify-center w-full h-64 hover:shadow-lg transition cursor-pointer"
          >
            {box.icon}
            <span className="tracking-[-2.7px] text-[2em] font-medium text-center mb-2">
              {box.title}
            </span>
            <button className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]">
              Watch
            </button>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {showModal && activeVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-auto relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={28} />
            </button>

            {/* Video Embed */}
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="500"
                src={activeVideo}
                title="Onboarding Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-b-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingBoxes;
