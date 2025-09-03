import React from 'react';

type PageType = 'portal' | 'account' | 'marketing' | 'dashboard' | 'affiliate' | 'affiliateActivity';

interface AffiliatePortalSidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
  isOpen: boolean;
}

const AffiliatePortalSidebar: React.FC<AffiliatePortalSidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  isOpen,
}) => {
  const menuItems: { id: PageType; label: string }[] = [
    { id: 'portal', label: 'Dashboard Hub' },
    { id: 'marketing', label: 'Marketing Hub' },
    { id: 'affiliateActivity', label: 'Partner Status Hub' },
    { id: 'account', label: 'Account Hub' },

  ];

  return (
    <aside
      className={`
        side-bar-portal bg-white w-64 h-full shadow-md
        ${isOpen ? 'z-50' : 'z-80'}
        transform transition-transform duration-300 ease-in-out
        fixed top-0 left-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:block
      `}
    >
      {/* Sidebar Header */}
      <div className="px-7 pt-12 pb-6">
        <h1 className="text-lg font-bold text-gray-800">Affiliate Hub</h1>
      </div>

      {/* Sidebar nav */}
      <nav className="p-4 space-y-2 pb-14">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-full flex items-center px-4 py-3 rounded-lg text-left transition
              ${
                currentPage === item.id
                  ? 'bg-[#d02c37] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-900 hover:text-white'
              }
            `}
          >
            {item.label}
          </button>
        ))}


      </nav>
    </aside>
  );
};

export default AffiliatePortalSidebar;
