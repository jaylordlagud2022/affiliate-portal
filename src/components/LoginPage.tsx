import React, { useState } from "react";
import AuthService from "../services/authService";
import logo from "../assets/logo.jpeg";
import RegisterPage from "./RegisterPage";
import Footer from "./Footer"; // ✅ import Footer

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"login" | "verify" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authService = new AuthService("hubspot");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await authService.login({ email, password: "" });
    if (result.success) {
      setStep("verify");
    } else {
      setError(result.error || "Failed to send code");
    }

    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.verifyHubspotCode(code, email);
      if (result?.success === true && result.data?.token) {
        onLogin(result.data);
      } else {
        setError(result?.error || "Invalid code");
      }
    } catch (err) {
      setError("Something went wrong while verifying.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bannerTitle =
    step === "register"
      ? "Affiliate register"
      : step === "verify"
      ? "Affiliate verify"
      : "Affiliate login";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main content wrapper */}
      <div className="flex-grow flex justify-center">
        <div className="w-full max-w-[1235px] mx-auto px-4 sm:px-6 mt-6">
          {/* Header */}
          <div className="w-full bg-white">
            <div className="flex items-center justify-center sm:justify-start h-[90px]">
              <img
                src={logo}
                alt="Property Investors Logo"
                className="h-[60px] sm:h-[70px] w-auto object-contain"
              />
            </div>
          </div>

          <hr className="w-full border-black mt-4" />

          {/* Red Banner */}
          <div className="bg-[#d02c37] text-white mt-5 mb-5 w-full flex items-center justify-center rounded-md px-4 py-8 sm:py-12">
            <h2
              className="font-light text-center text-[1.8em] sm:text-[2.7em] leading-snug"
              style={{
                fontFamily: '"Maven Pro", sans-serif',
                letterSpacing: "-0.5px",
                wordSpacing: "2px",
                lineHeight: "1.3",
              }}
            >
              <span className="font-medium">Property Investors.</span>{" "}
              <span>{bannerTitle}.</span>
            </h2>
          </div>

          <hr className="w-full border-black" />

          {/* Main Content */}
          {step === "register" ? (
            <div className="flex flex-col lg:flex-row mt-6 gap-8">
              {/* Left Text */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3
                  className="text-lg font-semibold text-gray-800 mb-4"
                  style={{ fontFamily: "Verdana, sans-serif" }}
                >
                  Join the Property Investors Affiliate Hub.
                </h3>
                <p className="text-gray-700 mb-3 text-base">
                  Thank you for your interest in partnering with us. By registering,
                  you’ll take the first step toward becoming a Property Investors affiliate.
                </p>
                <p className="text-gray-700 mb-3 text-base">
                  By joining our affiliate hub, you’ll gain full access to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-3 text-base text-left inline-block">
                  <li>Exclusive marketing materials and tools</li>
                  <li>Real-time progress of your opportunities and rewards</li>
                  <li>Training resources to help you succeed</li>
                  <li>Ongoing support from your dedicated sales representative</li>
                </ul>
                <p className="text-gray-700 mb-3 text-base">
                  Your success is our priority, and we’re here to provide everything
                  you need to make the most of this partnership.
                </p>
                <p className="text-gray-900 font-semibold text-base">
                  Partner with us to get started.
                </p>
              </div>

              {/* Register Form */}
              <div className="w-full lg:w-1/2">
                <RegisterPage onBack={() => setStep("login")} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row mt-6 gap-8">
              {/* Left Text */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3
                  className="text-lg font-semibold text-gray-800 mb-4"
                  style={{ fontFamily: "Verdana, sans-serif" }}
                >
                  Affiliate Hub.
                </h3>
                <p className="text-gray-700 mb-3 text-base">
                  Our Affiliate Program is designed to create strong, long-term business
                  partnerships built on trust and shared success.
                </p>
                <p className="text-gray-700 mb-3 text-base">
                  We work closely with our affiliates to provide the tools, resources,
                  and support needed to grow together.
                </p>
                <p className="text-gray-700 mb-3 text-base">
                  With access to an exclusive hub and direct communication with your
                  dedicated sales representative, you’ll always have what you need to
                  succeed and strengthen our business relationship.
                </p>
              </div>

              {/* Login / Verify Form */}
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="w-full flex justify-start mb-2">
                  <button
                    onClick={() => setStep("login")}
                    className="text-lg font-semibold text-gray-800"
                    style={{ fontFamily: "Verdana, sans-serif" }}
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

                  {step === "login" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-full focus:ring-1 focus:border-transparent text-base"
                        placeholder="Enter Email Address"
                        required
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#d02c37] text-white rounded-full font-semibold transition-colors disabled:opacity-50"
                      >
                        {loading ? "Please wait..." : "Send Code"}
                      </button>
                    </form>
                  )}

                  {step === "verify" && (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-3 border rounded-full focus:ring-1 focus:border-transparent text-base"
                        placeholder="Enter verification code"
                        required
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#d02c37] text-white rounded-full font-semibold transition-colors disabled:opacity-50"
                      >
                        {loading ? "Verifying..." : "Verify Code"}
                      </button>
                    </form>
                  )}
                </div>

                {step !== "verify" && (
                  <div className="mt-6 text-center">
                    <p
                      className="text-gray-700 text-base"
                      style={{ fontFamily: "Verdana, sans-serif" }}
                    >
                      Looking to partner with us?{" "}
                      <button
                        onClick={() => setStep("register")}
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
      </div>

      {/* ✅ Footer at the bottom (same width as content) */}
      <Footer />
    </div>
  );
};

export default LoginPage;
