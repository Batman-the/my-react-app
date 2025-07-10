import React from "react";
import logo from "./assets/logo.png"; // Replace with your game logo

const Header = () => {
  const navItems = [
    { id: "a2z", label: "A2Z" },
    { id: "categories", label: "Categories" },
    { id: "trending", label: "Trending" },
    { id: "recent", label: "Recent" },
    { id: "most-download", label: "Most Download" },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-700 to-indigo-800 shadow-lg h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full space-x-4">
        {/* Logo and Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => scrollToSection("home")}
        >
          <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />
          <span className="text-2xl font-extrabold text-white tracking-wide select-none">
            Game<span className="text-yellow-400">Hub</span>
          </span>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-5 font-medium text-white">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="transition-all duration-300 hover:text-yellow-400 hover:scale-110 active:scale-95 cursor-pointer"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="hidden md:flex">
          <input
            type="text"
            placeholder="Search games..."
            className="px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
