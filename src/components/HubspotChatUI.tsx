import { useEffect, useState } from "react";

interface HubspotConversation {
  id: string;
  status: string;
  createdAt: string;
  owner?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

const HubspotChatUI: React.FC = () => {
  const [conversations, setConversations] = useState<HubspotConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Step 1: Fetch logged-in user info
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch(
      `https://api.researchtopurchase.com.au/wp-json/hubspot-login/v1/user-info?token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUserInfo(data.data);
        }
      });
  }, []);

  // Step 2: Fetch conversations
  useEffect(() => {
    if (!userInfo) return;

    // Admins → no filter, Owners → filter by their email
    const url = userInfo.isAdmin
      ? "https://api.researchtopurchase.com.au/wp-json/hubspot-chat/v1/conversations"
      : `https://api.researchtopurchase.com.au/wp-json/hubspot-chat/v1/conversations?ownerEmail=${encodeURIComponent(
          userInfo.email
        )}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setConversations(data.conversations);
        }
      });
  }, [userInfo]);

  if (loading) return <p>Loading conversations...</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">HubSpot Conversations</h2>
      {conversations.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <ul className="space-y-3">
          {conversations.map((c) => (
            <li key={c.id} className="border p-3 rounded-md">
              <p>
                <strong>ID:</strong> {c.id}
              </p>
              <p>
                <strong>Status:</strong> {c.status}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(c.createdAt).toLocaleString()}
              </p>
              {c.owner && (
                <p>
                  <strong>Owner:</strong> {c.owner.firstName} {c.owner.lastName}{" "}
                  ({c.owner.email})
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HubspotChatUI;
