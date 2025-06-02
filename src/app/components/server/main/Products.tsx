import dynamic from 'next/dynamic';
import { Product } from '@/app/lib/shopify/types';

interface ProductGroup {
  main: Product;
  related: Product[];
}

const ProductSectionClient = dynamic(
  () => import('@/app/components/client/main/Products'),
  { ssr: false }
);

export default function ProductSection({ productGroups }: { productGroups: ProductGroup[] }) {
  return <ProductSectionClient productGroups={productGroups} />;
} 