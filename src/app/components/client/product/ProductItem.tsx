"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

interface ProductItemProps {
  title: string;
  price: string;
  handle?: string; // Add handle for product URL
  description: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ 
  title, 
  price, 
  handle,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (handle) {
      router.push(`/catalog/${handle}`);
    }
  };

  return (
    <article className="flex flex-col flex-1 justify-center items-center text-center mt-4">
      <h3 className="text-xl font-medium font-darker-grotesque tracking-wider">{title}</h3>
      <p className="mt-2 text-gray-700 font-darker-grotesque">{price}</p>
      <button 
        onClick={handleClick}
        className="mt-4 text-sm font-medium cursor-pointer focus:outline-none"
      >
        add to bag
        <span className="block mt-1.5 h-px border-b border-neutral-800" />
      </button>
    </article>
  );
};

export default ProductItem;