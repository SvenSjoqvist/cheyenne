'use server';

import { fetchAbandonedCarts, getAverageCartValue, getOrderStatusBreakdown, getOrdersByCountry, getDashboardStats, getOrders } from '@/app/lib/shopify/admin/shopify-admin';
import { getSubscribers } from '@/app/lib/prisma';
import { getReturns } from '@/app/lib/actions/returns';
import { formatCurrency } from '@/app/lib/utils';

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

export async function getSalesData() {
  try {
    // Get all orders to calculate revenue
    const orders = await getOrders(250); // Get up to 250 orders
    
    // Calculate total revenue
    const totalRevenue = orders.edges.reduce((sum, edge) => {
      const amount = parseFloat(edge.node.totalPriceSet.shopMoney.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // Calculate today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysRevenue = orders.edges.reduce((sum, edge) => {
      const orderDate = new Date(edge.node.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      
      if (orderDate.getTime() === today.getTime()) {
        const amount = parseFloat(edge.node.totalPriceSet.shopMoney.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }
      return sum;
    }, 0);

    // Get total orders count
    const totalOrders = orders.edges.length;

    // Get currency from first order (assuming all orders use same currency)
    const currency = orders.edges[0]?.node.totalPriceSet.shopMoney.currencyCode || 'USD';

    return {
      success: true,
      data: {
        totalRevenue: {
          amount: totalRevenue,
          formatted: formatCurrency(totalRevenue, currency)
        },
        todaysRevenue: {
          amount: todaysRevenue,
          formatted: formatCurrency(todaysRevenue, currency)
        },
        totalOrders: totalOrders,
        currency: currency
      }
    };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return {
      success: false,
      error: 'Failed to fetch sales data',
      data: {
        totalRevenue: { amount: 0, formatted: '$0.00' },
        todaysRevenue: { amount: 0, formatted: '$0.00' },
        totalOrders: 0,
        currency: 'USD'
      }
    };
  }
}

export async function getMonthlyRevenueData() {
  try {
    // Get all orders to calculate monthly revenue
    const orders = await getOrders(250); // Get up to 250 orders
    
    // Create an object to store monthly revenue for the current year
    const monthlyRevenue: { [key: string]: number } = {};
    
    // Initialize all months for the current year (January to December) with 0
    const currentYear = new Date().getFullYear();
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      monthlyRevenue[monthKey] = 0;
    }
    
    // Calculate revenue for each month
    orders.edges.forEach(edge => {
      const orderDate = new Date(edge.node.createdAt);
      const orderYear = orderDate.getFullYear();
      const monthKey = orderDate.toISOString().slice(0, 7); // YYYY-MM format
      const amount = parseFloat(edge.node.totalPriceSet.shopMoney.amount);
      
      // Only include orders from the current year
      if (orderYear === currentYear && monthlyRevenue.hasOwnProperty(monthKey)) {
        monthlyRevenue[monthKey] += isNaN(amount) ? 0 : amount;
      }
    });

    // Convert to array format for chart and ensure proper chronological order
    const chartData = [
      { month: `${currentYear}-01`, revenue: monthlyRevenue[`${currentYear}-01`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-01`] || 0, 'USD') },
      { month: `${currentYear}-02`, revenue: monthlyRevenue[`${currentYear}-02`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-02`] || 0, 'USD') },
      { month: `${currentYear}-03`, revenue: monthlyRevenue[`${currentYear}-03`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-03`] || 0, 'USD') },
      { month: `${currentYear}-04`, revenue: monthlyRevenue[`${currentYear}-04`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-04`] || 0, 'USD') },
      { month: `${currentYear}-05`, revenue: monthlyRevenue[`${currentYear}-05`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-05`] || 0, 'USD') },
      { month: `${currentYear}-06`, revenue: monthlyRevenue[`${currentYear}-06`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-06`] || 0, 'USD') },
      { month: `${currentYear}-07`, revenue: monthlyRevenue[`${currentYear}-07`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-07`] || 0, 'USD') },
      { month: `${currentYear}-08`, revenue: monthlyRevenue[`${currentYear}-08`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-08`] || 0, 'USD') },
      { month: `${currentYear}-09`, revenue: monthlyRevenue[`${currentYear}-09`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-09`] || 0, 'USD') },
      { month: `${currentYear}-10`, revenue: monthlyRevenue[`${currentYear}-10`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-10`] || 0, 'USD') },
      { month: `${currentYear}-11`, revenue: monthlyRevenue[`${currentYear}-11`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-11`] || 0, 'USD') },
      { month: `${currentYear}-12`, revenue: monthlyRevenue[`${currentYear}-12`] || 0, formattedRevenue: formatCurrency(monthlyRevenue[`${currentYear}-12`] || 0, 'USD') }
    ];

    return {
      success: true,
      data: chartData
    };
  } catch (error) {
    console.error('Error fetching monthly revenue data:', error);
    return {
      success: false,
      error: 'Failed to fetch monthly revenue data',
      data: []
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