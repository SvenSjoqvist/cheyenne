import { getOrders } from '@/app/lib/shopify/admin/shopify-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/app/lib/utils';
import { ShopifyOrder } from '@/app/lib/shopify/types';

// Use Next.js's expected type - searchParams is always a Promise
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrdersPage({
  searchParams,
}: PageProps) {
  // Always await searchParams since Next.js provides it as a Promise
  const params = await searchParams;
  
  const cursor = typeof params.cursor === 'string' ? params.cursor : null;
  const data = await getOrders(cursor);
  const { orders } = data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.edges.map(({ node: order }: { node: ShopifyOrder }) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{order.name}</p>
                  <p className="text-sm text-gray-500">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{order.customer?.email}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(order.totalPriceSet.shopMoney.amount, order.totalPriceSet.shopMoney.currencyCode)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.displayFulfillmentStatus}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.displayFinancialStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {orders.pageInfo.hasNextPage && (
            <div className="mt-6 text-center">
              <a
                href={`/dashboard/orders?cursor=${encodeURIComponent(orders.pageInfo.endCursor)}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Load More
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}