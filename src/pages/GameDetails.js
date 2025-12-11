// src/pages/GameDetails.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast, Toaster } from "react-hot-toast";
import games from "../data/games";
import { useAuth } from "../contexts/AuthContext"; // Corrected import
import DirectAdLink from "../components/DirectAdLink";

const GameDetails = () => {
  const { name } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const decodedName = decodeURIComponent(name || "");
    const foundGame = games.find((g) => g.name === decodedName);
    setGame(foundGame);
  }, [name]);

  const {
    user,
    addFavorite,
    removeFavorite,
    fetchFavoritesRealtime,
    saveRating,
    fetchRating,
    submitReview,
    fetchReviewsRealtime,
  } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const [allMessages, setAllMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();
  const reviewRef = useRef(null);

  const similarGames = game
    ? games.filter((g) => g.genre === game.genre && g.name !== game.name)
    : [];

  // Check if a pending download exists (user came back from redirect)
useEffect(() => {
  const pending = sessionStorage.getItem("pendingDownload");
  if (pending && pending === game?.download) {
    sessionStorage.removeItem("pendingDownload");
    window.open(pending, "_blank"); // open the real download link
  }
}, [game]);


  // Fetch favorites realtime and set favorite status
  useEffect(() => {
    if (!user || !game || typeof fetchFavoritesRealtime !== "function") return;
    const unsubscribe = fetchFavoritesRealtime((favIds = []) => {
      try {
        setIsFavorite(favIds.includes(game.id));
      } catch (e) {
        setIsFavorite(false);
      }
    });
    return typeof unsubscribe === "function" ? unsubscribe : undefined;
  }, [user, game, fetchFavoritesRealtime]);

  // Fetch user's rating for this game
  useEffect(() => {
    if (!user || !game || typeof fetchRating !== "function") return;
    let mounted = true;
    const loadRating = async () => {
      try {
        const r = await fetchRating(game.id);
        if (mounted) setRating(r || 0);
      } catch {
        if (mounted) setRating(0);
      }
    };
    loadRating();
    return () => { mounted = false; };
  }, [user, game, fetchRating]);

  // Fetch reviews realtime and calculate averages
  useEffect(() => {
    if (!game || typeof fetchReviewsRealtime !== "function") return;
    const unsubscribe = fetchReviewsRealtime(game.id, (reviews = []) => {
      const safeReviews = Array.isArray(reviews) ? reviews : [];
      setAllMessages(safeReviews);

      const counts = {};
      let total = 0;
      safeReviews.forEach((r) => {
        const star = Number(r.rating) || 0;
        counts[star] = (counts[star] || 0) + 1;
        total += star;
      });
      const avg = safeReviews.length ? total / safeReviews.length : 0;
      setAverageRating(Number(avg).toFixed(1));
      setRatingCounts(counts);
    });
    return typeof unsubscribe === "function" ? unsubscribe : undefined;
  }, [game, fetchReviewsRealtime]);

  // Screenshots carousel auto rotate
  useEffect(() => {
    if (!game?.images || game.images.length <= 1) {
      setCurrentImageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === game.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [game]);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!user || !game) return toast.error("Please login to add favorites!");
    try {
      if (isFavorite) {
        await removeFavorite(game.id);
        toast("Removed from favorites ❤️");
      } else {
        await addFavorite(game.id);
        toast.success("Added to favorites ❤️");
      }
    } catch {
      toast.error("Could not update favorites. Try again.");
    }
  };

  // Handle rating click
  const handleRating = async (value) => {
    if (!user || !game) return toast.error("Please login to rate!");
    setRating(value);
    try {
      if (typeof saveRating === "function") {
        await saveRating(game.id, value);
      } else {
        const key = `local_rating_${game.id}`;
        localStorage.setItem(key, value);
      }
      setShowMessageBox(true);
      toast.success(`You rated this game ${value}★`);
      setTimeout(() => reviewRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch {
      toast.error("Unable to save rating.");
    }
  };

  // Submit review message
  const submitMessage = async () => {
    if (!user || !game) return toast.error("Please login to review!");
    if (!userMessage.trim()) return toast.error("Please write something!");

    try {
      if (typeof submitReview === "function") {
        await submitReview(game.id, userMessage, rating);
      } else {
        const fallback = {
          rating,
          message: userMessage,
          userName: user.displayName || (user.email ? user.email.split("@")[0] : "Anonymous"),
          createdAt: new Date().toISOString(),
        };
        setAllMessages((prev) => [fallback, ...prev]);
      }
      setUserMessage("");
      setShowMessageBox(false);
      toast.success("Review submitted successfully!");
    } catch (e) {
      console.error("Failed to submit review:", e);
      toast.error(e.message || "Failed to submit review.");
    }
  };

  // Carousel navigation handlers
  const prevImage = () => {
    if (!game?.images || game.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? game.images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    if (!game?.images || game.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === game.images.length - 1 ? 0 : prev + 1));
  };

  // NEW: Handle Download - save link and redirect to /redirect
  const handleDownload = (link) => {
    if (!link) return toast.error("Download link not available");
    sessionStorage.setItem("pendingDownload", link);
    window.location.href = "/redirect";
  };

  if (!game) {
    return (
      <div className="p-8 text-center text-gray-900 dark:text-white">
        <h2 className="text-xl font-bold">Game Not Found</h2>
        <p className="mt-2">The game you requested doesn't exist or the URL is invalid.</p>
        <Link to="/" className="text-blue-500 underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-900 dark:text-white space-y-10">
      <Toaster position="top-right" />

      <Helmet>
        <title>{game.name} - GameHub</title>
        <meta name="description" content={String(game.desc || "").substring(0, 160)} />
      </Helmet>

      <motion.div>
        <img
          src={game.img}
          alt={game.name}
          className="w-full rounded shadow object-cover max-h-[400px]"
        />
      </motion.div>

      <motion.div className="space-y-4">
        <h1 className="text-3xl font-bold">{game.name}</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{game.genre}</p>
          <button
            onClick={toggleFavorite}
            className={`text-xl ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            Avg: <strong>{averageRating || "0.0"}</strong>/5
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300">{game.desc}</p>

        {/* --- Game Details --- */}
        <div>
          <h2 className="font-semibold mb-1">Gameplay & Features:</h2>
          {game.details ? (
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {String(game.details)
                .split(". ")
                .map((sentence, i) => sentence.trim() && <li key={i}>{sentence.trim()}.</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">Not specified</p>
          )}
        </div>

        {/* --- System Requirements --- */}
        <div>
          <h2 className="font-semibold">System Requirements:</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {game.systemRequirements || "Not specified"}
          </p>
        </div>

        {/* --- Time to Beat --- */}
        <div>
          <h2 className="font-semibold">Time to Beat:</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {game.timeToBeat || "Not specified"}
          </p>
        </div>

        {/* --- Screenshots Carousel --- */}
        {game.images && game.images.length > 0 && (
          <div className="relative mt-4">
            <img
              src={game.images[currentImageIndex]}
              alt={`${game.name} screenshot ${currentImageIndex + 1}`}
              className="w-full rounded shadow object-cover max-h-[400px]"
            />
            {game.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70"
                  aria-label="Previous screenshot"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70"
                  aria-label="Next screenshot"
                >
                  ▶
                </button>
              </>
            )}
          </div>
        )}

        {/* DOWNLOAD BUTTON */}
      {game.download && (
  <div className="flex justify-center mt-4">
    <DirectAdLink
      gameId={game.id}
      gameName={game.name}
      adZoneId="10120280"
      downloadUrl={game.download}
      isDownloadButton={true}
      className="download-btn inline-block px-6 py-3 mt-4 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-105 dark:bg-blue-500 dark:hover:bg-blue-400"
    >
      🎮 Download Now
    </DirectAdLink>
  </div>
)}

        {/* ---------- Similar Games Carousel ---------- */}
        {similarGames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="pt-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">
              Similar Games
            </h2>

            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById("similar-carousel");
                  container.scrollBy({ left: -240, behavior: "smooth" });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 dark:bg-white/30 text-white dark:text-black p-2 rounded-full hover:bg-black/60 hover:dark:bg-white/50 transition-colors"
                aria-label="Scroll Left"
              >
                ◀
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById("similar-carousel");
                  container.scrollBy({ left: 240, behavior: "smooth" });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 dark:bg-white/30 text-white dark:text-black p-2 rounded-full hover:bg-black/60 hover:dark:bg-white/50 transition-colors"
                aria-label="Scroll Right"
              >
                ▶
              </button>

              {/* Scroll Container */}
              <div
                id="similar-carousel"
                className="flex gap-4 overflow-x-auto scroll-smooth px-4 py-2 hide-scrollbar"
              >
                {similarGames.map((sg) => (
                  <motion.div
                    key={sg.name}
                    whileHover={{ scale: 1.05, y: -4 }}
                    onClick={() => navigate(`/game/${encodeURIComponent(sg.name)}`)}
                    className="min-w-[180px] cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 transition-all"
                  >
                    <img
                      src={sg.img}
                      alt={sg.name}
                      className="w-full h-36 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {sg.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{sg.genre}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Rating stars */}
        <motion.div className="border-t pt-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-3 text-center">Rate this Game</h2>

          {/* Rating Stars */}
          <div className="flex gap-2 justify-center mb-2">
            {[1, 2, 3, 4, 5].map((val) => {
              const isFilled = (hovered || rating) >= val;
              const ratingLabels = { 1: "Terrible", 2: "Bad", 3: "Okay", 4: "Good", 5: "Amazing" };
              return (
                <motion.div key={val} className="relative">
                  <AnimatePresence>
                    {hovered === val && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: -24 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-black text-white text-xs z-10 pointer-events-none"
                      >
                        {ratingLabels[val]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.span
                    onClick={() => handleRating(val)}
                    onMouseEnter={() => setHovered(val)}
                    onMouseLeave={() => setHovered(0)}
                    className={`cursor-pointer text-4xl md:text-5xl transition-colors duration-300 ${
                      isFilled
                        ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.6)]"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* Rating display */}
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Your rating: {rating}/5
          </p>

          {/* Rating breakdown bars */}
          <div className="mt-6 max-w-md mx-auto space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star] || 0;
              const total = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
              const percent = total ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-10">{star}★</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-3 rounded">
                    <div className="bg-yellow-400 h-3 rounded" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Reviews Section */}
          <div ref={reviewRef} className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-center">User Reviews</h2>

            {/* Button to show review box */}
            {!showMessageBox && user && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowMessageBox(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
                >
                  Write a Review
                </button>
              </div>
            )}

            {/* Message if not logged in */}
            {!user && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Please login to rate or write a review.
              </p>
            )}

            {/* Review input box */}
            {showMessageBox && (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Write your review..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  rows="4"
                />
                <button
                  onClick={submitMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  disabled={!userMessage.trim()}
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Render Reviews */}
            <div className="space-y-2">
              {allMessages.length === 0 && !user && (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No reviews yet. Login to be the first!
                </p>
              )}
              {allMessages.length === 0 && user && (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review this game!
                </p>
              )}

              {allMessages.map((msg, i) => {
                let createdAt;
                if (msg.createdAt?.toDate) createdAt = msg.createdAt.toDate();
                else if (msg.createdAt) createdAt = new Date(msg.createdAt);
                else createdAt = new Date();

                const displayName =
                  msg.userName || (msg.email ? msg.email.split("@")[0] : null) || "Anonymous";

                return (
                  <div
                    key={i}
                    className="p-3 border rounded dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{displayName}</span>
                      <span className="text-yellow-400">{msg.rating}★</span>
                    </div>
                    <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{msg.message}</p>
                    <span className="text-xs text-gray-400">
                      {createdAt.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameDetails;
