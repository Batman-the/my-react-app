// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "./components/Header";
import CategoriesPage from "./pages/CategoriesPage";
import GameDetails from "./pages/GameDetails";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import FavoritesPage from "./pages/FavoritesPage";
import AccountPage from "./pages/AccountPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import TopGamesPage from "./pages/TopGamesPage";
import RedirectPage from "./pages/RedirectPage";
import AdScriptLoader from "./components/AdScriptLoader";

// Google Analytics ID
const GA_MEASUREMENT_ID = "G-2JJK8FNTLS";

/** ------------------ Google Analytics Setup ------------------ **/
const initializeGA = () => {
  if (!window.gtag) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  }
};

const logPageView = (url) => {
  if (window.gtag) {
    window.gtag("event", "page_view", { page_path: url });
  }
};

const logEvent = ({ action, category, label, value }) => {
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

/** ------------------ Page Animation Wrapper ------------------ **/
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.div>
);

/** ------------------ Animated Routes ------------------ **/
const AnimatedRoutes = ({ searchState, setSearchState }) => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics page tracking
    logPageView(location.pathname + location.search);

    // Reprocess Monetag ads on route change (SPA fix)
    if (window.Monetag && typeof window.Monetag.processAds === "function") {
      window.Monetag.processAds();
    }
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Helmet>
                <title>GameHub - Free PC Games Download</title>
                <meta
                  name="description"
                  content="Download trending, latest, and top-rated PC games for free on GameHub."
                />
              </Helmet>
              <HomePage />
            </PageWrapper>
          }
        />

        <Route
          path="/categories"
          element={
            <PageWrapper>
              <Helmet>
                <title>GameHub - Browse Free PC Games by Categories</title>
                <meta
                  name="description"
                  content="Browse free PC games by category, genre, and rating. Find top-rated and trending games on GameHub."
                />
              </Helmet>
              <CategoriesPage
                searchState={searchState}
                setSearchState={setSearchState}
              />
            </PageWrapper>
          }
        />

        <Route
          path="/top-games"
          element={
            <PageWrapper>
              <Helmet>
                <title>Top Rated PC Games - GameHub</title>
                <meta
                  name="description"
                  content="Explore the most highly rated PC games based on player feedback and reviews."
                />
              </Helmet>
              <TopGamesPage />
            </PageWrapper>
          }
        />

        <Route
          path="/game/:name"
          element={
            <PageWrapper>
              <GameDetails />
            </PageWrapper>
          }
        />

        <Route
          path="/redirect"
          element={
            <PageWrapper>
              <RedirectPage />
            </PageWrapper>
          }
        />

        <Route
          path="/favorites"
          element={
            <PageWrapper>
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            </PageWrapper>
          }
        />

        <Route
          path="/account"
          element={
            <PageWrapper>
              <AccountPage />
            </PageWrapper>
          }
        />

        <Route
          path="/about"
          element={
            <PageWrapper>
              <Helmet>
                <title>About GameHub</title>
              </Helmet>
              <AboutPage />
            </PageWrapper>
          }
        />

        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

/** ------------------ Main App Component ------------------ **/
function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");
  const [searchState, setSearchState] = useState(() => {
    const saved = localStorage.getItem("searchState");
    return saved ? JSON.parse(saved) : { query: "", results: [] };
  });

  useEffect(() => {
    initializeGA();
  }, []);

  // 🌑 Handle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", dark);
    logEvent({
      action: "toggle_dark_mode",
      category: "UI",
      label: dark ? "enabled" : "disabled",
    });
  }, [dark]);

  // 💾 Persist search state
  useEffect(() => {
    localStorage.setItem("searchState", JSON.stringify(searchState));
  }, [searchState]);

  // ⚡ Handle pending ad redirect → open download link after return
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingDownload");
    if (pending) {
      sessionStorage.removeItem("pendingDownload");
      window.open(pending, "_blank"); // open the actual download link
    }
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router basename="/">
          <ScrollToTop />

          {/* 🌐 Monetag Global Script Loader */}
          <AdScriptLoader zoneId="10127706" />

          <Header toggleDark={() => setDark(!dark)} isDark={dark} />
          <main className="bg-white text-gray-900 dark:bg-gray-950 dark:text-white min-h-screen pt-16">
            <AnimatedRoutes searchState={searchState} setSearchState={setSearchState} />
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
