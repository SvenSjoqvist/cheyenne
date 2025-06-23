import { getDetailedProducts } from '@/app/lib/shopify/admin/shopify-admin';
import DataTable from '@/app/components/admin/DataTable';
import AddProductForm from '@/app/components/admin/AddProductForm';
import { ProductData } from '@/app/components/admin/types';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({
  searchParams,
}: PageProps) {
  const resolvedParams = await searchParams;
  const cursor = typeof resolvedParams.cursor === 'string' ? resolvedParams.cursor : undefined;
  const data = await getDetailedProducts(10, cursor);
  const { products } = data;

  // Transform Shopify data to match ProductData interface
  const transformedProducts: Array<{ node: ProductData }> = products.edges.map(edge => ({
    node: {
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      totalInventory: edge.node.totalInventory,
      sku: edge.node.variants.edges[0]?.node.sku || 'N/A',
      category: edge.node.category?.name || 'Uncategorized',
      stock: edge.node.totalInventory > 0 ? 'In Stock' : 'Out of Stock'
    }
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <DataTable
        data={transformedProducts}
        hasNextPage={products.pageInfo.hasNextPage}
        endCursor={products.pageInfo.endCursor}
        baseUrl="/dashboard/products"
        type="products"
        hideActions={false}
      />

      <AddProductForm />
    </div>
  );
}