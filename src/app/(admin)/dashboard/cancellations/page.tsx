import { Suspense } from "react";
import { getCancelledOrders } from "@/app/lib/shopify/admin/shopify-admin";
import DataTable from "@/app/components/admin/DataTable";
import { CancellationData } from "@/app/components/admin/types";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CancellationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = typeof params.cursor === 'string' ? params.cursor : undefined;
  const { orders, pageInfo } = await getCancelledOrders(
    10,
    cursor
  );

  // Transform the data to match CancellationData type
  const transformedData = orders.map(order => ({
    node: {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      currency: order.currency,
      createdAt: new Date(order.createdAt),
      status: order.status
    } as CancellationData
  }));

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Cancellations</h1>
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