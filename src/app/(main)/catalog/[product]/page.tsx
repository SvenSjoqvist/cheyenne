import ProductInfo from './_components/ProductInfo';
import CompleteSet from './_components/CompleteSet';
import { getGlobalContent, getProduct } from '@/app/lib/shopify';

interface ProductDetailsProps {
  params: Promise<{
    product: string;
  }>;
}

const ProductDetails: React.FC<ProductDetailsProps> = async ({ params }) => {
  // Await the params promise to resolve
  const resolvedParams = await params;
  const productHandle = resolvedParams.product;

  // Fetch the product data using the handle
  const product = await getProduct(productHandle);

  // Fetch global content
  const globalContent = await getGlobalContent();

  // Handle case where product is not found
  if (!product) {
    return <div>Product not found.</div>;
  }

  // Transform globalContent to match the expected type
  const transformedGlobalContent = {
    content: globalContent, // Ensure this matches the structure expected by ProductInfo
  };

  return (
    <main>
      {/* Pass the fetched product data to ProductInfo */}
      <ProductInfo product={product} content={transformedGlobalContent} />
      <CompleteSet />
    </main>
  );
};

export default ProductDetails;