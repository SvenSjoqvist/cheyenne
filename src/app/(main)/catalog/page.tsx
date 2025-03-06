import React, { Suspense } from 'react';
import ProductGrid from '../../components/product/ProductGrid';
import { getProducts } from '@/app/lib/shopify';

const BikiniBoutique: React.FC = async () => {
  const topProducts = await getProducts({ query: "" });

  return (
    <div className="flex overflow-hidden flex-col bg-white pb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductGrid products={topProducts} />
      </Suspense>
    </div>
  );
};

export default BikiniBoutique;