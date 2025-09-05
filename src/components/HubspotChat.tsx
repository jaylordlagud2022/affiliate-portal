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

  // 💬 Step 2: Inject HubSpot widget and run identify
  useEffect(() => {
    if (!userInfo) return;

    const initChat = () => {
      console.log("⏳ Polling for HubSpotConversations...");

      const check = setInterval(() => {
        if (
          window.HubSpotConversations &&
          window.HubSpotConversations.widget
        ) {
          clearInterval(check);
          console.log("💬 HubSpotConversations loaded ✅");

          window.HubSpotConversations.widget.on("ready", () => {
            console.log(
              "🚀 Chat widget ready, sending identify request:",
              userInfo
            );

            if (
              typeof window.HubSpotConversations.widget.identify !== "function"
            ) {
              console.error("❌ HubSpot identify() is not available.");
              return;
            }

            window.HubSpotConversations.widget.identify({
              email: userInfo.email,
              firstname: userInfo.firstName,
              lastname: userInfo.lastName,
              phone: userInfo.phone,
              state: userInfo.state,
              zip: userInfo.postcode,
            });

            window.HubSpotConversations.widget.on(
              "identityReady",
              (data: any) => {
                console.log("✅ HubSpot identity confirmed:", data);

                window.HubSpotConversations.widget
                  .getUser()
                  .then((user: any) => {
                    console.log(
                      "🙋 Current identified user from widget.getUser():",
                      user
                    );
                  });
              }
            );

            window.HubSpotConversations.widget.on(
              "identityFailed",
              (err: any) => {
                console.error("❌ HubSpot identity failed:", err);
              }
            );
          });
        }
      }, 500);
    };

    // Inject script if not already present
    if (!document.getElementById("hs-script-loader")) {
      console.log("📌 Injecting HubSpot chat script");
      const script = document.createElement("script");
      script.src = "//js.hs-scripts.com/46099113.js"; // 🔹 replace with your portal ID
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
