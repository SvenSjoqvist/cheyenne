import { getProductsServerAction } from '@/app/lib/shopify/admin/shopify-admin';
import DataTable from '@/app/components/admin/DataTable';
import { ProductData } from '@/app/components/admin/types';

interface PageProps {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function InventoryPage({
  searchParams,
}: PageProps) {
  const resolvedParams = await searchParams;
  const { products, hasNextPage, endCursor } = await getProductsServerAction(10, resolvedParams.cursor);

  const customColumns = [
    { header: 'SKU', accessor: 'sku' as keyof ProductData },
    { header: 'Name', accessor: 'title' as keyof ProductData },
    { header: 'Description', accessor: 'description' as keyof ProductData },
    { header: 'Quantity', accessor: 'totalInventory' as keyof ProductData },
    { header: 'Category', accessor: 'category' as keyof ProductData },
    { header: 'Status', accessor: 'stock' as keyof ProductData },
  ];

  return (
    <div className="p-4">
      <h1 className="text-[40px] mb-4 font-darker-grotesque font-regular tracking-wider text-center text-[#212121] mt-13">Inventory</h1>
      <DataTable<ProductData>
        data={products.map(product => ({ node: product }))}
        hasNextPage={hasNextPage}
        endCursor={endCursor}
        baseUrl="/dashboard/inventory"
        type="products"
        customColumns={customColumns}
      />
    </div>
  );
}