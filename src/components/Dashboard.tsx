import React, { useState } from 'react';
import Navigation from './Navigation';
import DashboardContent from './DashboardContent';
import AccountPage from './AccountPage';
import Portal from './Portal';
import AffiliatePortalSidebar from './AffiliatePortalSidebar'; // ✅ Correct import

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<'portal' |'dashboard' | 'account' | 'affiliate'>('portal');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar always visible */}
      <AffiliatePortalSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 pt-16">
        <Navigation
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={onLogout}
        />

        {currentPage === 'portal' && <Portal />}
        {currentPage === 'dashboard' && <DashboardContent />}
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'affiliate' && <div>Affiliate Content</div>}
      </div>
    </div>
  );
};

export default Dashboard;
