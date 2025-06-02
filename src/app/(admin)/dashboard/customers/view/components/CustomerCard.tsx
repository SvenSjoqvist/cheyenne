import { CustomerDetails } from '../types';
import Link from 'next/link';

interface CustomerCardProps {
  customer: CustomerDetails;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  // Extract numeric ID from Shopify Global ID
  const numericId = customer.id.split('/').pop();

  return (
    <div className="border-2 border-[#DADEE0] rounded-2xl p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-darker-grotesque font-semibold">
            {customer.firstName} {customer.lastName}
          </h2>
          <span className="text-sm text-gray-600">Customer #{numericId}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-darker-grotesque">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-darker-grotesque">{customer.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-darker-grotesque">{customer.createdAt}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="font-darker-grotesque">{customer.orders.length.toString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="font-darker-grotesque">
              {customer.totalSpent} {customer.orders[0]?.currency || 'USD'}
            </p>
          </div>
        </div>

        {customer.orders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-darker-grotesque font-semibold mb-3">Recent Orders</h3>
            <div className="space-y-2">
              {customer.orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Order #{order.name}</p>
                    <p className="text-sm">{order.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-darker-grotesque">
                      {order.totalPrice} {order.currency}
                    </p>
                    <Link 
                      href={`/dashboard/orders/view?id=${order.id}`}
                      className="px-3 py-1 bg-[#666DAF] text-white rounded-lg text-sm hover:bg-[#555A9F] transition-colors"
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 