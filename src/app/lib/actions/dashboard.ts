'use server';

import { fetchAbandonedCarts, getAverageCartValue, getOrderStatusBreakdown, getOrdersByCountry, getDashboardStats } from '@/app/lib/shopify/admin/shopify-admin';
import { getSubscribers } from '@/app/lib/prisma';
import { getReturns } from '@/app/lib/actions/returns';

export async function getAbandonedCartsCount() {
  try {
    const count = await fetchAbandonedCarts();
    return { success: true, count };
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return { success: false, error: 'Failed to fetch abandoned carts', count: 0 };
  }
}

export async function getAverageCartValueData() {
  try {
    const averageCartValue = await getAverageCartValue();
    return { success: true, ...averageCartValue };
  } catch (error) {
    console.error('Error fetching average cart value:', error);
    return { success: false, error: 'Failed to fetch average cart value', amount: 0, currency: 'USD' };
  }
}

export async function getMarketingData() {
  try {
    const subscribers = await getSubscribers();
    return { 
      success: true, 
      subscribersCount: subscribers.length,
      subscribers: subscribers
    };
  } catch (error) {
    console.error('Error fetching marketing data:', error);
    return { 
      success: false, 
      error: 'Failed to fetch marketing data', 
      subscribersCount: 0,
      subscribers: []
    };
  }
}

export async function getReturnsData() {
  try {
    const returns = await getReturns();
    const pendingReturns = returns.filter(r => r.status === 'PENDING').length;
    return { 
      success: true, 
      totalReturns: returns.length,
      pendingReturns,
      data: returns 
    };
  } catch (error) {
    console.error('Error fetching returns data:', error);
    return { 
      success: false, 
      error: 'Failed to fetch returns data', 
      totalReturns: 0,
      pendingReturns: 0,
      data: [] 
    };
  }
}

export async function getOrderStatusData() {
  try {
    const orderStatusBreakdown = await getOrderStatusBreakdown();
    return { 
      success: true, 
      ...orderStatusBreakdown
    };
  } catch (error) {
    console.error('Error fetching order status data:', error);
    return { 
      success: false, 
      error: 'Failed to fetch order status data',
      chartData: []
    };
  }
}

export async function getDashboardData() {
  try {
    const [
      abandonedCartsResult, 
      averageCartValueResult, 
      marketingResult, 
      returnsResult, 
      orderStatusResult,
      countryOrdersResult,
      shopStats
    ] = await Promise.all([
      getAbandonedCartsCount(),
      getAverageCartValueData(),
      getMarketingData(),
      getReturnsData(),
      getOrderStatusData(),
      getOrdersByCountry(),
      getDashboardStats()
    ]);

    return {
      success: true,
      data: {
        abandonedCarts: abandonedCartsResult.count,
        averageCartValue: {
          amount: averageCartValueResult.amount,
          currency: averageCartValueResult.currency
        },
        marketing: {
          subscribersCount: marketingResult.subscribersCount,
          subscribers: marketingResult.subscribers
        },
        returns: {
          totalReturns: returnsResult.totalReturns,
          pendingReturns: returnsResult.pendingReturns
        },
        orderStatus: {
          chartData: orderStatusResult.chartData || []
        },
        countryOrders: {
          countries: countryOrdersResult.countries || [],
          totalOrders: countryOrdersResult.totalOrders || 0
        },
        shop: shopStats.shop,
        helpTickets: 0 // This will need to be implemented when we have a help ticket system
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      error: 'Failed to fetch dashboard data',
      data: {
        abandonedCarts: 0,
        averageCartValue: { amount: 0, currency: 'USD' },
        marketing: { subscribersCount: 0, subscribers: [] },
        returns: { totalReturns: 0, pendingReturns: 0 },
        orderStatus: { chartData: [] },
        countryOrders: { countries: [], totalOrders: 0 },
        shop: { name: '', totalOrders: '0', totalProducts: '0', totalCustomers: '0' },
        helpTickets: 0
      }
    };
  }
}

export { getOrderStatusBreakdown }; 