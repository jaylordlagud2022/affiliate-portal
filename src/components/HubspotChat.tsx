import { useEffect } from "react";

const HubspotChat: React.FC = () => {
  useEffect(() => {
    // Avoid re-adding if already present
    if (document.getElementById("hs-script-loader")) return;

    const script = document.createElement("script");
    script.src = "//js.hs-scripts.com/46099113.js"; // Your HubSpot portal ID
    script.id = "hs-script-loader";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Optional: remove script on unmount
      const existing = document.getElementById("hs-script-loader");
      if (existing) existing.remove();
    };
  }, []);

  return null; // Nothing to render
};

export default HubspotChat;
