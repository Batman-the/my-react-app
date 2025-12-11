import { useState, useEffect } from "react";
import axios from "axios";
import games from "../data/games";
import GameCard from "../components/GameCard";
import AdBanner from "../components/AdBanner";

// Simple fuzzy match: returns true if two strings are "similar enough"
const isSimilar = (a, b) => {
  const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalize(a).includes(normalize(b)) || normalize(b).includes(normalize(a));
};

const TrendingSidebar = () => {
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const RAWG_API_KEY = "36b2ae3af5d045cfa6c761e31d247f54";

  useEffect(() => {
    const cached = sessionStorage.getItem("trendingGames");
    if (cached) {
      setTrendingGames(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          `https://api.rawg.io/api/games/lists/main?key=${RAWG_API_KEY}&ordering=-added&page_size=20`
        );

        const localGames = games.map(g => g.name);

        // Filter RAWG results by fuzzy match
        const filteredGames = res.data.results
          .filter(rawgGame =>
            localGames.some(localName => isSimilar(localName, rawgGame.name))
          )
          .slice(0, 6)
          .map(g => ({
            name: g.name,
            img: g.background_image,
            genre: g.genres.map(gen => gen.name).join(", "),
            desc: g.slug,
            downloads: 0,
            rating: g.rating,
            trending: true,
          }));

        // If RAWG returned nothing, fallback to top local games
        const finalTrending = filteredGames.length ? filteredGames :
          [...games].sort((a, b) => (b.downloads + b.rating * 10) - (a.downloads + a.rating * 10)).slice(0,6);

        setTrendingGames(finalTrending);
        sessionStorage.setItem("trendingGames", JSON.stringify(finalTrending));
      } catch (err) {
        console.error("Failed to fetch trending games:", err);

        // Fallback to local top games
        const fallback = [...games].sort((a, b) => (b.downloads + b.rating * 10) - (a.downloads + a.rating * 10)).slice(0,6);
        setTrendingGames(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading trending games...</p>;

  return (
    <aside className="hidden lg:block lg:w-80 sticky top-20 self-start">
      <h2 className="text-xl font-bold mb-4">🔥 Trending Games</h2>
      <div className="space-y-4">
        {trendingGames.map(game => (
          <div key={game.name} className="relative">
            <GameCard game={game} small />
            {game.trending && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">
                🔥
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        
        <AdBanner zoneId="10071135" />
      </div>
    </aside>
  );
};

export default TrendingSidebar;
