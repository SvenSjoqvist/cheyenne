import { getDashboardData, getSalesData, getMonthlyRevenueData } from "@/app/lib/actions/dashboard";
import { getOrderStatusBreakdown } from "@/app/lib/shopify/admin/shopify-admin";
import PieChart from "@/app/components/admin/PieChart";
import WorldMap from "@/app/components/admin/WorldMap";
import DashboardError from "@/app/components/admin/DashboardError";
import DashboardWrapper from "@/app/components/admin/DashboardWrapper";

export default async function DashboardPage() {
  // Fetch all required dashboard data server-side
  const dashboardRes = await getDashboardData();
  const salesRes = await getSalesData();
  const monthlyRevenueRes = await getMonthlyRevenueData();
  const orderStatusBreakdown = await getOrderStatusBreakdown();

  if (!dashboardRes.success || !salesRes.success || !monthlyRevenueRes.success) {
    return (
      <DashboardError error={dashboardRes.error || salesRes.error || monthlyRevenueRes.error || "Failed to fetch dashboard data"} onRetry={async () => {}} />
    );
  }

  // Extract numbers from shop.shop (strings)
  const totalOrders = Number(dashboardRes.data.countryOrders.totalOrders ?? dashboardRes.data.shop?.totalOrders ?? 0);
  const totalProducts = Number(dashboardRes.data.shop?.totalProducts ?? 0);
  const todaysOrders = salesRes.data.todaysOrders;
  const awaitingShipment = orderStatusBreakdown.fulfillmentStatusCounts["Awaiting shipment"] || 0;

  // Merge all data into a single object for the client
  const data = {
    ...dashboardRes.data,
    sales: salesRes.data,
    monthlyRevenue: monthlyRevenueRes.data,
    totalOrders,
    totalProducts,
    todaysOrders,
    awaitingShipment,
  };

  return (
    <div className="p-9.5 bg-white">
      <h1 className="text-[40px] font-regular text-center font-darker-grotesque mt-8 mb-6 tracking-wider">
        Overview
      </h1>

      <div className="bg-white p-8 rounded-2xl border-2 border-[#DADEE0] mb-2">
        <div className="flex flex-wrap gap-18 px-6">
          <div className="flex flex-col items-start -space-y-2">
            <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
              {data.totalOrders}
            </p>
            <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
              Total Orders
            </p>
          </div>
          <div className="flex flex-col items-start -space-y-2">
            <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
              {data.totalProducts}
            </p>
            <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
              Total Product Count
            </p>
          </div>
          <div className="flex flex-col items-start -space-y-2">
            <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
              {data.todaysOrders}
            </p>
            <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
              Today&apos;s Orders
            </p>
          </div>
          <div className="flex flex-col items-start -space-y-2">
            <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
              {data.returns.pendingReturns}
            </p>
            <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
              Pending Returns
            </p>
          </div>
          <div className="flex flex-col items-start -space-y-2">
            <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
              {data.awaitingShipment}
            </p>
            <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
              Awaiting Shipment
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
        <div className="bg-white rounded-2xl shadow border-2 border-[#DADEE0] h-full hidden lg:block">
          <h2 className="text-[36px] font-semibold font-darker-grotesque text-[#212121] ml-10 mt-5 mb-[-0.5rem]">
            World Map
          </h2>
          <p className="text-[20px] text-gray-500 font-darker-grotesque ml-10 mb-2">
            The top regions for orders
          </p>
          <WorldMap countryData={data.countryOrders.countries} />
        </div>

        <div className="flex flex-col gap-1.5 h-full">
          <div className="bg-white p-6 rounded-2xl border-2 border-[#DADEE0]">
            <div className="flex flex-wrap gap-4 sm:gap-11 px-4 mb-2">
              <div className="flex flex-col items-start">
                <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
                  Active Users
                </p>
                <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
                  {data.marketing.subscribersCount}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
                  Abandoned Carts
                </p>
                <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
                  {data.abandonedCarts}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[20px] font-regular text-[#212121] font-darker-grotesque tracking-wider">
                  Average Cart Value
                </p>
                <p className="text-[26px] font-semibold font-darker-grotesque tracking-wider">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: data.averageCartValue.currency,
                  }).format(data.averageCartValue.amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white pt-6 px-4 sm:pl-10 rounded-2xl border-2 border-[#DADEE0] flex-1 pb-16">
            <h2 className="text-[36px] font-semibold font-darker-grotesque text-[#212121] tracking-wider leading-10">
              Analytics
            </h2>
            <p className="text-[20px] font-regular font-darker-grotesque tracking-wider mb-6">
              Of the last 14 days.
            </p>
            <PieChart data={data.orderStatus.chartData} />
          </div>
        </div>
      </div>

      {/* Quick Actions (client) */}
      <DashboardWrapper data={data} />
    </div>
  );
}
