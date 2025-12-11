// src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import games from "../data/games";
import GameCard from "../components/GameCard";
import DirectAdLink from "../components/DirectAdLink";

// Monetag Native Banner Ad Component
const NativeBannerAd = () => {
  useEffect(() => {
    if (!document.querySelector('script[data-zone="10127705"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.monetago.com/tag.js"; // Confirm Monetag URL
      script.async = true;
      script.setAttribute("data-zone", "10127705");
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className="native-banner-ad my-6"
      style={{ minHeight: "100px", textAlign: "center" }}
      aria-hidden="true"
    >
      <p className="text-gray-500 dark:text-gray-400 text-sm select-none">
        Advertisement
      </p>
    </div>
  );
};

// Trending Sidebar (local trending games)
const TrendingSidebar = () => {
  const [trendingGames, setTrendingGames] = useState([]);

  useEffect(() => {
    const cached = sessionStorage.getItem("trendingGames");
    if (cached) {
      setTrendingGames(JSON.parse(cached));
      return;
    }

    let topGames = [...games]
      .sort((a, b) => b.downloads + b.rating * 10 - (a.downloads + a.rating * 10))
      .slice(0, 6)
      .map((game) => ({ ...game, trending: true }));

    if (topGames.length === 0) {
      topGames = games.slice(0, 6).map((game) => ({ ...game, trending: true }));
    }

    setTrendingGames(topGames);
    sessionStorage.setItem("trendingGames", JSON.stringify(topGames));
  }, []);

  if (!trendingGames.length) {
    return (
      <p className="text-gray-500 dark:text-gray-400">Loading trending games...</p>
    );
  }

  return (
    <aside className="hidden lg:block lg:w-80 sticky top-20 self-start">
      <h2 className="text-xl font-bold mb-4">🔥 Trending Games</h2>
      <div className="space-y-4">
        {trendingGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            small
            asAdLink={true}
            adZoneId="10120281" // Sidebar ad zone
            openInNewTab={false} // Sidebar games open normally, no new tab
          />
        ))}
      </div>
      {/* Optional: Add a smaller ad banner here */}
      <NativeBannerAd />
    </aside>
  );
};

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [visibleCount, setVisibleCount] = useState(9);
  const [shuffledGames, setShuffledGames] = useState([]);

  useEffect(() => {
    const shuffled = [...games].sort(() => Math.random() - 0.5);
    setShuffledGames(shuffled);
  }, []);

  const genres = [
    "All",
    ...new Set(
      shuffledGames.flatMap((g) => g.genre.split(", ").map((s) => s.trim()))
    ),
  ];

  const getUserRatings = () => JSON.parse(localStorage.getItem("ratings") || "{}");

  const filteredGames = shuffledGames.filter((game) => {
    const matchSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchGenre = selectedGenre === "All" || game.genre.includes(selectedGenre);
    const ratings = getUserRatings();
    const userRating = ratings[game.name] || 0;
    const matchRating = !topRatedOnly || userRating >= 4;
    return matchSearch && matchGenre && matchRating;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    const ratings = getUserRatings();
    const ratingA = ratings[a.name] || 0;
    const ratingB = ratings[b.name] || 0;
    if (sortOrder === "high") return ratingB - ratingA;
    if (sortOrder === "low") return ratingA - ratingB;
    return 0;
  });

  const currentGames = sortedGames.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6 text-gray-900 dark:text-white">
      <Helmet>
        <title>GameHub - Browse Free PC Games</title>
        <meta
          name="description"
          content="Browse free PC games by category, genre, and rating. Find top-rated and trending games on GameHub."
        />
      </Helmet>

      {/* Main content */}
      <main className="lg:col-span-3">
        <h1 className="text-2xl font-bold text-center mb-6">Browse by Categories</h1>

        {/* Filters */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap gap-4 items-center justify-center mb-6"
          role="search"
          aria-label="Search and filter games"
        >
          <input
            type="search"
            placeholder="Search games..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(9);
            }}
            className="px-4 py-2 border rounded w-64 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-blue-500"
            aria-label="Search games"
          />
          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setVisibleCount(9);
            }}
            className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-blue-500"
            aria-label="Filter by genre"
          >
            {genres.map((genre, i) => (
              <option key={i} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <label
            className="flex items-center gap-2 text-sm dark:text-gray-300 select-none"
            htmlFor="topRatedOnly"
          >
            <input
              id="topRatedOnly"
              type="checkbox"
              checked={topRatedOnly}
              onChange={() => {
                setTopRatedOnly(!topRatedOnly);
                setVisibleCount(9);
              }}
              className="cursor-pointer"
            />
            Only Rated 4+
          </label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setVisibleCount(9);
            }}
            className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-blue-500"
            aria-label="Sort games"
          >
            <option value="default">Sort by: Default</option>
            <option value="high">Rating: High to Low</option>
            <option value="low">Rating: Low to High</option>
          </select>
        </form>

        {/* Monetag Native Banner Ad */}
        <NativeBannerAd />

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentGames.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No games found.
            </p>
          ) : (
            currentGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                asAdLink={true}
                adZoneId="10120280" // Main ad zone
                openInNewTab={true}  // NEW: Open redirect ad in new tab on homepage
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < sortedGames.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              aria-label="Load more games"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* Trending Sidebar */}
      <TrendingSidebar />
    </div>
  );
};

export default HomePage;
