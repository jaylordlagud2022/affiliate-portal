import { useEffect, useState } from "react";

const HubspotChat: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch(`http://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/user-info?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.hubspot) {
          const hub = data.data.hubspot;
          setUserInfo({
            email: hub.email,
            firstName: hub.firstname || "",
            lastName: hub.lastname || "",
            phone: hub.mobilephone || "",
            state: hub.state || "",
            postcode: hub.zip || "",
          });
        }
      });
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    const initChat = () => {
      if (window.HubSpotConversations) {
        window.HubSpotConversations.widget.on("ready", () => {
          window.HubSpotConversations.widget.identify({
            email: userInfo.email,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            phone: userInfo.phone,
            state: userInfo.state,
            zip: userInfo.postcode,
          });
        });
      }
    };

    if (!document.getElementById("hs-script-loader")) {
      const script = document.createElement("script");
      script.src = "//js.hs-scripts.com/46099113.js"; // 🔹 replace with your HubSpot portal ID
      script.id = "hs-script-loader";
      script.async = true;
      script.defer = true;
      script.onload = initChat;
      document.body.appendChild(script);
    } else {
      initChat();
    }
  }, [userInfo]);

  return null;
};

export default HubspotChat;
