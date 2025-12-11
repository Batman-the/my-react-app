// src/pages/FavoritesPage.js
import React, { useEffect, useState } from "react";
import games from "../data/games";
import GameCard from "../components/GameCard";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const { user, removeFavorite, fetchFavoritesRealtime, fetchRating, saveRating } = useAuth();
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredStars, setHoveredStars] = useState({});

  // Fetch favorites in real-time
  useEffect(() => {
    if (!user) {
      setFavoriteGames([]);
      setLoading(false);
      return;
    }
    const unsubscribeFav = fetchFavoritesRealtime((favIds) => {
      const favGames = games.filter((g) => favIds.includes(g.id));
      setFavoriteGames(favGames);
      setLoading(false);
    });
    return () => unsubscribeFav();
  }, [user, fetchFavoritesRealtime]);

  // Load user ratings
  useEffect(() => {
    favoriteGames.forEach(async (game) => {
      const r = await fetchRating(game.id);
      setUserRatings((prev) => ({ ...prev, [game.id]: r }));
    });
  }, [favoriteGames, fetchRating]);

  const handleRemove = async (gameId, gameName) => {
    if (!user) return;
    try {
      await removeFavorite(gameId);
      window.gtag?.("event", "remove_favorite", { event_category: "game", event_label: gameName });
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove favorite. Please try again.");
    }
  };

  const handleRating = async (gameId, gameName, value) => {
    if (!user) return alert("Please login to rate!");
    setUserRatings((prev) => ({ ...prev, [gameId]: value }));
    await saveRating(gameId, value);
    window.gtag?.("event", "rate_game", { event_category: "game", event_label: gameName, value });
  };

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Please login to see your favorite games.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Your Favorite Games</h1>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Fetching your favorites...</div>
      ) : favoriteGames.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No favorite games yet.</p>
          <Link
            to="/categories"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Browse Games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteGames.map((game, index) => {
            const rating = userRatings[game.id] || 0;
            const hovered = hoveredStars[game.id] || 0;

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative p-2 border rounded"
              >
                <GameCard
                  game={game}
                  onDownload={() =>
                    window.gtag?.("event", "download", {
                      event_category: "game",
                      event_label: game.name,
                    })
                  }
                />

                <button
                  onClick={() => handleRemove(game.id, game.name)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600 bg-white dark:bg-gray-800 rounded-full p-1 shadow"
                  title="Remove from favorites"
                >
                  ✕
                </button>

                <div className="flex justify-center mt-2 gap-1">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isFilled = (hovered || rating) >= val;
                    return (
                      <span
                        key={val}
                        onClick={() => handleRating(game.id, game.name, val)}
                        onMouseEnter={() =>
                          setHoveredStars((prev) => ({ ...prev, [game.id]: val }))
                        }
                        onMouseLeave={() =>
                          setHoveredStars((prev) => ({ ...prev, [game.id]: 0 }))
                        }
                        className={`cursor-pointer text-2xl transition-colors ${
                          isFilled
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-500"
                        }`}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your rating: {rating}/5
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
