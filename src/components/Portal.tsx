import React, { useState, useEffect } from "react";
import AffiliatePortalSidebar from "./AffiliatePortalSidebar";
import DashboardBoxes from "./DashboardBoxes";
import MarketingBoxes from "./MarketingBoxes";
import OnboardingBoxes from "./OnboardingBoxes";
import AccountPage from "./AccountPage";
import AffiliateActivity from "./AffiliateActivity";
import ChatPopup from "./ChatPopup";

type PageType =
  | "portal"
  | "marketing"
  | "dashboard"
  | "account"
  | "affiliate"
  | "onboarding"  
  | "affiliateActivity";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const bannerTitles: Record<PageType, string> = {
    dashboard: "Affliate Hub",
    marketing: "Marketing Hub",
    portal: "Affliate Hub",
    account: "My Account",
    affiliate: "Affliate Hub",
    onboarding: "Affliate Hub",    
    affiliateActivity: "Partner Status Hub",
  };

  // ✅ Fetch role once user logs in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch(
      `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/user-info?token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.role) {
          setRole(data.data.role); // "lead" or "leadOwner"
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-white font-maven flex flex-col " style={{marginTop:"70px"}}>
      {/* 🔴 Banner */}
      <hr className="w-full mx-auto border-black " />

      <div className="bg-[#d02c37] text-white text-center h-[195px] mt-5 mb-5 w-full flex items-center justify-center relative">
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h2 className="text-2xl md:text-3xl font-bold tracking-wide px-3">
          <b>Property Investors.</b>
        </h2>
        <h2 className="text-2xl md:text-3xl tracking-wide">
          {bannerTitles[currentPage]}
        </h2>
      </div>
      <hr className="w-[100%] mx-auto border-black" />

      {/* ✅ Layout */}
      <div className="flex flex-1 portal-container">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AffiliatePortalSidebar
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            onLogout={onLogout}
            isOpen={true}
          />
        </div>

        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg lg:hidden">
              <AffiliatePortalSidebar
                currentPage={currentPage}
                onNavigate={(page) => {
                  setCurrentPage(page);
                  setIsSidebarOpen(false);
                }}
                onLogout={onLogout}
                isOpen={true}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 p-8">
          {currentPage === "dashboard" && <DashboardBoxes />}
          {currentPage === "marketing" && <MarketingBoxes />}
          {currentPage === "portal" && <DashboardBoxes />}
          {currentPage === "onboarding" && <OnboardingBoxes />}          
          {currentPage === "account" && <AccountPage />}
          {currentPage === "affiliateActivity" && <AffiliateActivity />}
        </div>
      </div>

      {/* ✅ Role-based Chat */}
      {role === "lead" && <ChatPopup userEmail="user1@example.com"/>}
    </div>
  );
};

export default Dashboard;
