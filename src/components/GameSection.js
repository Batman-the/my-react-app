// src/components/GameSection.js
import React, { useState } from "react";
import GameCard from "./GameCard";
import { motion } from "framer-motion";

const GameSection = ({ title, games, itemsPerPage = 10 }) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const visibleGames = games.slice(0, visibleCount);

  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* 🏷️ Section Title */}
      <motion.h2
        className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>

      {/* 🎮 Game Grid */}
      {visibleGames.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No games found.</p>
      ) : (
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
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.4 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 👇 Load More Button */}
      {visibleCount < games.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + itemsPerPage, games.length))
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Load More
          </button>
        </div>
      )}
    </motion.section>
  );
};

export default GameSection;
