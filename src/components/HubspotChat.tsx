import { useEffect, useState } from "react";

const HubspotChat: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

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

  // 💬 Step 2: Inject HubSpot widget and identify user
  useEffect(() => {
    if (!userInfo) return;

    const initChat = () => {
      if (typeof window.hsConversationsOnReady !== "function") {
        console.error("❌ hsConversationsOnReady is not available.");
        return;
      }

      console.log("💬 Binding HubSpot conversations onReady callback...");

      window.hsConversationsOnReady((widget: any) => {
        console.log("🚀 HubSpot chat widget is ready", widget);

        if (typeof widget.identify !== "function") {
          console.error("❌ identify() is not available on widget");
          return;
        }

        widget.identify({
          email: userInfo.email,
          firstname: userInfo.firstName,
          lastname: userInfo.lastName,
          phone: userInfo.phone,
          state: userInfo.state,
          zip: userInfo.postcode,
        });

        // Try to pull back identified user
        if (typeof widget.getUser === "function") {
          widget.getUser().then((user: any) => {
            console.log("🙋 HubSpot identified user:", user);
          });
        }
      });
    };

    if (!document.getElementById("hs-script-loader")) {
      console.log("📌2 Injecting HubSpot chat script");
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
