"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ProductDescription from './ProductDesc';

interface Product {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  };
  images: Array<{
    url: string;
    altText: string | null;
    width: number;
    height: number;
  }>;
}

interface Field {
  key: string;
  value: string;
}

interface globalContent {
  content: { fields: Field[] }[];
}

interface ProductInfoProps {
  product: Product;
  content: globalContent;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, content }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>(
    product.featuredImage.url
  );

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  if (!product) return <div>Product not found.</div>;
  
  return (
    <section className="mx-4 py-20 flex space-x-6 max-w-full">
      {/* Image thumbnails */}
      <div className="w-1/4 space-y-4">
        {product.images.map((image, index) => (
          <div
            key={index}
            className="relative bg-zinc-100 h-40 w-32 overflow-hidden cursor-pointer ml-5"
            onClick={() => setSelectedImage(image.url)}
          >
            <Image
              src={image.url}
              alt={image.altText || `Product image ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                selectedImage === image.url ? 'opacity-100' : 'opacity-70'
              }`}
              sizes="(max-width: 128px) 100vw, 128px"
            />
          </div>
        ))}
      </div>

      {/* Main product image */}
      <div className="w-[53%] bg-zinc-100 h-[952px] relative overflow-hidden flex-shrink-0">
        <Image
          src={selectedImage}
          alt={product.featuredImage.altText || product.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 65vw, 780px"
        />
      </div>

      {/* Product details */}
      <div className="w-[100%]">
        <h1 className="text-3xl font-bold tracking-wide text-neutral-800 mb-4 font-[bero] whitespace-nowrap">
          {product.title}
        </h1>
        <p className="text-xl mb-8 font-darker-grotesque">
          {formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
          )}
        </p>

        {/* Size selection */}
        <div className="flex space-x-3 mb-6 mt-32">
          {product.options
            ?.find((option) => option.name === 'Size')
            ?.values.map((size: string) => (
              <button
                key={size}
                className={`cursor-pointer w-11 h-11 rounded-xl border border-neutral-800 uppercase flex items-center justify-center text-sm ${
                  selectedSize === size ? 'bg-neutral-800 text-white' : 'bg-neutral-100'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size.toLowerCase()}
              </button>
            ))}
        </div>

        {/* Add to cart button */}
        <div className="flex space-x-4 w-64">
          <button
            className="flex-grow py-3 rounded-xl border border-neutral-800 bg-neutral-100 cursor-pointer"
            onClick={() => console.log('Add to cart:', product.id, selectedSize)}
          >
            add to luggage
          </button>
        </div>

        {/* Product description */}
        <div className="w-full mt-10 pr-5">
          <ProductDescription content={content.content} />
        </div>
      </div>
    </section>
  );
};

export default ProductInfo;