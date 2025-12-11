// src/components/Header.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu } from "@headlessui/react";
import { FaUserCircle, FaGoogle } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loginWithGoogle, fetchFavorites } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const updateCount = async () => {
      if (user) {
        const favs = await fetchFavorites();
        setFavoritesCount(favs.length);
      } else {
        setFavoritesCount(0);
      }
    };
    updateCount();
  }, [user, fetchFavorites]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className="relative px-2 py-1 font-semibold text-white text-glow transition duration-300 hover:text-blue-400"
    >
      {label}
      {label === "Favorites" && favoritesCount > 0 && (
        <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 ml-1">
          {favoritesCount}
        </span>
      )}
    </Link>
  );

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/favorites");
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <header className="relative bg-gray-900 dark:bg-gray-800 shadow sticky top-0 z-50 overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 animate-pulse pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-2xl font-bold text-white text-glow relative z-10 cursor-pointer"
          >
            <img
              src="/gamehub-logo.png"
              alt="GameHub Logo"
              className="h-10 w-auto object-contain logo-glow"
            />
            <span className="hidden sm:inline">GameHub</span>
          </a>

          {/* Navigation */}
          <nav className="flex gap-4 items-center relative z-10">
            {navLink("/top-games", "Top Games")}

            {/* Updated Favorites link as button */}
            <button
              onClick={handleFavoritesClick}
              className="relative px-2 py-1 font-semibold text-white text-glow transition duration-300 hover:text-blue-400"
            >
              Favorites
              {favoritesCount > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 ml-1">
                  {favoritesCount}
                </span>
              )}
            </button>

            {navLink("/about", "About")}
            {user?.isAdmin && navLink("/admin", "Upload Game")}

            {/* Account Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 text-glow">
                <FaUserCircle size={20} />
                <span className="hidden sm:inline">
                  {user ? user.displayName || user.email : "Account"}
                </span>
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white overflow-visible z-50">
                {user ? (
                  <div className="p-2 flex flex-col gap-2">
                    <Menu.Item>
                      {({ active }) => (
                        <span
                          className={`block px-3 py-2 rounded ${
                            active ? "bg-gray-200 dark:bg-gray-700" : ""
                          }`}
                        >
                          {user.displayName || user.email}
                        </span>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`w-full text-left px-3 py-2 rounded ${
                            active ? "bg-gray-200 dark:bg-gray-700" : ""
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                ) : (
                  <div className="p-2 flex flex-col gap-2">
                    <button
                      onClick={loginWithGoogle}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <FaGoogle /> Login with Google
                    </button>
                  </div>
                )}
              </Menu.Items>
            </Menu>
          </nav>
        </div>

        <div className="absolute inset-0 pointer-events-none rounded shadow-neon-glow"></div>

        <style jsx>{`
          .shadow-neon-glow {
            box-shadow: 0 0 25px #ff00ff44, 0 0 40px #00ffff44 inset;
          }

          .text-glow {
            color: #ffffff;
            text-shadow: 0 0 2px #ff77ff88, 0 0 4px #77ccff88, 0 0 6px #ff77ff44;
          }

          .text-glow:hover {
            text-shadow: 0 0 4px #ff77ffaa, 0 0 8px #77ccffaa, 0 0 12px #ff77ff88;
          }

          .animate-pulse {
            animation: pulse 3s ease-in-out infinite;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.4;
            }
          }

          .logo-glow {
            filter: drop-shadow(0 0 6px #00ffff) drop-shadow(0 0 12px #ff00ff);
            animation: logoPulse 3s ease-in-out infinite;
          }

          @keyframes logoPulse {
            0%,
            100% {
              filter: drop-shadow(0 0 6px #00ffff)
                drop-shadow(0 0 12px #ff00ff);
            }
            50% {
              filter: drop-shadow(0 0 12px #00ffff)
                drop-shadow(0 0 20px #ff00ff);
            }
          }
        `}</style>
      </header>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Please log in to access Favorites
            </h2>
            <button
              onClick={() => {
                loginWithGoogle();
                setShowLoginPrompt(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <FaGoogle /> Login with Google
            </button>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
