import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // hide if only one page

  const pageNumbers = [];
  // for (let i = 1; i <= totalPages; i++) {
  //   pageNumbers.push(i);
  // }
  const delta = 2
  pageNumbers.push(1);
  for (let i = currentPage - delta; i < currentPage; i++) {
    if (i > 1) pageNumbers.push(i);
  }
  if (currentPage !== 1 && currentPage !== totalPages) pageNumbers.push(currentPage);
  
  for (let i = currentPage + 1; i <= currentPage + delta; i++) {
    if (i < totalPages) pageNumbers.push(i);
  }
  if (totalPages !== 1) pageNumbers.push(totalPages);

  const uniquePages = [...new Set(pageNumbers)].sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous */}
      <button
        className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary-50 text-primary-600 hover:bg-primary-100"
        }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {/* {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
            num === currentPage
              ? "bg-primary-600 text-black shadow-md"
              : "bg-primary-50 text-primary-600 hover:bg-primary-100"
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))} */}

      {uniquePages.map((num, index) => {
        // Add ellipsis if gap is more than 1
        if (index > 0 && num - uniquePages[index - 1] > 1) {
          return (
            <React.Fragment key={num}>
              <span className="px-2">...</span>
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
            num === currentPage
              ? "bg-primary-600 text-black shadow-md"
              : "bg-primary-50 text-primary-600 hover:bg-primary-100"
          }`}
              >
                {num}
              </button>
            </React.Fragment>
          );
        }

        return (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
            num === currentPage
              ? "bg-primary-600 text-black shadow-md"
              : "bg-primary-50 text-primary-600 hover:bg-primary-100"
          }`}
          >
            {num}
          </button>
        );
      })}

      {/* Next */}
      <button
        className={`px-4 py-2 rounded-full border border-gray-300 font-medium transition-colors duration-200 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary-50 text-primary-600 hover:bg-primary-100"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
