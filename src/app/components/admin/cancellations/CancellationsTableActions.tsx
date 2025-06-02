"use client";

import { useRouter } from "next/navigation";

type CancellationsTableActionsProps = {
  selectedCount: number;
  maxSelection: number;
  hasNextPage: boolean;
  onLoadMore: () => void;
};

export default function CancellationsTableActions({
  selectedCount,
  maxSelection,
  hasNextPage,
  onLoadMore,
}: CancellationsTableActionsProps) {
  const router = useRouter();
  const hasSelectedCancellations = selectedCount > 0;

  const handleViewSelected = () => {
    router.push('/dashboard/cancellations/view');
  };

  return (
    <div className="mt-6 flex justify-end gap-4 items-center">
      {hasSelectedCancellations && (
        <span className="text-sm text-gray-600">
          {selectedCount} of {maxSelection} cancellations selected
        </span>
      )}
      {hasNextPage && (
        <button
          onClick={onLoadMore}
          className="inline-flex items-center px-4 py-2 border-2 border-black rounded-xl text-sm font-medium text-black bg-white hover:bg-black hover:text-white transition-colors duration-200 font-darker-grotesque"
        >
          Load More
        </button>
      )}
      <button
        onClick={handleViewSelected}
        disabled={!hasSelectedCancellations}
        className={`inline-flex items-center px-4 py-2 border-2 border-black rounded-xl text-sm font-medium transition-colors duration-200 font-darker-grotesque ${
          hasSelectedCancellations 
            ? 'text-black bg-white hover:bg-black hover:text-white cursor-pointer' 
            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
        }`}
      >
        View Selected
      </button>
    </div>
  );
} 