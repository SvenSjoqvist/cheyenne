import { getCustomers } from '@/app/lib/shopify/admin/shopify-admin';
import DataTable from '@/app/components/admin/DataTable';
import { CustomerData } from '@/app/components/admin/types';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = typeof params.cursor === 'string' ? params.cursor : undefined;
  const data = await getCustomers(10, cursor);
  const { customers } = data;

  // Transform to match exactly what DataTable needs
  const transformedData = customers.edges.map(edge => ({
    node: {
      id: edge.node.id,
      firstName: edge.node.firstName || '',
      lastName: edge.node.lastName || '',
      email: edge.node.email || '',
      phone: edge.node.phone || '-',
      orders: edge.node.orders
    } as CustomerData
  }));

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Customers</h1>
        </div>
        <DataTable 
          data={transformedData}
          hasNextPage={customers.pageInfo.hasNextPage}
          endCursor={customers.pageInfo.endCursor}
          baseUrl="/dashboard/customers"
          type="customers"
        />
      </div>
    </div>
  );
}