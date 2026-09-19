import React, { useState } from "react";

function PaginationComp() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 10;
  const pageNumbers = [];

  // storing all page numbers to an array
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  console.log(pageNumbers);

  // handle page change
  function handlePageChange(page) {
    setCurrentPage(page);
  }

  return (
    <div>
      <div>{currentPage}</div>
      <div className="pagination-wrapper">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationComp;
