// src/components/Footer.js
import React from "react";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, 
  FaGamepad, FaFire, FaStar, FaClock 
} from "react-icons/fa";

const Footer = () => {
  const links = [
    { name: "All Games", icon: <FaGamepad />, href: "/allgames" },
    { name: "New Releases", icon: <FaClock />, href: "/newreleases" },
    { name: "Top Rated", icon: <FaStar />, href: "/toprated" },
    { name: "Hot Deals", icon: <FaFire />, href: "/hotdeals" },
    { name: "FAQ", icon: null, href: "/faq" },
    { name: "Help Center", icon: null, href: "/helpcenter" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 relative overflow-hidden">
      {/* Neon gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-10 animate-pulse pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 z-10">

        {/* Brand + Socials */}
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white text-shadow-glow">🎮 GameHub</h2>
          <div className="flex space-x-3 text-lg">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, idx) => (
              <Icon
                key={idx}
                className="transition-transform transform hover:scale-125 hover:shadow-neon duration-300 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Quick Links with icons */}
        <div className="flex flex-wrap justify-center gap-5 text-sm">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="flex items-center gap-1 hover:text-white hover:underline transition duration-200"
            >
              {link.icon && <span className="text-blue-400">{link.icon}</span>}
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-4 pt-3 text-center text-xs text-gray-500 relative z-10">
        © {new Date().getFullYear()} GameHub
      </div>

      {/* Extra glow styles */}
      <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 4px #ff00ff, 0 0 8px #ff00ff;
        }
        .hover\\:shadow-neon:hover {
          text-shadow: 0 0 6px #00ffff, 0 0 12px #ff00ff, 0 0 16px #ff00ff;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
