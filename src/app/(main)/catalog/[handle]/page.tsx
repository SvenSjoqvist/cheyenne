import { AddToCart } from "@/app/components/client/cart/add-to-cart";
import Gallery from "@/app/components/client/product/gallery";
import { ProductProvider } from "@/app/components/client/product/product-context";
import { ProductDescription } from "@/app/components/client/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "@/app/lib/constants";
import { getProduct, getProductsByTag } from "@/app/lib/shopify";
import { Image as ImageType, Product } from "@/app/lib/shopify/types";
import Image from "next/image";
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
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
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
                images={product.images.slice(0, 5).map((image: ImageType) => ({
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
        
        {/* Related Products Section - centered below description */}
        <div className="flex justify-end p-8 md:p-12">
          <div className="w-full lg:w-1/3">
            <RelatedProducts id={product.id} tags={product.tags} />
          </div>
        </div>
      </div>
    </ProductProvider>
  );
}

async function RelatedProducts({ id, tags }: { id: string; tags?: string[] }) {
  let relatedProducts: Product[] = [];

  if (tags && tags.length > 0) {
    const primaryTag = tags[0];
    const taggedProducts = await getProductsByTag(primaryTag, id);
    
    if (taggedProducts && taggedProducts.length > 0) {
      relatedProducts = taggedProducts;
    }
  }

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="w-full">
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold font-[bero]">Complete the set</h2>
      </header>

      <div className="grid place-items-center">
        <div className="w-[342px]">
          <div className="overflow-x-auto">
            <div className="inline-flex space-x-8 pb-4">
              {relatedProducts.map((product) => (
                <article 
                  key={product.handle}
                  className="flex-none w-[342px]"
                >
                  <Link
                    href={`/catalog/${product.handle}`}
                    className="group block"
                    prefetch={true}
                  >
                    <div className="space-y-4">
                      
                      <figure className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={product.featuredImage?.url}
                          alt={product.title}
                          fill
                          sizes="342px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </figure>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <div className="w-[342px]">
              <AddToCart product={relatedProducts[0]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}