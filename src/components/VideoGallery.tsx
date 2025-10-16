import React, { useEffect, useState } from "react";
import { Award, Video } from "lucide-react";

interface VideoFile {
  id: string;
  name: string;
  url: string;
  preview?: string;
}

interface Props {
  initialFolder?: "videos" | "webinar";
}

const VideoGallery: React.FC<Props> = ({ initialFolder }) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFolder, setActiveFolder] = useState<"videos" | "webinar" | null>(
    initialFolder || null
  );

  const webinarVideos: VideoFile[] = [
    {
      id: "webinar-apr",
      name: "April Webinar",
      url: "https://www.youtube.com/watch?v=b3XA2LwO0mU",
      preview: "https://img.youtube.com/vi/b3XA2LwO0mU/hqdefault.jpg",
    },
    {
      id: "webinar-jul",
      name: "July Webinar",
      url: "https://www.youtube.com/watch?v=yZu3wxmC674",
      preview: "https://img.youtube.com/vi/yZu3wxmC674/hqdefault.jpg",
    },
    {
      id: "webinar-aug",
      name: "August Webinar",
      url: "https://www.youtube.com/watch?v=qusX9ecD-Rk",
      preview: "https://img.youtube.com/vi/qusX9ecD-Rk/hqdefault.jpg",
    },
    {
      id: "webinar-sep",
      name: "September Webinar",
      url: "https://www.youtube.com/watch?v=DzzU0K7vQ-w",
      preview: "https://img.youtube.com/vi/DzzU0K7vQ-w/hqdefault.jpg",
    },
  ];

  const loadVideos = (folderId: "videos" | "webinar") => {
    setLoading(true);
    setActiveFolder(folderId);
    setVideos([]);

    if (folderId === "webinar") {
      // Load static webinar list
      setTimeout(() => {
        setVideos(webinarVideos);
        setLoading(false);
      }, 300);
      return;
    }

    // Load from WordPress API
    fetch(
      `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/marketing-documents?folder_id=${folderId}`
    )
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((file: any) => ({
          id: file.id,
          name: file.name,
          url: file.url,
          preview: file.url + "/medium.jpg",
        }));
        setVideos(mapped);
      })
      .catch((err) => console.error("❌ Error loading videos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialFolder) loadVideos(initialFolder);
  }, [initialFolder]);

  return (
    <div className="p-6">
      {/* 📦 Folder Selector Boxes */}
      {!activeFolder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {[
            {
              id: "videos",
              title: "Video Content",
              icon: <Video className="w-10 h-10 text-[#d02c37]" />,
              buttonLabel: "Open",
            },
            {
              id: "webinar",
              title: "Webinar Videos",
              icon: <Award className="w-10 h-10 text-[#d02c37]" />,
              buttonLabel: "Open",
            },
          ].map((box) => (
            <div
              key={box.id}
              className="bg-[#EFEFEF] border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center w-64 h-48 transition hover:shadow-md"
            >
              {box.icon}
              <span className="text-lg font-medium text-center text-black mt-3">
                {box.title}
              </span>
              <button
                onClick={() => loadVideos(box.id as "videos" | "webinar")}
                className="mt-3 px-5 py-2 rounded-md text-white font-medium bg-[#d02c37] hover:opacity-90"
              >
                {box.buttonLabel}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🎥 Videos Display */}
      {activeFolder && (
        <div className="mt-8">
          {loading && (
            <p className="text-center text-gray-600">Loading videos...</p>
          )}

          {!loading && videos.length === 0 && (
            <p className="text-center text-gray-600">
              No videos found in this category.
            </p>
          )}

          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:scale-105 bg-white"
                >
                  <img
                    src={video.preview}
                    alt={video.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 text-center font-medium text-sm truncate">
                    {video.name}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
