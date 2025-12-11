import React, { useState, useEffect } from "react";
import games from "../data/games";
import GameCard from "../components/GameCard";
import TrendingSidebar from "../components/TrendingSidebar";

const RAWG_API_KEY = "YOUR_RAWG_API_KEY"; // 🔑 Replace with your RAWG API key

const TopGamesPage = () => {
  const [activeTab, setActiveTab] = useState("topRated");
  const [visibleCount, setVisibleCount] = useState(12);
  const [trendingGames, setTrendingGames] = useState([]);

  const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");

  // Fetch trending games from RAWG
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/lists/popular?key=${RAWG_API_KEY}&page_size=10`
        );
        const data = await response.json();
        if (data.results) {
          // Map RAWG results to our local format (minimal)
          const rawgTrending = data.results.map((g) => ({
            name: g.name,
            img: g.background_image,
            genre: g.genres.map((x) => x.name).join(", "),
            trending: true,
            rating: Math.round(g.rating),
          }));
          setTrendingGames(rawgTrending);
        }
      } catch (err) {
        console.error("Failed to fetch trending games:", err);
      }
    };
    fetchTrending();
  }, []);

  // Merge local games with trending flag from API
  const allGames = [...games];
  trendingGames.forEach((tg) => {
    const idx = allGames.findIndex((g) => g.name === tg.name);
    if (idx !== -1) {
      allGames[idx].trending = true;
      allGames[idx].rating = tg.rating;
    } else {
      allGames.push(tg); // add new trending games not in local data
    }
  });

  // Tabs
  const topRatedGames = [...allGames]
    .filter((g) => (ratings[g.name] || g.rating || 0) >= 4)
    .sort((a, b) => (ratings[b.name] || b.rating || 0) - (ratings[a.name] || a.rating || 0));

  const mostDownloadedGames = [...allGames].sort((a, b) => b.downloads - a.downloads);

  const recentlyAddedGames = [...allGames].sort(
    (a, b) => new Date(b.addedDate) - new Date(a.addedDate)
  );

  const displayedGames =
    activeTab === "topRated"
      ? topRatedGames
      : activeTab === "mostDownloaded"
      ? mostDownloadedGames
      : recentlyAddedGames;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6 text-gray-900 dark:text-white">
      {/* Main Section */}
      <main className="lg:col-span-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-blue-600 dark:text-blue-400">
          🎮 Top Games on GameHub
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-3 flex-wrap">
          {[
            { key: "topRated", label: "⭐ Top Rated" },
            { key: "mostDownloaded", label: "🔥 Most Downloaded" },
            { key: "recentlyAdded", label: "🕒 Recently Added" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setVisibleCount(12);
              }}
              className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        {displayedGames.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No games found in this section.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayedGames.slice(0, visibleCount).map((game, i) => (
              <GameCard key={i} game={game} />
            ))}
          </div>
        )}

        {/* Load More */}
        {visibleCount < displayedGames.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* Sidebar */}
      <TrendingSidebar trendingGames={trendingGames.length ? trendingGames : allGames.filter(g => g.trending)} />
    </div>
  );
};

export default TopGamesPage;
