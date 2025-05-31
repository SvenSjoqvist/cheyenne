
import { getCustomers } from '@/app/lib/shopify/admin/shopify-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/app/lib/utils';
import { ShopifyCustomer } from '@/app/lib/shopify/types';

// Option 2: Always expect Promise (use if your Next.js version always provides Promise)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage({
  searchParams,
}: PageProps) {
  // Always await searchParams since it's a Promise
  const params = await searchParams;
  
  const cursor = typeof params.cursor === 'string' ? params.cursor : null;
  const data = await getCustomers(cursor);
  const { customers } = data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.edges.map(({ node }) => {
              const customer: ShopifyCustomer = {
                id: node.id,
                firstName: node.firstName,
                lastName: node.lastName,
                email: node.email,
                createdAt: node.createdAt,
                ordersCount: node.orders.edges.length.toString(),
                totalSpent: node.orders.edges.reduce((sum, { node: order }) => 
                  sum + parseFloat(order.totalPriceSet.shopMoney.amount), 0).toString()
              };
              
              return (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined: {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(customer.totalSpent, 'USD')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.ordersCount} orders
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {customers.pageInfo.hasNextPage && (
            <div className="mt-6 text-center">
              <a
                href={`/dashboard/customers?cursor=${encodeURIComponent(customers.pageInfo.endCursor)}`}
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