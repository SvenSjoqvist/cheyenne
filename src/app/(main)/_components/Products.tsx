'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/lib/shopify/types';

export default function ProductSection({ products }: { products: Product[] }) {
  const router = useRouter();

  return (
    <section className="self-center mt-32 w-full max-w-[1376px] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        {products.map((product) => (
          <article key={product.id} className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full text-xl font-medium tracking-wider leading-none text-neutral-800 max-md:mt-6">
              <Image src={product.featuredImage.url} alt={product.title} width={408} height={408} />
              
              <h2 className="self-center mt-4 font-darker-grotesque">{product.title}</h2>
              
              <div className="flex gap-10 justify-between items-center mt-4">
                <p className="self-stretch my-auto font-darker-grotesque">top: {product.priceRange.minVariantPrice.amount}</p>
                <div className="flex flex-col self-stretch my-auto rounded-none w-[89px]">
                <button onClick={() => router.push(`/catalog/${product.handle}`)} className="cursor-pointer font-darker-grotesque text-xl">add to bag</button>
                <div className="shrink-0 h-px border-solid border-neutral-800 border-[0.5px]" /></div>
              </div>

              <div className="flex gap-10 justify-between items-center mt-4">
                <p className="self-stretch my-auto font-darker-grotesque">bottom: {product.priceRange.maxVariantPrice.amount}</p>
                <div className="flex flex-col self-stretch my-auto rounded-none w-[89px]">
                  <button onClick={() => router.push(`/catalog/${product.handle}`)} className="cursor-pointer font-darker-grotesque text-xl">add to bag</button>
                  <div className="shrink-0 h-px border-solid border-neutral-800 border-[0.5px]" /> </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

