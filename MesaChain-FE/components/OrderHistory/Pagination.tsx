'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-1 p-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:border-[#F4A340] hover:text-[#F4A340] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
      >
        
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
            currentPage === page
              ? 'bg-[#F4A340] text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-[#F4A340] hover:text-[#F4A340]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:border-[#F4A340] hover:text-[#F4A340] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
      >
        
      </button>
    </div>
  );
} 