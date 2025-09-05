import { useEffect, useState } from "react";

const HubspotChat: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // 🔑 Step 1: Fetch user info from your WP API
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("🔑 No authToken found in localStorage");
      return;
    }

    fetch(
      `https://api.researchtopurchase.com.au/wp-json/hubspot-login/v1/user-info?token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 HubSpot API response:", data);

        if (data.success && data.data && data.data.hubspot) {
          const hub = data.data.hubspot;
          const info = {
            email: hub.email,
            firstName: hub.firstname || "",
            lastName: hub.lastname || "",
          };

          console.log("✅ 1 Setting userInfo:", info);
          setUserInfo(info);
        } else {
          console.warn("⚠️ No hubspot data found in API response");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch HubSpot user info:", err);
      });
  }, []);

  // 💬 Step 2: Request visitor identification token from WP API
  useEffect(() => {
    if (!userInfo?.email) return;

    fetch(
      "https://api.researchtopurchase.com.au/wp-json/hubspot-chat/v1/identify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.token) {
          console.log("✅ Got HubSpot visitor token:", data.token);
          setIdToken(data.token);
        } else {
          console.error("❌ Failed to fetch visitor token:", data);
        }
      })
      .catch((err) => {
        console.error("❌ Visitor token request failed:", err);
      });
  }, [userInfo]);

  // 💬 Step 3: Inject HubSpot script with identification
useEffect(() => {
    if (!userInfo || !idToken) return;

    window.hsConversationsSettings = {
      loadImmediately: false,
      identificationEmail: userInfo.email,
      identificationToken: idToken,
    };

    // Use the official 'onReady' callback
    window.hsConversationsOnReady = [
      () => {
        window.HubSpotConversations.widget.load();
      },
    ];

    // Inject the script if it's not already there
    if (!document.getElementById("hs-script-loader")) {
      const script = document.createElement("script");
      script.src = "//js.hs-scripts.com/46099113.js";
      script.id = "hs-script-loader";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [userInfo, idToken]);
    
  return null;
};

export default HubspotChat;
