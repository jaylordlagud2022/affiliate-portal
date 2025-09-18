import React, { useEffect, useState } from "react";

interface Ebook {
  id: string;
  name: string;
  url: string;
}

const EbookGallery: React.FC = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [receiver, setReceiver] = useState("");
  const [sending, setSending] = useState(false);

  // Example: token stored in localStorage after login
  const token = localStorage.getItem("authToken");

  // Load ebooks from WP API
  useEffect(() => {
    fetch(
      "https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/marketing-documents?folder_id=ebooks"
    )
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((file: any) => ({
          id: file.id,
          name: file.name || file.filename,
          url: file.url || "#",
        }));
        setEbooks(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ebooks:", err);
        setLoading(false);
      });
  }, []);

  const handleSend = () => {
    if (!selectedEbook || !receiver) return;
    if (!token) {
      alert("You must be logged in to send ebooks.");
      return;
    }

    setSending(true);

    fetch(
      "https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/track-downloads",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          file_id: selectedEbook.id,
          file_name: selectedEbook.name,
          receiver_email: receiver,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(data.message || "Ebook sent!");
          setReceiver("");
          setSelectedEbook(null);
        } else {
          alert(data.message || "Failed to send ebook.");
        }
      })
      .catch((err) => {
        console.error("Error sending ebook:", err);
        alert("Something went wrong.");
      })
      .finally(() => setSending(false));
  };

  if (loading) return <p>Loading ebooks...</p>;

  return (
    <div className="p-6">
      {/* Ebook grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {ebooks.map((ebook) => (
          <div
            key={ebook.id}
            className="bg-[#d02c37] text-white rounded-xl shadow-lg cursor-pointer 
                       transition-transform transform hover:scale-105 
                       flex items-center justify-center text-center 
                       h-64 p-4 font-semibold"
            onClick={() => setSelectedEbook(ebook)}
          >
            {ebook.name}
          </div>
        ))}
      </div>

      {/* Popup form */}
      {selectedEbook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setSelectedEbook(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Send "{selectedEbook.name}"
            </h3>
            <input
              type="email"
              placeholder="Receiver Email"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setSelectedEbook(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSend}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Ebook"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookGallery;
