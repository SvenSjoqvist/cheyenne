import { getOrders } from '@/app/lib/shopify/admin/shopify-admin';
import OrdersTable from '@/app/components/admin/orders/OrdersTable';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = typeof params.cursor === 'string' ? params.cursor : undefined;
  const { orders } = await getOrders(10, cursor);
  console.log('Orders data:', JSON.stringify(orders, null, 2));

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Orders</h1>
        </div>

            <OrdersTable 
              orders={orders.edges}
              hasNextPage={orders.pageInfo.hasNextPage}
              endCursor={orders.pageInfo.endCursor}
            />
      </div>
    </div>
  );
}