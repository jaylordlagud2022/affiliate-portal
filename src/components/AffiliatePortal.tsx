import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';

const AffiliatePortal: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'register' | 'dashboard'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const goBack = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={goBack} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onBack={goBack} />;
  }

  if (currentPage === 'dashboard' && isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center mb-6">
          {/* Left Section - Portal Access */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-8">
              AFFILIATE PORTAL<br />ACCESS
            </h1>
            <div className="space-y-4">
              <button
                onClick={() => setCurrentPage('login')}
                className="w-full py-4 px-6 border-2 border-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                I AM AN AFFILIATE<br />LOG IN
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="w-full py-4 px-6 border-2 border-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                I AM NOT AN AFFILIATE<br />REGISTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePortal;