"use client";

import { useRouter } from "next/navigation";
import DashboardClient from "./DashboardClient";

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

interface DashboardWrapperProps {
  data: DashboardData;
}

export default function DashboardWrapper({ data }: DashboardWrapperProps) {
  const router = useRouter();

  const handleRefresh = async () => {
    router.refresh();
  };

  return <DashboardClient data={data} onRefresh={handleRefresh} />;
} 