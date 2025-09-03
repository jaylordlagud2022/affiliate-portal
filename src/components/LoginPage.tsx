import React, { useState } from 'react';
import AuthService from '../services/authService';
import logo from '../assets/logo.png'; // adjust the path
import RegisterPage from './RegisterPage';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'login' | 'verify' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authService = new AuthService('hubspot');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.login({ email, password: '' });
    if (result.success) {
      setStep('verify');
    } else {
      setError(result.error || 'Failed to send code');
    }

    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.verifyHubspotCode(code, email);
      if (result?.success === true && result.data?.token) {
        onLogin(result.data);
      } else {
        setError(result?.error || 'Invalid code');
      }
    } catch (err) {
      setError('Something went wrong while verifying.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Banner titles based on step
  const bannerTitle =
    step === 'register'
      ? 'AFFILIATE REGISTER'
      : step === 'verify'
      ? 'AFFILIATE VERIFY'
      : 'AFFILIATE LOGIN';

  return (

    <div className="w-[1235px] mx-auto px-1 flex flex-col mt-6">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Property Investors Logo"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800">
              Property Investors
            </h1>
          </div>
        </div>
      {/* ✅ HR directly before banner */}
      <hr className="w-full mx-auto border-black mt-4" />
      {/* 🔴 Red Banner */}
      <div className="bg-[#d02c37] text-white text-center h-[195px] mt-5 mb-5 w-full flex items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
          {bannerTitle}
        </h2>
      </div>
      <hr className="w-[100%] mx-auto border-black" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-6">
        {/* ✅ Only wrap login & verify in a card */}
        {step !== 'register' && (
          <div className="bg-white rounded-lg p-6 shadow w-full max-w-lg">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Login Form */}
            {step === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-full focus:ring-1 focus:border-transparent"
                  placeholder="Email Address"
                  required
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#d02c37] text-white rounded-full font-semibold  transition-colors disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : 'Send Code'}
                </button>
              </form>
            )}

            {/* Verify Form */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 border rounded-full focus:ring-1 focus:border-transparent"
                  placeholder="Enter verification code"
                  required
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#d02c37] text-white rounded-full font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ✅ RegisterPage is shown directly, no card */}
        {step === 'register' && (
          <div className="w-full max-w-3xl">
            <RegisterPage onBack={() => setStep('login')} />
          </div>
        )}

        {/* Create Account */}
        {step !== 'register' && (
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm">
              Don’t have an account?{' '}
              <button
                onClick={() => setStep('register')}
                className="font-semibold text-[#d02c37] hover:underline"
              >
                Create account
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
