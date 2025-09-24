import React, { useState } from "react";

const OnboardingBoxes = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const [boxes] = useState([
    { title: "Dashboard", video: "https://www.youtube.com/embed/tgbNymZ7vqY" },
    { title: "Marketing", video: "https://www.youtube.com/embed/tgbNymZ7vqY" },
    { title: "Partner Status", video: "https://www.youtube.com/embed/tgbNymZ7vqY" },
    { title: "Account", video: "https://www.youtube.com/embed/tgbNymZ7vqY" },
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
      {/* Dashboard Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bg-[#EFEFEF] text-[#d02c37] p-12 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center justify-center text-2xl font-bold"
            onClick={() => openModal(box.video)}
          >
            {box.title}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && activeVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-auto relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✕
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
