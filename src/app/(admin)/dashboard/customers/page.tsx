import { getCustomers } from '@/app/lib/shopify/admin/shopify-admin';
import CustomersTable from './components/CustomersTable';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};


export default async function CustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = typeof params.cursor === 'string' ? params.cursor : undefined;
  const data = await getCustomers(10, cursor);
  const { customers } = data;

  return (
    <div className="p-9">
      <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular mt-8 justify-center flex items-center">
        Customers
      </h1>
      
      <CustomersTable 
        customers={customers.edges}
        hasNextPage={customers.pageInfo.hasNextPage}
        endCursor={customers.pageInfo.endCursor}
      />
    </div>
  );
}