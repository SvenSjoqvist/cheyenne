import { Product } from "@/app/lib/shopify/types";
import Price from "../Price";
import VariantSelector from "@/app/components/product/variant-selector";
import { AddToCart } from "../cart/add-to-cart";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-2 text-3xl font-bold font-[bero]">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full  p-2 text-sm text-black">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      <AddToCart product={product} />
      <p className="text-xs text-red-600 pt-4 w-2/3">
        Before adding to luggage, please check our size guide or contact us for
        more information.
      </p>
    </>
  );
}