import { Suspense } from "react";
import { getCancelledOrders } from "@/app/lib/shopify/admin/shopify-admin";
import DataTable from "@/app/components/admin/DataTable";
import { CancellationData } from "@/app/components/admin/types";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CancellationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = typeof params.cursor === "string" ? params.cursor : undefined;
  const searchQuery = typeof params.search === "string" ? params.search : "";
  const dateFilter = typeof params.date === "string" ? params.date : "";

  const { orders, pageInfo } = await getCancelledOrders(
    10,
    cursor,
    searchQuery,
    dateFilter
  );

  // Transform the data to match CancellationData type
  const transformedData = orders.map((order) => ({
    node: {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      currency: order.currency,
      createdAt: new Date(order.createdAt),
      status: order.status,
    } as CancellationData,
  }));

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">
            Cancellations
          </h1>
          <form
            action="/dashboard/cancellations"
            method="GET"
            className="flex gap-2"
          >
            <input
              type="text"
              name="search"
              placeholder="Search cancellations"
              defaultValue={searchQuery}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="date"
              defaultValue={dateFilter}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
            {(searchQuery || dateFilter) && (
              <a
                href="/dashboard/cancellations"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear
              </a>
            )}
          </form>
        </div>

        <Suspense fallback={<div>Loading cancellations...</div>}>
          <DataTable
            data={transformedData}
            hasNextPage={pageInfo.hasNextPage}
            endCursor={pageInfo.endCursor}
            baseUrl="/dashboard/cancellations"
            type="cancellations"
            hideActions={true}
          />
        </Suspense>
      </div>
    </div>
  );
}
