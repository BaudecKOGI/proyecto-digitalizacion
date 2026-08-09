import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Desplazar hacia arriba suavemente al cambiar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      if (startPage > 2) {
        pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${index}`} className="px-3 py-1 text-[#111928] text-[15px] font-sans">
            ...
          </span>
        );
      }
      
      const isActive = page === currentPage;
      
      return (
        <button
          key={`page-${page}`}
          onClick={() => handlePageChange(page)}
          className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded border transition-colors font-sans text-[14px] md:text-[15px] ${
            isActive 
              ? 'bg-[#4F46E5] text-white border-[#4F46E5]' 
              : 'bg-white text-[#111928] border-line hover:border-[#111928] hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 mt-12 mb-8">
      {/* Primera Página */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded border font-sans text-[16px] transition-colors ${
          currentPage === 1
            ? 'bg-gray-50 text-muted border-line/50 cursor-not-allowed'
            : 'bg-white text-[#111928] border-line hover:border-[#111928] hover:bg-gray-50'
        }`}
      >
        &laquo;
      </button>
      
      {/* Página Anterior */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded border font-sans text-[16px] transition-colors ${
          currentPage === 1
            ? 'bg-gray-50 text-muted border-line/50 cursor-not-allowed'
            : 'bg-white text-[#111928] border-line hover:border-[#111928] hover:bg-gray-50'
        }`}
      >
        &lsaquo;
      </button>

      {/* Números */}
      <div className="flex items-center gap-1 md:gap-2 mx-1 md:mx-2">
        {renderPageNumbers()}
      </div>

      {/* Página Siguiente */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded border font-sans text-[16px] transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-50 text-muted border-line/50 cursor-not-allowed'
            : 'bg-white text-[#111928] border-line hover:border-[#111928] hover:bg-gray-50'
        }`}
      >
        &rsaquo;
      </button>
      
      {/* Última Página */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded border font-sans text-[16px] transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-50 text-muted border-line/50 cursor-not-allowed'
            : 'bg-white text-[#111928] border-line hover:border-[#111928] hover:bg-gray-50'
        }`}
      >
        &raquo;
      </button>
    </div>
  );
}
