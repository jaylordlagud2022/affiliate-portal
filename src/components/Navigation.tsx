import React, { useState, useEffect } from 'react';
import { Menu, User } from 'lucide-react';
import logo from '../assets/logo.jpeg';

interface NavigationProps {
  currentPage: 'dashboard' | 'account' | 'affiliate' | 'marketing';
  onNavigate: (page: 'dashboard' | 'account' | 'affiliate' | 'marketing') => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  onToggleSidebar,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>('John Doe');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    console.log("🔑 Raw currentUser:", storedUser);

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const hubspotData = parsed.hubspot || {};
        const fullName = [hubspotData.firstname, hubspotData.lastname]
          .filter(Boolean)
          .join(' ')
          .trim();

        if (fullName) {
          setUserName(fullName);
        } else if (parsed.email) {
          setUserName(parsed.email);
        }
      } catch (e) {
        console.error("❌ Failed to parse currentUser from localStorage:", e);
      }
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white pt-6">
      <div className="font-maven w-[1235px] mx-auto px-1 py-4 flex items-center justify-between border-b border-black bg-white">
        {/* Logo (linked to propertyinvestors.com.au) */}
        <div className="flex items-center space-x-3">
          <a href="https://propertyinvestors.com.au/" target="_blank" rel="noopener noreferrer">
            <img
              src={logo}
              alt="Property Investors Logo"
              className="h-[79px] w-auto object-contain"
              style={{ marginLeft: "-36px" }}
            />
          </a>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Hamburger on mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>

          {/* User name */}
          <span className="hidden sm:inline font-medium text-gray-800">{userName}</span>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <User className="w-5 h-5 text-gray-800" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
