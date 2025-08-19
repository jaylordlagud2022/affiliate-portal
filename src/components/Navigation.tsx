import React from 'react';
import logo from '../assets/logo.png'; // adjust the path based on file location

interface NavigationProps {
  currentPage: 'dashboard' | 'account' | 'affiliate';
  onNavigate: (page: 'dashboard' | 'account' | 'affiliate') => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#efefef] shadow-sm z-50">
      <div className="max-w-6x1 mx-auto px-3 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              {/* Logo Image */}
 
              <img src={logo} alt="Property Investors Logo" className="w-8 h-8 object-contain" />

              <h1 className="text-xl font-bold text-gray-800">Property Investors</h1>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => onNavigate('account')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'account'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Account
              </button>
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
