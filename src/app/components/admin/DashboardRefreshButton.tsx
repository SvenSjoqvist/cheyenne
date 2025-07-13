"use client";

interface DashboardRefreshButtonProps {
  onRefresh: () => Promise<void>;
}

export default function DashboardRefreshButton({ onRefresh }: DashboardRefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Retry
    </button>
  );
} 