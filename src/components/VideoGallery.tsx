import React, { useEffect, useState } from "react";

interface VideoFile {
  id: string;
  name: string;
  url: string;
  preview?: string;
}

interface VideoGalleryProps {
  selectedCategory: "investors" | "webinar" | "success";
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ selectedCategory }) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);

  // ✅ Investor’s Mistakes videos
  const investorVideos: VideoFile[] = [
    { id: "v1", name: "Failure to Budget", url: "https://www.youtube.com/watch?v=FtGFIqsbcK0" },
    { id: "v2", name: "Lifestyle Compromises", url: "https://www.youtube.com/watch?v=fzdvGScKv6Q" },
    { id: "v3", name: "Expert Opinions", url: "https://www.youtube.com/watch?v=A9uGVau7H5k" },
    { id: "v4", name: "Market Movements", url: "https://www.youtube.com/watch?v=uLbr25o-Bfo" },
    { id: "v5", name: "Fear Overtakes You", url: "https://www.youtube.com/watch?v=hCT6LtmZh_U" },
    { id: "v6", name: "Exit Strategy", url: "https://www.youtube.com/watch?v=OwGCCAXCmLo" },
    { id: "v7", name: "Do Your Homework", url: "https://www.youtube.com/watch?v=7Xcp8lXQpnE" },
    { id: "v8", name: "Demographics", url: "https://www.youtube.com/watch?v=b_VIdizlZ0o" },
    { id: "v9", name: "Portfolio", url: "https://www.youtube.com/watch?v=ptGC67o_kuw" },
    { id: "v10", name: "Asset Protection", url: "https://www.youtube.com/watch?v=TTiAr5_zdPY" },
    { id: "v11", name: "Relying On The Bank", url: "https://www.youtube.com/watch?v=KPvQzRRqQEA" },
    { id: "v12", name: "Diversifying", url: "https://www.youtube.com/watch?v=diSuQguSkWE" },
    { id: "v13", name: "Depreciation", url: "https://www.youtube.com/watch?v=Lypn4ONQLrs" },
    { id: "v14", name: "The Borrowing Threshold", url: "https://www.youtube.com/watch?v=1KsjmglwEQQ" },
    { id: "v15", name: "Desperation", url: "https://www.youtube.com/watch?v=80SXFmg6sH4" },
    { id: "v16", name: "Clauses and Contracts", url: "https://www.youtube.com/watch?v=Db-di8nVXPQ" },
    { id: "v17", name: "Size of Property and Borrowing", url: "https://www.youtube.com/watch?v=888h4JnfWhc" },
    { id: "v18", name: "Listening and Believing", url: "https://www.youtube.com/watch?v=Tfm_1RxouyY" },
    { id: "v19", name: "Renovation", url: "https://www.youtube.com/watch?v=34ktGOhmJdc" },
    { id: "v20", name: "Chasing the Tax Incentives", url: "https://www.youtube.com/watch?v=7OyUBXWN2gU" },
    { id: "v21", name: "Mining Towns", url: "https://www.youtube.com/watch?v=x3xfmsd8op4" },
    { id: "v22", name: "Defence Housing", url: "https://www.youtube.com/watch?v=391hYZ7Z08s" },
    { id: "v23", name: "Following the Bandwagon", url: "https://www.youtube.com/watch?v=ngPaQNWujhI" },
    { id: "v24", name: "The Dream House", url: "https://www.youtube.com/watch?v=LnnJHaYNEBA" },
    { id: "v25", name: "Family and Business", url: "https://www.youtube.com/watch?v=cz0ufycaTw8" },
    { id: "v26", name: "Selecting Property Manager", url: "https://www.youtube.com/watch?v=MXoU_9X2h0E" },
    { id: "v27", name: "Landlord Insurance", url: "https://www.youtube.com/watch?v=1jrIKUV5GFc" },
    { id: "v28", name: "Rights of Tenants", url: "https://www.youtube.com/watch?v=4NpRQldrv1U" },
    { id: "v29", name: "Rent Increments", url: "https://www.youtube.com/watch?v=NHcW3TS4C4A" },
    { id: "v30", name: "Dealing with the Negativity", url: "https://www.youtube.com/watch?v=laM60-YBL9c" },
    { id: "v31", name: "Stick to the Plan", url: "https://www.youtube.com/watch?v=OYKUeIForpY" },
    { id: "v32", name: "Investing in Yourself", url: "https://www.youtube.com/watch?v=VYU-EaE8K9Y" },
    { id: "v33", name: "Buying Nearby", url: "https://www.youtube.com/watch?v=c4Luk_KsdUU" },
  ].map((v) => ({
    ...v,
    preview: `https://img.youtube.com/vi/${v.url.split("v=")[1]?.split("&")[0]}/hqdefault.jpg`,
  }));

  // ✅ Webinar videos (restored all 4)
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

  // ✅ Success Stories
  const successVideos: VideoFile[] = [
    {
      id: "success-1",
      name: "Success Story 1",
      url: "https://www.youtube.com/watch?v=DzzU0K7vQ-w",
      preview: "https://img.youtube.com/vi/DzzU0K7vQ-w/hqdefault.jpg",
    },
  ];

  // ✅ Filter videos based on selected category
  useEffect(() => {
    setLoading(true);
    let selectedVideos: VideoFile[] = [];

    if (selectedCategory === "investors") selectedVideos = investorVideos;
    else if (selectedCategory === "webinar") selectedVideos = webinarVideos;
    else selectedVideos = successVideos;

    setTimeout(() => {
      setVideos(selectedVideos);
      setLoading(false);
    }, 300);
  }, [selectedCategory]);

  const closeModal = () => setSelectedVideo(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#d02c37]">
        {selectedCategory === "investors"
          ? "Investor’s Mistakes"
          : selectedCategory === "webinar"
          ? "Webinar"
          : "Success Stories"}
      </h2>

      {loading && <p className="text-center text-gray-600">Loading videos...</p>}

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

      {!loading && videos.length === 0 && (
        <p className="text-center text-gray-500">No videos found.</p>
      )}

      {/* ✅ Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-800"
            >
              ✕
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${
                  selectedVideo.url.split("v=")[1]?.split("&")[0]
                }`}
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-b-lg"
              ></iframe>
            </div>
            <div className="p-4 text-center text-lg font-semibold text-gray-800">
              {selectedVideo.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
