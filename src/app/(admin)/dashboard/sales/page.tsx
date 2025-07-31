"use client";

import SalesCard from "@/app/components/admin/ui/SalesCard";
import MonthlyRevenueChart from "@/app/components/admin/ui/MonthlyRevenueChart";
import { useDashboard } from "@/app/components/admin/DashboardContext";
import { exportSalesDataToCSV } from "@/app/lib/utils/csvExport";

export default function Sales() {
  const { data, loading, error, refreshData } = useDashboard();

  // Function to extract number from formatted currency string
  const extractNumber = (formattedValue: string): number => {
    return parseFloat(formattedValue.replace(/[^0-9.-]+/g, ''));
  };

  // Function to format numbers with k/m suffixes
  const formatNumber = (num: number, addCurrency = false): string => {
    const prefix = addCurrency ? '$' : '';
    
    if (num >= 1000000) {
      const formatted = (num / 1000000).toFixed(1);
      return prefix + (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'm';
    }
    if (num >= 1000) {
      const formatted = (num / 1000).toFixed(1);
      return prefix + (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'k';
    }
    return prefix + Math.round(num).toString();
  };

  // Format currency values by extracting number and reformatting
  const formatCurrency = (formattedValue: string): string => {
    const numericValue = extractNumber(formattedValue);
    return formatNumber(numericValue, true);
  };

  // Calculate daily average (total revenue divided by number of days estimated from months)
  const calculateDailyAverage = (): string => {
    if (data.monthlyRevenue.length === 0) return '$0';
    const totalRevenue = data.sales.totalRevenue.amount;
    const monthsWithData = data.monthlyRevenue.length;
    const estimatedDays = monthsWithData * 30; // Rough estimate
    const dailyAvg = totalRevenue / estimatedDays;
    return formatNumber(dailyAvg, true);
  };

  // Calculate monthly average from monthlyRevenue data
  const calculateMonthlyAverage = (): string => {
    if (data.monthlyRevenue.length === 0) return '$0';
    const totalMonthlyRevenue = data.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
    const monthlyAvg = totalMonthlyRevenue / data.monthlyRevenue.length;
    return formatNumber(monthlyAvg, true);
  };

  const handleExportCSV = () => {
    exportSalesDataToCSV(
      data.monthlyRevenue,
      data.sales.totalRevenue.formatted,
      data.sales.todaysRevenue.formatted,
      data.sales.totalOrders
    );
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading sales data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-9">
        <div className="flex flex-col gap-4 justify-center items-center mb-9">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Sales</h1>
        </div>
        
        {/* Sales Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full mb-8">
          <SalesCard title="Total Revenue" value={formatCurrency(data.sales.totalRevenue.formatted)} />
          <SalesCard title="Monthly Average" value={calculateMonthlyAverage()} />
          <SalesCard title="Daily Average" value={calculateDailyAverage()} />
          <SalesCard title="Today's Revenue" value={formatCurrency(data.sales.todaysRevenue.formatted)} />
          <SalesCard title="Total Orders" value={formatNumber(data.sales.totalOrders)} />
        </div>

        {/* Monthly Revenue Chart */}
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[26px] font-semibold font-darker-grotesque text-[#212121] tracking-wider">
              Total Revenue
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-3xl border-2 border-[#DADEE0] p-3">
          <div className="w-full h-[400px]">
            <MonthlyRevenueChart data={data.monthlyRevenue} />
          </div>
        </div>
        <div className="flex justify-center items-center mt-8 mb-12">
        <button
              onClick={handleExportCSV}
              className="px-8 py-2 bg-[#212121] text-white rounded-lg hover:bg-[#333333] cursor-pointer transition-colors font-darker-grotesque font-medium text-[20px]"
            >
              Export CSV
            </button>
        </div>
      </div>
    </div>
  );
}   