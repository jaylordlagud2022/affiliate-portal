import React, { useEffect } from 'react';

type PageType = 'portal' | 'marketing' | 'dashboard' | 'account' | 'affiliate';

interface AffiliatePortalSidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

const AffiliatePortalSidebar: React.FC<AffiliatePortalSidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
}) => {
  const menuItems: { id: PageType; label: string }[] = [
    { id: 'portal', label: 'Portal' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'dashboard', label: 'Overview' },
    { id: 'account', label: 'Account' },
  ];

  useEffect(() => {
    // Inject HubSpot chat embed only once
    if (!document.getElementById('hs-script-loader')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'hs-script-loader';
      script.async = true;
      script.defer = true;
      script.src = '//js.hs-scripts.com/46099113.js'; // Replace with your HubSpot ID
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-64 bg-[#efefef] border-r border-gray-200 min-h-screen relative">
      {/* Logo */}
      <div className="p-6 border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg"></span>
          </div>
        </div>
      </div>
      <div className="p-6 border-gray-200">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Affiliate Portal</h1>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === item.id
                ? 'bg-red-50 text-red-700 border-l-4 border-red-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
            }`}
          >
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <nav className="p-4 space-y-2">
        <button
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50 hover:text-red-600`}
        >
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default AffiliatePortalSidebar;
