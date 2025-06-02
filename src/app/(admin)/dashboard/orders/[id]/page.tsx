import { getOrder } from '@/app/lib/shopify/admin/shopify-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/app/lib/utils';
import Link from 'next/link';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  // Convert numeric ID to Shopify Global ID format
  const shopifyId = `gid://shopify/Order/${id}`;
  const order = await getOrder(shopifyId);

  if (!order) {
    return (
      <div className="pt-20 bg-[#F7F7F7] min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 justify-center items-center mb-10">
            <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Order Not Found</h1>
            <Link 
              href="/dashboard/orders"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Order #{order.name.replace('#', '')}</h1>
          <Link 
            href="/dashboard/orders"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{order.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toISOString().split('T')[0]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">
                    {formatCurrency(order.totalPriceSet.shopMoney.amount, order.totalPriceSet.shopMoney.currencyCode)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fulfillment Status</p>
                  <p className="font-medium">{order.displayFulfillmentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Financial Status</p>
                  <p className="font-medium">{order.displayFinancialStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.customer?.email}</p>
                </div>
                {order.customer?.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{order.customer.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {order.shippingAddress.address1}
                      {order.shippingAddress.address2 && <>, {order.shippingAddress.address2}</>}
                    </p>
                    <p className="font-medium">
                      {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                    </p>
                    <p className="font-medium">{order.shippingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {order.billingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {order.billingAddress.address1}
                      {order.billingAddress.address2 && <>, {order.billingAddress.address2}</>}
                    </p>
                    <p className="font-medium">
                      {order.billingAddress.city}, {order.billingAddress.province} {order.billingAddress.zip}
                    </p>
                    <p className="font-medium">{order.billingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 