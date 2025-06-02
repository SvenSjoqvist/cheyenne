
interface PageChangerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PageChanger({ currentPage, totalPages, onPageChange }: PageChangerProps) {

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl border-2 ${
            currentPage === i
              ? 'border-black bg-black text-white'
              : 'border-[#DADEE0] bg-white text-[#212121] hover:border-black'
          } font-darker-grotesque text-lg transition-colors duration-200`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-xl border-2 ${
          currentPage === 1
            ? 'border-[#DADEE0] text-[#DADEE0] cursor-not-allowed'
            : 'border-black text-black hover:bg-black hover:text-white'
        } font-darker-grotesque text-lg transition-colors duration-200`}
      >
        ←
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-xl border-2 ${
          currentPage === totalPages
            ? 'border-[#DADEE0] text-[#DADEE0] cursor-not-allowed'
            : 'border-black text-black hover:bg-black hover:text-white'
        } font-darker-grotesque text-lg transition-colors duration-200`}
      >
        →
      </button>
    </div>
  );
} 