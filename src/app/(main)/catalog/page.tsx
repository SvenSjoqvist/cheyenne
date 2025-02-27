import React, { Suspense } from 'react';
import ProductGrid from './_components/ProductGrid';
import SizeGuide from './_components/SizeGuide';
import { getProducts } from '@/app/lib/shopify';

const BikiniBoutique: React.FC = async () => {
  const topProducts = await getProducts({ query: "" });

  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductGrid products={topProducts} />
      </Suspense>
      <SizeGuide />
    </div>
  );
};

export default BikiniBoutique;