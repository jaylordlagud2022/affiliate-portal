import React from "react";
import { Facebook, Linkedin, Youtube, Instagram } from "lucide-react";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer
      className="
        w-full border-t border-gray-200 bg-white
        py-4 flex justify-center relative z-[9999]
      "
    >

      {/* Inner container — matches Navigation width */}
      <div
        className="
          w-full max-w-6xl 
          flex flex-col md:flex-row 
          justify-between items-center
          px-6 text-sm text-gray-800
        "
      >
        {/* Left side - Social icons */}
        <div className="flex items-center space-x-4 text-[#d02c37] mb-3 md:mb-0">
          <FaXTwitter className="w-5 h-5 cursor-pointer hover:opacity-70" />
          <Facebook className="w-5 h-5 cursor-pointer hover:opacity-70" />
          <Linkedin className="w-5 h-5 cursor-pointer hover:opacity-70" />
          <Youtube className="w-5 h-5 cursor-pointer hover:opacity-70" />
          <Instagram className="w-5 h-5 cursor-pointer hover:opacity-70" />
          <FaTiktok className="w-5 h-5 cursor-pointer hover:opacity-70" />
        </div>

        {/* Right side - Links */}
        <div className="flex flex-wrap items-center space-x-4 text-gray-800 font-semibold" style={{ fontFamily: "Verdana, sans-serif" }}>
          <a href="#" className="hover:underline">
            Corporate profile.
          </a>
          <a href="#" className="hover:underline">
            Glossary.
          </a>
          <div className="relative group">
            <button className="hover:underline flex items-center">
              Legal statements <span className="ml-1">▾</span>
            </button>
            {/* Dropdown */}
            <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2 py-2 text-sm w-48 z-[10000]">
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Privacy Policy
              </a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Terms of Service
              </a>
            </div>
          </div>
          <a href="#" className="hover:underline">
            Current events.
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
