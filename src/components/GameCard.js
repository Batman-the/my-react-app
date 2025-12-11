// src/components/GameCard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
// ------------------------------------------------------------------
// Import the ad-specific link component
import DirectAdLink from "./DirectAdLink";
// ------------------------------------------------------------------

/**
 * @param {object} game - The game object.
 * @param {boolean} [small=false] - If true, renders a compact card.
 * @param {boolean} [asAdLink=false] - If true, wraps the card in DirectAdLink for monetization.
 * @param {string} [adZoneId="10127706"] - The Monetag zone ID to use if asAdLink is true.
 * @param {boolean} [openInNewTab=false] - If true, open the redirect link in a new tab.
 */
const GameCard = ({
  game,
  small = false,
  asAdLink = false,
  adZoneId = "10127706",
  openInNewTab = false,
}) => {
  const { user, addFavorite, removeFavorite, fetchFavoritesRealtime } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    const unsubscribe = fetchFavoritesRealtime((favIds) => {
      setIsFavorite(favIds.includes(game.id));
    });
    return unsubscribe;
  }, [user, game.id, fetchFavoritesRealtime]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // prevent navigating when clicking heart
    if (!user) {
      alert("Please login to add favorites!");
      return;
    }

    if (isFavorite) {
      await removeFavorite(game.id);
    } else {
      await addFavorite(game.id);
    }
  };

  // ------------------------------------------------------------------
  // Card Content
  // ------------------------------------------------------------------
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: small ? 1 : 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`border rounded shadow-md relative bg-white hover:shadow-lg transition 
        dark:bg-gray-800 dark:text-white dark:border-gray-700 
        ${small ? "flex-1 p-2 items-center" : "p-4"}`}
    >
      {/* Favorite Button */}
      {!small && (
        <motion.button
          onClick={toggleFavorite}
          whileTap={{ scale: 1.3 }}
          className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-gray-900 shadow hover:scale-110 transition z-10"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={22}
            className={`transition ${
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </motion.button>
      )}

      {/* Game Image */}
      <motion.img
        src={game.img}
        alt={game.name}
        className={`${small ? "w-20 h-16 rounded" : "w-full h-40 rounded object-cover"}`}
        whileHover={!small ? { scale: 1.03 } : {}}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Game Info */}
      <div className={`${small ? "flex-1 flex flex-col justify-center" : ""}`}>
        <h2 className={`${small ? "text-sm font-semibold truncate" : "text-lg font-bold mt-2"}`}>
          {game.name}
        </h2>
        {!small && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-300">{game.genre}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{game.desc}</p>
          </>
        )}
      </div>
    </motion.div>
  );

  // ------------------------------------------------------------------
  // If asAdLink = true, wrap in DirectAdLink (monetized click)
  // ------------------------------------------------------------------
  if (asAdLink && game.download) {
    return (
      <DirectAdLink
        gameId={game.id}
        gameName={game.name} // For correct redirect
        adZoneId={adZoneId}
        downloadUrl={game.download} // pass actual download URL here!
        className={`block ${small ? "flex gap-3 h-20" : ""}`}
        openInNewTab={openInNewTab} // New prop to open redirect in new tab
      >
        {CardContent}
      </DirectAdLink>
    );
  }

  // ------------------------------------------------------------------
  // Default link (no ads)
  // ------------------------------------------------------------------
  return (
    <Link
      to={`/game/${encodeURIComponent(game.name)}`}
      className={`block ${small ? "flex gap-3 h-20" : ""}`}
    >
      {CardContent}
    </Link>
  );
};

export default GameCard;
