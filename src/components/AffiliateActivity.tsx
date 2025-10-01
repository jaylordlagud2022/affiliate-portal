import React, { useState, useEffect } from "react";
import BronzeImg from "../assets/03 House Bronze.png";
import SilverImg from "../assets/03 House Silver.png";
import GoldImg from "../assets/03 House Gold.png";
import PlatinumImg from "../assets/03 House Platinum.png";
import SmallHouseImg from "../assets/06-House.png";
import SmallHouseActiveImg from "../assets/06 House Company Red.png";
import logo from "../assets/logo.png"; // ✅ icon for rewards list

const AffiliateActivity: React.FC = () => {
  const [num, setNum] = useState(2); // ✅ base value is 2
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;

    const fetchCommissions = async () => {
      try {
        const res = await fetch(
          `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-commissions?token=${token}`
        );
        const result = await res.json();

        // ✅ Check inside `result.data`
        const commissions = Array.isArray(result.data) ? result.data : [];

        setNum(2 + commissions.length);

        console.log("fetching commissions:", commissions.length);
      } catch (error) {
        console.error("Error fetching commissions:", error);
      }
    };

    fetchCommissions();
  }, [token]);


  if (!token) return null;

  /** Render small houses dynamically */
  const renderSmallHouses = (count: number, startIndex: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const currentIndex = startIndex + i;

      // ✅ Highlight if num has reached this position
      const isActive = num >= currentIndex;

      return (
        <img
          key={i}
          src={isActive ? SmallHouseActiveImg : SmallHouseImg}
          alt="small house"
          className="w-11 h-11"
        />
      );
    });
  };

  return (
    <div className="min-h-screen font-sans bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Status Reward */}
        <h3 className="text-2xl font-bold text-gray-700 mb-6 pb-3">
          Status Reward
        </h3>

        {/* Progress bar with houses + rewards */}
        <div className="flex items-start justify-between mb-12 flex-wrap gap-8">
          {/* Bronze (hidden when num >= 5) */}
          {num < 5 && (
            <div className="flex flex-col items-center flex-1">
              {/* Big + Small houses side by side */}
              <div className="flex items-center gap-2 relative">
                {/* Bronze big house (milestone = 0) */}
                <img
                  src={BronzeImg}
                  alt="Bronze"
                  className={`w-20 h-20 ${num >= 0 ? "opacity-100" : ""}`}
                />
                <div className="flex gap-2 relative">
                  <span className="absolute -top-5 left-0 w-full text-xs text-red-600 font-medium text-left">
                    Complimentary
                  </span>
                  {/* Bronze smalls = 1–4 */}
                  {renderSmallHouses(4, 1)}
                </div>
              </div>
              <span className="mt-2 font-semibold text-gray-800">Bronze</span>

              {/* Empty space instead of Bronze reward */}
              <div className="mt-8 w-full max-w-xs h-[180px]"></div>
            </div>
          )}

          {/* Silver (starts at 5) */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2">
              {/* Silver big house (milestone = 5) */}
              <img
                src={SilverImg}
                alt="Silver"
                className={`w-20 h-20 ${num >= 5 ? "opacity-100" : ""}`}
              />
              <div className="flex gap-2">
                {/* Silver smalls = 6–9 */}
                {renderSmallHouses(4, 6)}
              </div>
            </div>
            <span className="mt-2 font-semibold text-gray-800">Silver</span>

            {/* Silver reward card */}
            <div className="mt-4 w-full max-w-xs">
              <div className="text-center">
                <button className="bg-[#C0C0C0] text-white px-4 py-2 rounded-full font-semibold">
                  Obtain Silver Rewards
                </button>
                <ul className="mt-4 space-y-2 text-gray-700 text-left text-[12px]">
                  <li className="flex items-center gap-2">
                    <img src={logo} alt="x" className="w-4 h-4" />
                    $1000 reward travel vouchers
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={logo} alt="x" className="w-4 h-4" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={logo} alt="x" className="w-4 h-4" />
                    Exclusive access to our Affiliate Hub
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gold (starts at 9) */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2">
              {/* Gold big house (milestone = 9) */}
              <img
                src={GoldImg}
                alt="Gold"
                className={`w-20 h-20 ${num >= 9 ? "opacity-100" : ""}`}
              />
              <div className="flex gap-2">
                {/* Gold smalls = 10–13 */}
                {renderSmallHouses(4, 10)}
              </div>
            </div>
            <span className="mt-2 font-semibold text-gray-800">Gold</span>

            {/* Gold reward card */}
            <div className="mt-4 w-full max-w-xs">
              <div className="text-center">
                <button className="bg-[#E5B80B] text-white px-4 py-2 rounded-full font-semibold">
                  Obtain Gold Rewards
                </button>
                <ul className="mt-4 space-y-2 text-gray-700 text-left text-[12px]">
                  <li className="flex items-center gap-2">
                    <img src={logo} alt="x" className="w-4 h-4" />
                    $2000 Reward travel vouchers
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={logo} alt="x" className="w-4 h-4" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={logo} alt="x" className="w-4 h-4" />
                    Exclusive access to our Affiliate Hub
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Platinum (takes Bronze’s place when num >= 5) */}
          {num >= 5 && (
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-2">
                <img
                  src={PlatinumImg}
                  alt="Platinum"
                  className={`w-20 h-20 ${num >= 13 ? "opacity-100" : ""}`}
                />
                <div className="flex gap-2">
                  {/* Platinum smalls = 14–17 */}
                  {renderSmallHouses(4, 14)}
                </div>
              </div>
              <span className="mt-2 font-semibold text-gray-800">
                Platinum
              </span>

              {/* Platinum reward card */}
              <div className="mt-4 w-full max-w-xs">
                <div className="text-center">
                  <button className="bg-[#979392] text-white px-4 py-2 rounded-full font-semibold">
                    Obtain Platinum Rewards
                  </button>
                  <ul className="mt-4 space-y-2 text-gray-700 text-left text-[12px]">
                    <li className="flex items-center gap-2">
                      <img src={logo} alt="x" className="w-4 h-4" />
                      $3000 Reward travel vouchers
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={logo} alt="x" className="w-4 h-4" />
                      Dedicated VIP support
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={logo} alt="x" className="w-4 h-4" />
                      Premium Affiliate Hub Access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateActivity;
