import React, { useState } from 'react';
import AffiliatePortalSidebar from './AffiliatePortalSidebar';
import DashboardBoxes from './DashboardBoxes';
import MarketingBoxes from './MarketingBoxes';
import AccountPage from './AccountPage';
import AffiliateActivity from './AffiliateActivity';
// import Account, Affiliate, Portal ... (if you already have those components)

type PageType = 'portal' | 'marketing' | 'dashboard' | 'account' | 'affiliate' | 'affiliateActivity';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bannerTitles: Record<PageType, string> = {
    dashboard: 'AFFILIATE DASHBOARD',
    marketing: 'MARKETING HUB',
    portal: 'AFFILIATE PORTAL',
    account: 'MY ACCOUNT',
    affiliate: 'AFFILIATE HUB',
    affiliateActivity: 'PARTNER STATUS HUB',
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* 🔴 Red Banner (dynamic) */}
      <div className="bg-[#d02c37] text-white text-center h-[195px] mt-5 mb-5 w-full flex items-center justify-center relative">
        {/* ✅ Hamburger (mobile only) */}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
          {bannerTitles[currentPage]}
        </h2>
      </div>
      <hr className="w-[100%] mx-auto border-black" />

      {/* ✅ Layout */}
      <div className="flex flex-1 portal-container">
        {/* ✅ Sidebar (desktop = visible, mobile = overlay) */}
        <div className="hidden lg:block">
          <AffiliatePortalSidebar
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            onLogout={onLogout}
            isOpen={true} // always open on desktop
          />
        </div>

        {/* ✅ Mobile Sidebar (slides in) */}
        {isSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
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

        {/* ✅ Page Content */}
        <div className="flex-1 p-8">
          {currentPage === 'dashboard' && <DashboardBoxes />}
          {currentPage === 'marketing' && <MarketingBoxes />}
          {currentPage === 'portal' && <DashboardBoxes />}
          {currentPage === 'account' && <AccountPage/>}
          {currentPage === 'affiliateActivity' && <AffiliateActivity/>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
