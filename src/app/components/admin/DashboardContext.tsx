"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getDashboardData, getOrderStatusBreakdown, getSalesData, getMonthlyRevenueData } from '@/app/lib/actions/dashboard';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface CountryOrderData {
  countryCode: string;
  orderCount: number;
}

interface DashboardData {
  abandonedCarts: number;
  averageCartValue: { amount: number; currency: string };
  totalOrders: number;
  todaysOrders: number;
  totalProducts: number;
  helpTickets: number;
  refundRequests: number;
  awaitingShipment: number;
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
    chartData: PieChartData[];
  };
  countryOrders: {
    countries: CountryOrderData[];
    totalOrders: number;
  };
  shop?: {
    name: string;
    totalOrders: string;
    totalProducts: string;
    totalCustomers: string;
  };
}

interface DashboardContextType {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>({
    abandonedCarts: 0,
    averageCartValue: { amount: 0, currency: 'USD' },
    totalOrders: 0,
    todaysOrders: 0,
    totalProducts: 0,
    helpTickets: 0,
    refundRequests: 0, 
    awaitingShipment: 0,
    sales: {
      totalRevenue: { amount: 0, formatted: '$0.00' },
      todaysRevenue: { amount: 0, formatted: '$0.00' },
      totalOrders: 0,
      todaysOrders: 0,
      currency: 'USD'
    },
    monthlyRevenue: [],
    marketing: {
      subscribersCount: 0
    },
    returns: {
      totalReturns: 0,
      pendingReturns: 0
    },
    orderStatus: {
      chartData: []
    },
    countryOrders: {
      countries: [],
      totalOrders: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [result, salesResult, monthlyRevenueResult] = await Promise.all([
        getDashboardData(),
        getSalesData(),
        getMonthlyRevenueData()
      ]);
      
      if (result.success && salesResult.success && monthlyRevenueResult.success) {
        // Get order status breakdown for awaiting shipment count
        const orderStatusResult = await getOrderStatusBreakdown();
        
        setData(prev => ({
          ...prev,
          abandonedCarts: result.data.abandonedCarts,
          averageCartValue: result.data.averageCartValue,
          marketing: result.data.marketing,
          returns: result.data.returns,
          orderStatus: result.data.orderStatus,
          countryOrders: result.data.countryOrders || { countries: [], totalOrders: 0 },
          sales: salesResult.data,
          monthlyRevenue: monthlyRevenueResult.data,
          // Update static values with real data
          totalOrders: result.data.countryOrders.totalOrders,
          todaysOrders: salesResult.data.todaysOrders,
          totalProducts: parseInt(result.data.shop?.totalProducts || '0'),
          helpTickets: result.data.helpTickets || 0,
          awaitingShipment: orderStatusResult.fulfillmentStatusCounts["Awaiting shipment"] || 0
        }));
      } else {
        setError(result.error || salesResult.error || monthlyRevenueResult.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    data,
    loading,
    error,
    refreshData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 