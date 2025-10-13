import React, { useEffect, useState } from "react";

interface VideoFile {
  id: string;
  name: string;
  url: string;
  preview?: string;
}

const VideoGallery: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);

  // Load videos from WP API
  useEffect(() => {
    fetch(
      "https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/marketing-documents?folder_id=videos"
    )
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((file: any) => ({
          id: file.id,
          name: file.name,
          url: file.url,
          preview: file.preview + "/medium.jpg",
        }));
        setVideos(mapped);
      })
      .catch((err) => console.error("Error loading videos:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div className="p-6">
      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            onClick={() => setSelectedVideo(video)}
          >
            <video
              src={video.preview}
              poster={video.preview}
              className="w-full h-64 object-cover"
              preload="metadata"
            />
            <div className="p-2 text-center font-semibold text-sm truncate">
              {video.name}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Video Player */}
      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
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
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
