"use client";

import { useState } from "react";
import { revalidateProducts } from "@/app/lib/actions/cache";
import { signOut } from "next-auth/react";

interface DashboardData {
  abandonedCarts: number;
  averageCartValue: { amount: number; currency: string };
  totalOrders: number;
  todaysOrders: number;
  totalProducts: number;
  awaitingShipment: number;
  marketing: {
    subscribersCount: number;
    subscribers?: Array<{
      id: string;
      email: string;
      unsubscribeToken: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
  returns: {
    totalReturns: number;
    pendingReturns: number;
  };
  orderStatus: {
    chartData: Array<{
      label: string;
      value: number;
      color: string;
    }>;
  };
  countryOrders: {
    countries: Array<{
      countryCode: string;
      orderCount: number;
    }>;
    totalOrders: number;
  };
  sales: {
    totalRevenue: { amount: number; formatted: string };
    todaysRevenue: { amount: number; formatted: string };
    totalOrders: number;
    todaysOrders: number;
    currency: string;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    formattedRevenue: string;
  }>;
}

interface DashboardClientProps {
  data: DashboardData;
  onRefresh: () => Promise<void>;
}

export default function DashboardClient({ onRefresh }: DashboardClientProps) {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);

  const handleRevalidateProducts = async () => {
    try {
      setIsRevalidating(true);
      await revalidateProducts();
      // Refresh dashboard data after revalidation
      await onRefresh();
      setShowQuickActions(false);
    } catch (error) {
      console.error("Failed to revalidate products:", error);
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="mt-4 relative flex justify-center">
      {showQuickActions && (
        <div className="absolute bottom-full mb-2 bg-[#212121] rounded-lg shadow-lg border border-gray-200 p-2 w-38 transform transition-all duration-200 ease-in-out">
          <button
            className="w-full text-center px-4 py-2 hover:opacity-80 rounded-md cursor-pointer text-white font-darker-grotesque whitespace-nowrap font-medium"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            Log out
          </button>
          <button
            onClick={handleRevalidateProducts}
            disabled={isRevalidating}
            className="w-full text-center px-4 py-2 hover:opacity-80 cursor-pointer rounded-md text-white font-darker-grotesque whitespace-nowrap font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRevalidating ? "Revalidating..." : "Revalidate Products"}
          </button>
        </div>
      )}
      <button
        onClick={() => setShowQuickActions(!showQuickActions)}
        className="w-38 cursor-pointer px-6 py-2.5 bg-[#212121] text-white font-semibold rounded-lg transition-colors font-darker-grotesque text-lg flex items-center justify-center gap-2"
      >
        Quick Actions
      </button>
    </div>
  );
} 