import React from "react";

const SortAndPagination = ({
  sortBy,
  setSortBy,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      {/* Sorting Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="name">Name (A–Z)</option>
          <option value="rating">Rating (High → Low)</option>
          <option value="date">Recently Added</option>
          <option value="downloads">Most Downloaded</option>
        </select>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SortAndPagination;
