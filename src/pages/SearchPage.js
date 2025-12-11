// src/pages/SearchPage.js
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import games from "../data/games";
import { motion } from "framer-motion";

// ✅ Monetag Ad Component
const AdBanner = ({ zoneId }) => (
  <div className="w-full flex justify-center my-6">
    <script async src={`https://a.monetag.com/ads.js`}></script>
    <ins
      className="monetag-ad"
      data-zone={zoneId}
      style={{ display: "block", width: "728px", height: "90px" }}
    ></ins>
  </div>
);

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [filteredGames, setFilteredGames] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9); // 👈 show 9 at first

  useEffect(() => {
    if (query) {
      const results = games.filter((game) =>
        [game.name, game.genre, game.desc]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredGames(results);
      setVisibleCount(9); // reset visible count when new search
    } else {
      setFilteredGames([]);
    }
  }, [query]);

  const visibleGames = filteredGames.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredGames.length;

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Search Results {query && `for "${query}"`}
      </h1>

      {filteredGames.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          {query
            ? "No matching games found."
            : "Type something in the search bar to find games."}
        </p>
      ) : (
        <>
          {/* 🎮 Game Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {visibleGames.map((game, i) => (
              <React.Fragment key={i}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <GameCard game={game} />
                </motion.div>

                {/* 💰 Insert ad every 6 games */}
                {(i + 1) % 6 === 0 && (
                  <div className="col-span-full">
                    <AdBanner zoneId="10071135" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* 🔽 Load More Button */}
          {canLoadMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default SearchPage;
