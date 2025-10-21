import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import DashboardContent from "./DashboardContent";
import AccountPage from "./AccountPage";
import Portal from "./Portal";
import Marketing from "./Marketing";
import Onboarding from "./Onboarding";
import AffiliatePortalSidebar from "./AffiliatePortalSidebar";
import Footer from "./Footer"; // ✅ import footer

type PageType =
  | "portal"
  | "marketing"
  | "dashboard"
  | "account"
  | "affiliate"
  | "onboarding";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<PageType>("portal");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Load last page from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage") as PageType | null;
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  // ✅ Save page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ✅ Main layout (sidebar + content) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden w-64 border-r">
          <AffiliatePortalSidebar
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            onLogout={onLogout}
            isOpen={true} // always open on desktop
          />
        </div>

        {/* Mobile sidebar (overlay) */}
        <div className="lg:hidden">
          <AffiliatePortalSidebar
            currentPage={currentPage}
            onNavigate={(page) => {
              setCurrentPage(page);
              setIsSidebarOpen(false);
            }}
            onLogout={onLogout}
            isOpen={isSidebarOpen}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col pt-16">
          <Navigation
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onLogout={onLogout}
            onToggleSidebar={toggleSidebar}
          />

          <div className="flex-1">
            {currentPage === "portal" && <Portal />}
            {currentPage === "marketing" && <Marketing />}
            {currentPage === "dashboard" && <DashboardContent />}
            {currentPage === "account" && <AccountPage />}
            {currentPage === "onboarding" && <Onboarding />}
            {currentPage === "affiliate" && <div>Affiliate Content</div>}
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
