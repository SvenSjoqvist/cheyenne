"use client";

import React from 'react';
import Image from 'next/image';
import ProductItem from '@/app/components/client/product/ProductItem';
import { Product } from '@/app/lib/shopify/types';



interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {

  console.log(products);
  const formatPrice = (priceRange: Product['priceRange']) => {
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
              title={product.title}
              price={formatPrice(product.priceRange)}
              handle={product.handle}
              description={product.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;