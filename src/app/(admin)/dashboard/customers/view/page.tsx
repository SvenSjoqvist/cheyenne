import { getCustomers, getOrders } from '@/app/lib/shopify/admin/shopify-admin';
import { CustomerCard } from './components/CustomerCard';
import { CustomerDetails } from './types';

async function getCustomerDetails(ids: string[]): Promise<CustomerDetails[]> {
  if (ids.length === 0) return [];

  const data = await getCustomers(ids.length, undefined, ids);
  const customerNodes = data.customers.edges.map(edge => edge.node);
  
  const customerDetails = await Promise.all(
    customerNodes.map(async (customer) => {
      const ordersData = await getOrders(10, undefined, customer.id);
      const orders = ordersData.orders.edges.map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        createdAt: edge.node.createdAt,
        totalPrice: edge.node.totalPriceSet.shopMoney.amount,
        currency: edge.node.totalPriceSet.shopMoney.currencyCode
      }));

      // Extract numeric ID from Shopify Global ID
      const numericId = customer.id.split('/').pop() || customer.id;

      return {
        id: numericId,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '-',
        createdAt: customer.createdAt,
        orders,
        totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0)
      };
    })
  );

  return customerDetails;
}

export default async function CustomerViewPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const params = await searchParams;
  const ids = params.ids?.split(',') || [];
  const customers = await getCustomerDetails(ids);

  return (
    <div className="p-9">
      <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular mt-8 justify-center flex items-center">
        Selected Customers
      </h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}