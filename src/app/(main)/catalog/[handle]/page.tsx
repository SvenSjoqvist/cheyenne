import { AddToCart } from "@/app/components/cart/add-to-cart";
import { GridTileImage } from "@/app/components/grid/Tile";
import Gallery from "@/app/components/product/gallery";
import { ProductProvider } from "@/app/components/product/product-context";
import { ProductDescription } from "@/app/components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "@/app/lib/constants";
import { getProduct, getProductsByTag } from "@/app/lib/shopify";
import { Image, Product } from "@/app/lib/shopify/types";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  // Await the params to get the handle value
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  
  const product = await getProduct(handle);

  if (!product) return notFound();
  
  return (
    <ProductProvider>
      <div className="mx-auto max-w-screen-2xl pt-10">
        <div className="flex flex-col bg-white p-8 md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
        <RelatedProducts id={product.id} tags={product.tags} />
      </div>
    </ProductProvider>
  );
}

async function RelatedProducts({ id, tags }: { id: string; tags?: string[] }) {
    let relatedProducts: Product[] = [];

  // Try to get tag-based recommendations first if tags exist
  if (tags && tags.length > 0) {
    const primaryTag = tags[0];
    const taggedProducts = await getProductsByTag(primaryTag, id);
    
    if (taggedProducts && taggedProducts.length > 0) {
      relatedProducts = taggedProducts;
    }
  }

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Complete the set</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative h-full w-full"
              href={`/catalog/${product.handle}`}
              prefetch={true}
            >
              <GridTileImage
                alt={product.title}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <AddToCart product={relatedProducts[0]} />
      </div>
    </div>
  );
}