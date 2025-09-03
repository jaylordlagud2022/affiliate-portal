import { useEffect, useState } from "react";

const HubspotChat: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("🔑 No authToken found in localStorage");
      return;
    }

    fetch(`http://52.64.155.40/wp-json/hubspot-login/v1/user-info?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 HubSpot API response:", data);

        if (data.success && data.data && data.data.hubspot) {
          const hub = data.data.hubspot;
          const info = {
            email: hub.email,
            firstName: hub.firstname || "",
            lastName: hub.lastname || "",
            phone: hub.mobilephone || "",
            state: hub.state || "",
            postcode: hub.zip || "",
          };

          console.log("✅ Setting userInfo:", info);
          setUserInfo(info);
        } else {
          console.warn("⚠️ No hubspot data found in API response");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch HubSpot user info:", err);
      });
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    const initChat = () => {
      if (window.HubSpotConversations) {
        console.log("💬 HubSpot widget ready, trying to identify with:", userInfo);

        window.HubSpotConversations.widget.on("ready", () => {
          console.log("🚀 Sending identify request:", userInfo);

          window.HubSpotConversations.widget.identify({
            email: userInfo.email,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            phone: userInfo.phone,
            state: userInfo.state,
            zip: userInfo.postcode,
          });

          // ✅ Listen for re-ready after identification
          setTimeout(() => {
            console.log("🎯 Identification success assumed (widget reloaded with user)");
          }, 2000);
        });
      } else {
        console.warn("⚠️ HubSpotConversations not available yet");
      }
    };

    if (!document.getElementById("hs-script-loader")) {
      console.log("📌 Injecting HubSpot chat script");
      const script = document.createElement("script");
      script.src = "//js.hs-scripts.com/46099113.js"; // 🔹 replace with your HubSpot portal ID
      script.id = "hs-script-loader";
      script.async = true;
      script.defer = true;
      script.onload = initChat;
      document.body.appendChild(script);
    } else {
      console.log("📌 HubSpot chat script already loaded, initializing");
      initChat();
    }
  }, [userInfo]);

  return null;
};

export default HubspotChat;
