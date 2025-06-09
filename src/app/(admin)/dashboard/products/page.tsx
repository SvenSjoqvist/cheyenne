import { getProducts } from '@/app/lib/shopify/admin/shopify-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/app/lib/utils';
import { ShopifyAdminProduct } from '@/app/lib/shopify/types';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({
  searchParams,
}: PageProps) {
  const resolvedParams = await searchParams;
  const cursor = typeof resolvedParams.cursor === 'string' ? resolvedParams.cursor : null;
  const data = await getProducts(cursor);
  const { products } = data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.edges.map(({ node: product }: { node: ShopifyAdminProduct }) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {product.images?.edges?.[0] && (
                    <img
                      src={product.images.edges[0].node.url}
                      alt={product.images.edges[0].node.altText || product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-500">{product.handle}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(product.priceRangeV2.minVariantPrice.amount, product.priceRangeV2.minVariantPrice.currencyCode)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.totalInventory} in stock
                  </p>
                </div>
              </div>
            ))}
          </div>

          {products.pageInfo.hasNextPage && (
            <div className="mt-6 text-center">
              <a
                href={`/dashboard/products?cursor=${encodeURIComponent(products.pageInfo.endCursor)}`}
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