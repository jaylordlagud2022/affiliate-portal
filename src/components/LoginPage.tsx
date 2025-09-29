import React, { useState } from 'react';
import AuthService from '../services/authService';
import logo from '../assets/logo.jpeg'; // adjust the path
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
      ? 'Affiliate register'
      : step === 'verify'
      ? 'Affiliate verify'
      : 'Affiliate login';

  return (
    <div className="w-[1235px]  mx-auto px-1 flex flex-col mt-6">
      {/* Header */}
      <div className="w-full bg-white">
        {/* Header */}
        <div className="w-[1235px] mx-auto flex items-center h-[90px]">
          <img
            src={logo}
            alt="Property Investors Logo"
            className="h-[79px] w-auto object-contain" // keeps proportions
             style={{ marginLeft: "-36px" }}
          />
        </div>
      </div>

      {/* ✅ HR before banner */}
      <hr className="w-full mx-auto border-black mt-4" />

      {/* 🔴 Red Banner */}
      <div className="bg-[#d02c37] text-white text-center h-[195px] mt-5 mb-5 w-full flex items-center justify-center">
        <h2
          style={{
            fontFamily: '"Maven Pro", sans-serif',
            fontSize: '2.7em',
            fontWeight: 300,
            lineHeight: '1.2em',
            letterSpacing: '-2.7px',
            color: '#FFFFFF',
          }}
        >
          <span style={{ fontWeight: 500 }}>Property investors.</span>{' '}
          <span>{bannerTitle}.</span>
        </h2>
      </div>
      <hr className="w-[100%] mx-auto border-black" />

      {/* ✅ Layout changes depending on step */}
      {step === 'register' ? (
        // 📌 Register Layout (70/30)
        <div className="flex flex-row mt-6 gap-6">
          {/* 70% Left Section */}
          <div className="w-[50%]">
            <h3 className=" text-lg font-semibold text-gray-800 mb-4 " style={{ fontFamily: 'Verdana, sans-serif' }}>
              Join the Property Investors Affiliate Hub.
            </h3>
            <p
              className="text-gray-700 mb-3"
              style={{ fontFamily: 'Verdana, sans-serif', fontSize: '16px' }}
            >
              Thank you for your interest in partnering with us. By registering,
              you’ll take the first step toward becoming a Property Investors
              affiliate.
            </p>
            <p
              className="text-gray-700 mb-3"
              style={{ fontFamily: 'Verdana, sans-serif', fontSize: '16px' }}
            >
              By joining our affiliate hub, you’ll gain full access to:
            </p>
            <ul
              className="list-disc list-inside text-gray-700 mb-3"
              style={{ fontFamily: 'Verdana, sans-serif', fontSize: '16px' }}
            >
              <li>Exclusive marketing materials and tools</li>
              <li>Real-time progress of your opportunities and rewards</li>
              <li>Training resources to help you succeed</li>
              <li>Ongoing support from your dedicated sales representative</li>
            </ul>
            <p
              className="text-gray-700 mb-3"
              style={{ fontFamily: 'Verdana, sans-serif', fontSize: '16px' }}
            >
              Your success is our priority, and we’re here to provide everything
              you need to make the most of this partnership.
            </p>
            <p
              className="text-gray-900 font-semibold"
              style={{ fontFamily: 'Verdana, sans-serif', fontSize: '16px' }}
            >
             Partner with us to get started.
            </p>
          </div>

          {/* 30% Register Form */}
          <div className="w-[50%] flex flex-col items-center justify-start">
            <div className="w-full">
              <RegisterPage onBack={() => setStep('login')} />
            </div>
          </div>
        </div>
      ) : (
        // 📌 Login + Verify Layout (70/30)
        <div className="flex flex-row mt-6 gap-6">
          {/* 70% Text Section */}
          <div className="w-[50%]">
<h3 className=" text-lg font-semibold text-gray-800 mb-4 " style={{ fontFamily: 'Verdana, sans-serif' }}>
              Affiliate Hub.
            </h3>
            <p
              className="text-gray-700 mb-3"
              style={{ fontFamily: 'Verdana, sans-serif', fontSize: '16px' }}
            >
              Our Affiliate Program is designed to create strong, long-term
              business partnerships built on trust and shared success. We work
              closely with our affiliates to provide the tools, resources, and
              support needed to grow together. With access to an exclusive hub,
              direct communication with your dedicated sales representative,
              you’ll always have what you need to succeed and strengthen the
              relationship between our businesses.
            </p>

          </div>

          {/* 30% Login/Verify Form */}
          <div className="w-[50%] flex flex-col items-center justify-start">
            {/* ✅ Existing Affiliate Button */}
 
              <div className="w-full flex justify-start mb-2">
                <button
                  onClick={() => setStep('login')}
                  className="text-lg font-semibold text-gray-800"
                >
                  Existing Affiliate?
                </button>
              </div>
    
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
                    placeholder="Enter Email Address"
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

            {/* Create Account */}
            {step !== 'verify' && (
              <div className="mt-6 text-center">
                <p className="text-gray-700 text-sm" style={{fontSize: '1.3em'}}>
                  Looking to partner with us?{' '}
                  <button
                    onClick={() => setStep('register')}
                    className="font-semibold text-[#d02c37] hover:underline"
                  >
                    Register today
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
