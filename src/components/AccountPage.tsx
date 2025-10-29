import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import profileImage from "../assets/profile-placeholder.png";

type PageType = "portal" | "marketing" | "dashboard" | "account" | "affiliate";

const formatABN = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits
    .replace(/^(\d{2})(\d)/, "$1 $2")
    .replace(/^(\d{2}) (\d{3})(\d)/, "$1 $2 $3")
    .replace(/^(\d{2}) (\d{3}) (\d{3})(\d)/, "$1 $2 $3 $4")
    .substring(0, 14);
};

interface AccountPageProps {
  onLogout: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<PageType>("account");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    abn: "",
    website: "",
    suburb: "",
    state: "",
    postcode: "",
    profileImage: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/user-info?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.hubspot) {
          const hub = data.data.hubspot;
          setFormData((prev) => ({
            ...prev,
            firstName: hub.firstname || "",
            lastName: hub.lastname || "",
            email: hub.email || "",
            phone: hub.mobilephone || "",
            businessName: hub.company || "",
            abn: hub.abn ? formatABN(hub.abn) : "",
            website: hub.website || "",
            suburb: "",
            state: hub.state || "",
            postcode: hub.zip || "",
            profileImage: hub.profile_image_url || "",
          }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "abn") value = formatABN(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage({ text: "No authentication token found.", type: "error" });
        setSaving(false);
        return;
      }

      const response = await fetch(
        "https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/update-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            ...formData,
            abn: formData.abn.replace(/\s/g, ""),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ text: "Account updated successfully!", type: "success" });
        setIsEditing(false);
      } else {
        setMessage({
          text: result?.message || result?.error || "Failed to update account.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-white">
      <div className="flex-1">
        <Navigation
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={onLogout}
          onToggleSidebar={toggleSidebar}
        />

        <div className="max-w-5xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-gray-600">Loading account information...</div>
          ) : (
            <>
              {/* SINGLE CONTAINER: Account Status + Personal Information (no borders) */}
              <div className="w-full bg-white p-6" style={{ boxShadow: "none" }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  {/* Left: Account status (top of container) */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">Account Status</h2>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                      <span className="text-green-700 font-medium">Active Affiliate</span>
                    </div>
                    <p className="text-gray-600">
                      Your account is active and approved for affiliate activities.
                    </p>
                  </div>

                  {/* Right: profile + edit */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-end">
                    <button
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      disabled={saving}
                      className={`mb-3 px-3 py-1 rounded-md text-sm transition ${
                        isEditing ? "bg-green-600 hover:bg-green-700" : "bg-[#d02c37] hover:bg-black"
                      } text-white`}
                    >
                      {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
                    </button>

                    <img
                      src={formData.profileImage || profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border"
                    />

                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-2 text-sm text-gray-600"
                      />
                    )}
                  </div>
                </div>

                {/* Add spacing, then Personal Information (inside same container) */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "First Name", name: "firstName" },
                      { label: "Last Name", name: "lastName" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "Phone", name: "phone", type: "tel" },
                      { label: "Business Name", name: "businessName" },
                      { label: "ABN", name: "abn", placeholder: "12 345 678 901" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={field.placeholder}
                          className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                        />
                      </div>
                    ))}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="https://example.com"
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suburb
                      </label>
                      <input
                        type="text"
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postcode
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {message.text && (
                    <div
                      className={`mt-4 text-sm font-medium ${
                        message.type === "success" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountPage;
