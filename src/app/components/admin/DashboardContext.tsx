"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getDashboardData, getOrderStatusBreakdown } from '@/app/lib/actions/dashboard';

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
  totalProducts: number;
  helpTickets: number;
  refundRequests: number;
  awaitingShipment: number;
  marketing: {
    subscribersCount: number;
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
    totalProducts: 0,
    helpTickets: 0,
    refundRequests: 0, 
    awaitingShipment: 0,   
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
      
      const result = await getDashboardData();
      
      if (result.success) {
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
          // Update static values with real data
          totalOrders: result.data.countryOrders.totalOrders,
          totalProducts: parseInt(result.data.shop?.totalProducts || '0'),
          helpTickets: result.data.helpTickets || 0,
          awaitingShipment: orderStatusResult.fulfillmentStatusCounts["Awaiting shipment"] || 0
        }));
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
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