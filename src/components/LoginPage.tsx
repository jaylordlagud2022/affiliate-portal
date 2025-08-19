import React, { useState } from 'react';
import AuthService from '../services/authService';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login'); // ✅ Start at login
  const [apiType, setApiType] = useState<'wordpress' | 'hubspot'>('hubspot');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authService = new AuthService(apiType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (apiType === 'wordpress') {
      const result = await authService.login({ email, password });
      if (result.success && result.data) {
        onLogin(result.data);
      } else {
        setError(result.error || 'Login failed');
      }
    } else {
      // HubSpot login step 1: send code
      const result = await authService.login({ email, password: '' });
      if (result.success) {
        setStep('verify'); // ✅ Go to verification step
      } else {
        setError(result.error || 'Failed to send code');
      }
    }

    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.verifyHubspotCode(code, email);
      console.log('Result:', result);

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 border rounded-lg"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">
            {apiType === 'hubspot' && step === 'verify' ? 'Verify Code' : 'Login'}
          </h1>
        </div>

        {/* API Type Toggle */}
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => {
              setApiType('wordpress');
              setStep('login');
            }}
            className={`flex-1 py-2 rounded-lg border ${
              apiType === 'wordpress' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            WordPress
          </button>
          <button
            onClick={() => {
              setApiType('hubspot');
              setStep('login');
            }}
            className={`flex-1 py-2 rounded-lg border ${
              apiType === 'hubspot' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            HubSpot
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Login */}
        {step === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {apiType === 'wordpress' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : apiType === 'hubspot' ? 'Send Code' : 'Log In'}
            </button>
          </form>
        )}

        {/* Step 2: Verify Code */}
        {apiType === 'hubspot' && step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <input type="hidden" value={email} name="email" />
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the code sent to your email"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          {apiType === 'wordpress' && (
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot your password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
