// src/pages/CategoriesPage.js
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import games from "../data/games";
import GameCard from "../components/GameCard";
import AdBanner from "../components/AdBanner"; // ✅ Reuse the shared AdBanner component
import axios from "axios";

// ✅ Dynamic Trending Sidebar
const TrendingSidebar = () => {
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const RAWG_API_KEY = "YOUR_RAWG_API_KEY"; // 🔑 Replace with your RAWG API key

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        const res = await axios.get(
          `https://api.rawg.io/api/games/lists/main?key=${RAWG_API_KEY}&ordering=-added&page_size=6`
        );

        const gamesData = res.data.results.map((g) => ({
          id: g.id,
          name: g.name,
          img: g.background_image,
          genre: g.genres.map((gen) => gen.name).join(", "),
          desc: g.slug,
          rating: g.rating,
          downloads: 0,
          trending: true,
        }));

        setTrendingGames(gamesData);
      } catch (err) {
        console.error("Failed to fetch trending games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Loading trending games...
      </p>
    );

  return (
    <aside className="hidden lg:block lg:w-80 sticky top-20 self-start">
      <h2 className="text-xl font-bold mb-4">🔥 Trending Games</h2>
      <div className="space-y-4">
        {trendingGames.map((game) => (
          <GameCard key={game.id} game={game} small />
        ))}
      </div>

      {/* ✅ One ad in the sidebar */}
      <div className="mt-6">
        <AdBanner />
      </div>
    </aside>
  );
};

const CategoriesPage = () => {
  const [search, setSearch] = useState(() => sessionStorage.getItem("search") || "");
  const [selectedGenre, setSelectedGenre] = useState(() => sessionStorage.getItem("genre") || "All");
  const [topRatedOnly, setTopRatedOnly] = useState(() => sessionStorage.getItem("topRatedOnly") === "true");
  const [sortOrder, setSortOrder] = useState(() => sessionStorage.getItem("sortOrder") || "default");
  const [visibleCount, setVisibleCount] = useState(9);
  const [shuffledGames, setShuffledGames] = useState([]);

  // Shuffle & cache games
  useEffect(() => {
    if (sessionStorage.getItem("shuffledGames")) {
      setShuffledGames(JSON.parse(sessionStorage.getItem("shuffledGames")));
    } else {
      const shuffled = [...games].sort(() => Math.random() - 0.5);
      setShuffledGames(shuffled);
      sessionStorage.setItem("shuffledGames", JSON.stringify(shuffled));
    }
  }, []);

  // Persist filters
  useEffect(() => {
    sessionStorage.setItem("search", search);
    sessionStorage.setItem("genre", selectedGenre);
    sessionStorage.setItem("topRatedOnly", topRatedOnly);
    sessionStorage.setItem("sortOrder", sortOrder);
  }, [search, selectedGenre, topRatedOnly, sortOrder]);

  const genres = ["All", ...new Set(shuffledGames.flatMap(g => g.genre.split(", ").map(s => s.trim())))];

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
        <title>GameHub - Browse Free PC Games by Categories</title>
        <meta
          name="description"
          content="Browse free PC games by category, genre, and rating. Find top-rated and trending games on GameHub."
        />
      </Helmet>

      {/* Main Section */}
      <main className="lg:col-span-3">
        <h1 className="text-2xl font-bold text-center mb-6">
          Browse by Categories
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(9);
            }}
            className="px-4 py-2 border rounded w-64 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setVisibleCount(9);
            }}
            className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {genres.map((genre, i) => (
              <option key={i} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm dark:text-gray-300">
            <input
              type="checkbox"
              checked={topRatedOnly}
              onChange={() => {
                setTopRatedOnly(!topRatedOnly);
                setVisibleCount(9);
              }}
            />
            Only Rated 4+
          </label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setVisibleCount(9);
            }}
            className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="default">Sort by: Default</option>
            <option value="high">Rating: High to Low</option>
            <option value="low">Rating: Low to High</option>
          </select>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentGames.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No games found.
            </p>
          ) : (
            currentGames.map((game, i) => <GameCard key={i} game={game} />)
          )}
        </div>

        {/* Load More */}
        {visibleCount < sortedGames.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}

        {/* ✅ One ad at the bottom */}
        <div className="mt-6">
          <AdBanner />
        </div>
      </main>

      {/* Sidebar */}
      <TrendingSidebar />
    </div>
  );
};

export default CategoriesPage;
