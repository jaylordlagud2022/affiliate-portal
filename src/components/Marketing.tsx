import React, { useState } from 'react';
import AffiliatePortalSidebar from './AffiliatePortalSidebar';
import MarketingBoxes from './MarketingBoxes';
import DashboardBoxes from './DashboardBoxes';

type PageType = 'portal' | 'marketing' | 'dashboard' | 'account' | 'affiliate';

interface MarketingProps {
  onLogout: () => void;
}

const pageTitles: Record<PageType, string> = {
  portal: 'PORTAL HUB',
  marketing: 'MARKETING HUB',
  dashboard: 'DASHBOARD',
  account: 'ACCOUNT SETTINGS',
  affiliate: 'AFFILIATE HUB',
};

const Marketing: React.FC<MarketingProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('marketing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* 🔴 Red Banner */}

      <div className="bg-[#d02c37] text-white text-center h-[195px] mt-5 mb-5 w-full flex items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
          {pageTitles[currentPage]}
        </h2>
      </div>
      <hr className="w-[100%] mx-auto border-black" />

      {/* Main Layout with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AffiliatePortalSidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            setIsSidebarOpen(false);
          }}
          onLogout={onLogout}
          isOpen={isSidebarOpen}
        />

        {/* Page Content */}
        <div className="flex-1 p-8">
          {currentPage === 'marketing' && <MarketingBoxes />}
          {currentPage === 'dashboard' && <DashboardBoxes />}
          {currentPage === 'portal' && <DashboardBoxes />}
          {currentPage === 'account' && <div>Account Content</div>}
          {currentPage === 'affiliate' && <div>Affiliate Content</div>}
        </div>
      </div>
    </div>
  );
};

export default Marketing;
