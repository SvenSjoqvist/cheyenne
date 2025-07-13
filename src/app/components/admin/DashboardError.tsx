"use client";

import DashboardRefreshButton from "./DashboardRefreshButton";

interface DashboardErrorProps {
  error: string;
  onRetry: () => Promise<void>;
}

export default function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <DashboardRefreshButton onRefresh={onRetry} />
      </div>
    </div>
  );
} 