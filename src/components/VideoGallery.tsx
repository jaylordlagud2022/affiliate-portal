import React, { useEffect, useState } from "react";

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
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
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
      // Use static YouTube webinar list
      setTimeout(() => {
        setVideos(webinarVideos);
        setLoading(false);
      }, 300);
      return;
    }

    // Otherwise, fetch from API for “Success Videos”
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

  // Auto-load initial folder
  useEffect(() => {
    if (initialFolder) loadVideos(initialFolder);
  }, [initialFolder]);

  return (
    <div className="p-6">
      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => loadVideos("videos")}
          className={`px-6 py-3 rounded-lg text-white font-medium transition ${
            activeFolder === "videos"
              ? "bg-[#d02c37]"
              : "bg-gray-400 hover:bg-[#d02c37]"
          }`}
        >
          🎯 Success Videos
        </button>
        <button
          onClick={() => loadVideos("webinar")}
          className={`px-6 py-3 rounded-lg text-white font-medium transition ${
            activeFolder === "webinar"
              ? "bg-[#d02c37]"
              : "bg-gray-400 hover:bg-[#d02c37]"
          }`}
        >
          🎥 Webinar Videos
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gray-600">Loading videos...</p>}

      {/* Empty state */}
      {!loading && activeFolder && videos.length === 0 && (
        <p className="text-center text-gray-600">
          No videos found in this category.
        </p>
      )}

      {/* Video grid */}
      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:scale-105 bg-white"
              onClick={() => setSelectedVideo(video)}
            >
              <img
                src={video.preview}
                alt={video.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 text-center font-medium text-sm truncate">
                {video.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal player */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative p-4">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">
              {selectedVideo.name}
            </h3>

            {selectedVideo.url.includes("youtu") ? (
              <iframe
                src={selectedVideo.url.replace("watch?v=", "embed/")}
                className="w-full h-[480px] rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className="w-full rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
