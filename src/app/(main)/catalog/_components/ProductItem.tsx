"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

interface ProductItemProps {
  name: string;
  price: string;
  handle?: string; // Add handle for product URL
}

const ProductItem: React.FC<ProductItemProps> = ({ name, price, handle }) => {
  const router = useRouter();

  const handleClick = () => {
    if (handle) {
      router.push(`/catalog/${handle}`);
    }
  };

  return (
    <article className="flex flex-col flex-1 justify-center items-center text-center">
      <h3 className="text-xl font-medium font-darker-grotesque">{name}</h3>
      <p className="mt-2 text-gray-700 font-darker-grotesque">{price}</p>
      <button 
        onClick={handleClick}
        className="mt-2 text-sm font-medium cursor-pointer focus:outline-none"
      >
        add to bag
        <span className="block mt-1.5 h-px border-b border-neutral-800" />
      </button>
    </article>
  );
};

export default ProductItem;