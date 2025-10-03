import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import AffiliatePortalSidebar from "./AffiliatePortalSidebar";
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
    profileImage: ""
  });

  // ✅ Fetch user info
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(
      `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/user-info?token=${token}`
    )
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
            profileImage: hub.profile_image_url || ""
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

  const handleSave = () => {
    setIsEditing(false);
    alert("Account updated successfully!");
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Main Content */}
      <div className="flex-1">
        <Navigation
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={onLogout}
          onToggleSidebar={toggleSidebar}
        />

        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-gray-500">Loading account information...</div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className="px-4 py-2 bg-[#d02c37] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? "Save Changes" : "Edit"}
                  </button>
                </div>

                {/* Profile Image */}
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={formData.profileImage || profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mb-3 border"
                  />
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-sm text-gray-600"
                    />
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  {/* ABN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ABN
                    </label>
                    <input
                      type="text"
                      name="abn"
                      value={formData.abn}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="12 345 678 901"
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  {/* Website */}
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

                  {/* Suburb */}
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

                  {/* State + Postcode */}
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

                {isEditing && (
                  <div className="mt-6 pt-6 border-t">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="mr-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
                <h2 className="text-xl font-bold mb-4">Account Status</h2>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-700 font-medium">
                    Active Affiliate
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  Your account is active and approved for affiliate activities.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
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
