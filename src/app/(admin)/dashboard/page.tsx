"use client";

import { useDashboard } from '@/app/components/admin/DashboardContext';
import PieChart from '@/app/components/admin/PieChart';
import WorldMap from '@/app/components/admin/WorldMap';
import { useState } from 'react';


export default function DashboardPage() {
  const { data, loading, error, refreshData } = useDashboard();
  const [showQuickActions, setShowQuickActions] = useState(false);
  console.log(data);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
    <div className="p-9.5 bg-white">
      <h1 className="text-[40px] font-regular text-center font-darker-grotesque mt-8 mb-6 tracking-wider">Overview</h1>

      <div className="bg-white p-8 rounded-2xl border-2 border-[#DADEE0] mb-2">
        <div className="flex flex-wrap gap-18 px-6">
            <div className="flex flex-col items-start -space-y-2">
              <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">{data.totalOrders}</p>
              <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Total Orders</p>
            </div>
            <div className="flex flex-col items-start -space-y-2">
              <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">{data.totalProducts}</p>
              <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Total Product Count</p>
            </div>
            <div className="flex flex-col items-start -space-y-2">
              <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">{data.helpTickets}</p>
              <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Help Tickets</p>
            </div>
            <div className="flex flex-col items-start -space-y-2">
              <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">{data.returns.pendingReturns}</p> 
              <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Pending Returns</p>
            </div>
            <div className="flex flex-col items-start -space-y-2">
              <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">{data.awaitingShipment}</p>
              <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Awaiting Shipment</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
        <div className="bg-white rounded-2xl shadow border-2 border-[#DADEE0] h-full hidden lg:block">
          <h2 className="text-[36px] font-semibold font-darker-grotesque text-[#212121] ml-10 mt-5 mb-[-0.5rem]">World Map</h2>
          <p className="text-[20px] text-gray-500 font-darker-grotesque ml-10 mb-2">The top regions for orders</p>
          <WorldMap countryData={data.countryOrders.countries} />
        </div>

        <div className="flex flex-col gap-1.5 h-full">
          <div className="bg-white p-6 rounded-2xl border-2 border-[#DADEE0]">
            <div className="flex flex-wrap gap-4 sm:gap-11 px-4 mb-2">
              <div className="flex flex-col items-start">
                <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Active Users</p>
                <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">{data.marketing.subscribersCount}</p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Abandoned Carts</p>
                <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">{data.abandonedCarts}</p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">Average Cart Value</p>
                <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">${data.averageCartValue.amount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white pt-6 px-4 sm:pl-10 rounded-2xl border-2 border-[#DADEE0] flex-1 pb-16">
            <h2 className="text-[36px] font-semibold font-darker-grotesque text-[#212121] tracking-wider leading-10">Analytics</h2>
            <p className="text-[20px] font-regular font-darker-grotesque tracking-wider mb-6">Of the last 14 days.</p>
            <PieChart 
              data={data.orderStatus.chartData}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 relative flex justify-center">
        {showQuickActions && (
          <div className="absolute bottom-full mb-2 bg-[#212121] rounded-lg shadow-lg border border-gray-200 p-2 w-38 transform transition-all duration-200 ease-in-out">
            <button className="w-full text-center px-4 py-2 hover:opacity-80 rounded-md cursor-pointer text-white font-darker-grotesque whitespace-nowrap font-medium">
              New Product
            </button>
            <button className="w-full text-center px-4 py-2 hover:opacity-80 rounded-md cursor-pointer text-white font-darker-grotesque whitespace-nowrap font-medium">
              New Newsletter
            </button>
            <button className="w-full text-center px-4 py-2 hover:opacity-80 cursor-pointer rounded-md text-white font-darker-grotesque whitespace-nowrap font-medium">
              Fulfill Order
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
    </div>
  );
}