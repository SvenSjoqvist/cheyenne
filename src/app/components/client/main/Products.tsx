'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/lib/shopify/types';

interface ProductGroup {
  main: Product;
  related: Product[];
}

export default function ProductSection({ productGroups }: { productGroups: ProductGroup[] }) {
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
      <div className="flex gap-5 max-md:flex-col">
        {productGroups.map((group, index) => (
          <article key={index} className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full text-xl font-medium tracking-wider leading-none text-neutral-800 max-md:mt-6">
              <Image 
                src={group.main.featuredImage.url} 
                alt={group.main.title} 
                width={408} 
                height={408} 
              />
              
              <h2 className="self-center mt-4 font-darker-grotesque">{getCleanTitle(group.main.title)}</h2>
              
              <div className="flex gap-10 justify-between items-center mt-4">
                <p className="self-stretch my-auto font-darker-grotesque">
                  {group.main.title.includes('One Piece') ? 'One Piece' : 'Top'}: {formatPrice(group.main.priceRange.minVariantPrice.amount)}
                </p>
                <div className="flex flex-col self-stretch my-auto rounded-none w-[89px]">
                  <button 
                    onClick={() => router.push(`/catalog/${group.main.handle}`)} 
                    className="cursor-pointer font-darker-grotesque text-xl"
                  >
                    add to bag
                  </button>
                  <div className="shrink-0 h-px border-solid border-neutral-800 border-[0.5px]" />
                </div>
              </div>

              {/* Related products */}
              {group.related.length > 0 && (
                <div className="mt-4 space-y-2">
                  {group.related.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="flex justify-between items-center">
                      <p className="font-darker-grotesque text-lg">
                        Bottom: {formatPrice(relatedProduct.priceRange.minVariantPrice.amount)}
                      </p>
                      <div className="flex flex-col self-stretch my-auto rounded-none w-[89px]">
                        <button 
                          onClick={() => router.push(`/catalog/${relatedProduct.handle}`)}
                          className="cursor-pointer font-darker-grotesque text-xl"
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
}

