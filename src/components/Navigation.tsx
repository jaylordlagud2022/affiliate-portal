import React from 'react';
import logo from '../assets/logo.png'; // adjust the path based on file location

interface NavigationProps {
  currentPage: 'dashboard' | 'account' | 'affiliate';
  onNavigate: (page: 'dashboard' | 'account' | 'affiliate') => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b-2 border-black z-50">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              {/* Logo Image */}
              <img src={logo} alt="Property Investors Logo" className="w-8 h-8 object-contain" />
              <h1 className="text-xl font-bold text-gray-800">Property Investors</h1>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
