const fs = require("fs");
const path = require("path");
const games = require("./src/data/games").default || require("./src/data/games");

const BASE_URL = "https://gamehub-5beb8.web.app";

const urls = [
  `${BASE_URL}/`,
  `${BASE_URL}/categories`,
  `${BASE_URL}/home`,
  `${BASE_URL}/about`,
  `${BASE_URL}/favorites`,
  `${BASE_URL}/account`,
];

// Add a URL for each game
games.forEach(game => {
  urls.push(`${BASE_URL}/game/${encodeURIComponent(game.name)}`);
});

// Build sitemap.xml content
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("")}
</urlset>
`;

// Write sitemap.xml to public folder
fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), sitemap.trim());
console.log("✅ sitemap.xml generated in public folder!");
