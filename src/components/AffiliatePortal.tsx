import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';

const AffiliatePortal: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const goToRegister = () => {
    setCurrentPage('register');
  };

  const goBackToLogin = () => {
    setCurrentPage('login');
  };

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onRegister={goToRegister} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onBack={goBackToLogin} />;
  }

  if (currentPage === 'dashboard' && isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return null;
};

export default AffiliatePortal;
