import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import logo from '../assets/logo.png';

interface NavigationProps {
  currentPage: 'dashboard' | 'account' | 'affiliate' | 'marketing'  ;
  onNavigate: (page: 'dashboard' | 'account' | 'affiliate' | 'marketing') => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  userName?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  onToggleSidebar,
  userName = 'John Doe',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="w-[1235px] mx-auto px-1 py-4 flex items-center justify-between border-b border-black bg-white">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Property Investors Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-xl font-bold text-gray-800">Property Investors</h1>
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
                {/* <button
                  onClick={() => { onNavigate('account'); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  Account
                </button> */}
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
