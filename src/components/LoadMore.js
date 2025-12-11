import React from "react";

const LoadMore = ({ hasMore, onLoadMore }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onLoadMore}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Load More
      </button>
    </div>
  );
};

export default LoadMore;
