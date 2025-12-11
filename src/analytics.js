// src/analytics.js

export const GA_MEASUREMENT_ID = "G-2JJK8FNTLS"; // your GA4 ID

// ✅ Safe wrapper to track pageviews
export const pageview = (url) => {
  if (typeof window.safeGtag === "function") {
    window.safeGtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  } else {
    console.warn("safeGtag not available yet for pageview:", url);
  }
};

// ✅ Safe wrapper to track custom events
export const event = ({ action, category, label, value }) => {
  if (typeof window.safeGtag === "function") {
    window.safeGtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.warn("safeGtag not available yet for event:", action);
  }
};

// ✅ Example pre-built GameHub events
export const trackDownload = (gameName) =>
  event({
    action: "game_download",
    category: "Games",
    label: gameName,
  });

export const trackFavorite = (gameName, added = true) =>
  event({
    action: added ? "favorite_added" : "favorite_removed",
    category: "Games",
    label: gameName,
  });

export const trackSearch = (query) =>
  event({
    action: "search",
    category: "Search",
    label: query,
  });

export const trackDarkModeToggle = (enabled) =>
  event({
    action: "toggle_dark_mode",
    category: "UI",
    label: enabled ? "enabled" : "disabled",
  });
