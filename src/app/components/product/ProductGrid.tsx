import Image from 'next/image';
import ProductItem from '@/app/components/product/ProductItem';
interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface PriceRange {
  maxVariantPrice: ProductPrice;
  minVariantPrice: ProductPrice;
}

interface ProductImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ShopifyProduct {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  priceRange: PriceRange;
  featuredImage: ProductImage;
}

interface ProductGridProps {
  products: ShopifyProduct[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const formatPrice = (priceRange: PriceRange) => {
    const { minVariantPrice } = priceRange;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: minVariantPrice.currencyCode,
    }).format(parseFloat(minVariantPrice.amount));
  };

  return (
    <div className="container mx-auto px-4 max-w-[1376px] mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col">
            <div className="aspect-[4/5] relative w-full overflow-hidden rounded-lg">
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <ProductItem
              name={product.title}
              price={formatPrice(product.priceRange)}
              handle={product.handle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;