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
  const [step, setStep] = useState<'login' | 'verify' | 'register' | 'thankyou'>('login');
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
      : step === 'thankyou'
      ? 'REGISTRATION SUBMITTED'
      : 'AFFILIATE LOGIN';

  return (
    <div className="w-[1235px] mx-auto px-1 flex flex-col mt-6">
      {/* Header */}
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

      {/* ✅ HR before banner */}
      <hr className="w-full mx-auto border-black mt-4" />

      {/* 🔴 Red Banner */}
      <div className="bg-[#d02c37] text-white text-center h-[195px] mt-5 mb-5 w-full flex items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
          {bannerTitle}
        </h2>
      </div>

      <hr className="w-[100%] mx-auto border-black" />

      {/* ✅ 70/30 Layout */}
      <div className="flex flex-row mt-6 gap-6">
        {/* 70% Section */}
        <div className="w-[70%]">
          {step === 'thankyou' ? (
            // ✅ Green thank you box
            <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Thank you for registering.</h3>
              <p className="mb-3">
                Your application to join the <strong>Property Investors Affiliate Program</strong> has been successfully submitted.
              </p>
              <p className="mb-3">
                A member of our team will review your registration and reach out to you shortly to confirm your details. We’re excited to partner with you and look forward to helping you grow with us.
              </p>
              <p className="font-semibold">
                Next Step: Keep an eye on your phone and email — our team will be in touch soon.
              </p>
            </div>
          ) : (
            // ✅ Default intro text
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thank you for your interest in partnering with us.
              </h3>
              <p className="text-gray-700 mb-3">
                By registering, you’ll take the first step toward becoming a Property Investors affiliate.
              </p>
              <p className="text-gray-700 mb-3">
                By joining our affiliate hub, you’ll gain full access to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Exclusive marketing materials and tools</li>
                <li>Real-time progress of your opportunities and rewards</li>
                <li>Training resources to help you succeed</li>
                <li>Ongoing support from your dedicated sales representative</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Your success is our priority, and we’re here to provide everything you need to make the most of this partnership.
              </p>
              <p className="text-gray-800 font-semibold mt-4">Register now to get started.</p>
            </div>
          )}
        </div>

        {/* 30% Login/Register Section */}
        <div className="w-[30%] flex flex-col items-center justify-start">
          {step !== 'register' && step !== 'thankyou' && (
            <div className="bg-white rounded-lg p-6 shadow w-full">
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
                    className="w-full py-3 bg-[#d02c37] text-white rounded-full font-semibold transition-colors disabled:opacity-50"
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

          {/* ✅ RegisterPage shown directly */}
          {step === 'register' && (
            <div className="w-full">
              <RegisterPage onBack={() => setStep('login')} onSuccess={() => setStep('thankyou')} />
            </div>
          )}

          {/* Create Account */}
          {step !== 'register' && step !== 'thankyou' && (
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
    </div>
  );
};

export default LoginPage;
