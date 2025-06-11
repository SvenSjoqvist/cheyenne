'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/lib/shopify/types';

interface ProductGroup {
  main: Product;
  related: Product[];
}

const ProductSection = ({ productGroups }: { productGroups: ProductGroup[] }) => {
  const router = useRouter();

  // Helper function to format price
  const formatPrice = (amount: string) => {
    return `${amount}€`;
  };

  // Helper function to get clean title
  const getCleanTitle = (title: string) => {
    return title.replace(/\s+(Top|Bottom|One Piece)$/, '');
  };

  return (
    <section className="self-center mt-32 w-full max-w-[1376px] max-md:mt-10 max-md:max-w-full">
      <div className="grid grid-cols-4 gap-8 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1">
        {productGroups.map((group, index) => (
          <article key={index} className="flex flex-col">
            <div className="flex flex-col text-xl font-medium tracking-wider leading-none text-neutral-800 w-[325px] mx-auto">
              <div className="relative w-[325px] h-[488px]">
                <Image 
                  src={group.main.featuredImage.url} 
                  alt={group.main.title} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  priority={index < 4}
                />
              </div>
              
              <h2 className="self-center mt-6 font-darker-grotesque text-center text-2xl">{getCleanTitle(group.main.title)}</h2>
              
              <div className="flex justify-between items-center mt-6">
                <p className="font-darker-grotesque min-w-[140px] text-lg">
                  {group.main.title.includes('One Piece') ? 'One Piece' : 'Top'}: {formatPrice(group.main.priceRange.minVariantPrice.amount)}
                </p>
                <div className="flex flex-col">
                  <button 
                    onClick={() => router.push(`/catalog/${group.main.handle}`)} 
                    className="cursor-pointer font-darker-grotesque text-xl whitespace-nowrap"
                  >
                    add to bag
                  </button>
                  <div className="shrink-0 h-px border-solid border-neutral-800 border-[0.5px]" />
                </div>
              </div>

              {/* Related products */}
              {group.related.length > 0 && (
                <div className="mt-6 space-y-4">
                  {group.related.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="flex justify-between items-center">
                      <p className="font-darker-grotesque text-lg min-w-[140px]">
                        Bottom: {formatPrice(relatedProduct.priceRange.minVariantPrice.amount)}
                      </p>
                      <div className="flex flex-col">
                        <button 
                          onClick={() => router.push(`/catalog/${relatedProduct.handle}`)}
                          className="cursor-pointer font-darker-grotesque text-xl whitespace-nowrap"
                        >
                          add to bag
                        </button>
                        <div className="shrink-0 h-px border-solid border-neutral-800 border-[0.5px]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;

