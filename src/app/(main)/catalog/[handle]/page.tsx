import { AddToCart } from "@/app/components/client/cart/add-to-cart";
import Gallery from "@/app/components/client/product/gallery";
import { ProductProvider } from "@/app/components/client/product/product-context";
import { ProductDescription } from "@/app/components/client/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "@/app/lib/constants";
import { getProduct, getProductsByTag } from "@/app/lib/shopify";
import { Image as ImageType, Product } from "@/app/lib/shopify/types";
import { generateProductSEO } from "@/app/lib/seo-generator";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Reviews from "@/app/components/client/product/Reviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) return notFound();

  // Use our SEO generator for comprehensive metadata
  const seoData = await generateProductSEO(product);
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    alternates: {
      canonical: seoData.canonical,
    },
    openGraph: seoData.openGraph ? {
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      type: seoData.openGraph.type === 'product' ? 'website' : seoData.openGraph.type as 'website' | 'article',
      url: seoData.openGraph.url,
      siteName: seoData.openGraph.siteName,
      images: seoData.openGraph.image ? [
        {
          url: seoData.openGraph.image,
          width: 1200,
          height: 630,
          alt: seoData.openGraph.title,
        }
      ] : undefined,
    } : undefined,
    twitter: seoData.twitter ? {
      card: seoData.twitter.card as 'summary' | 'summary_large_image',
      title: seoData.twitter.title,
      description: seoData.twitter.description,
      images: seoData.twitter.image ? [seoData.twitter.image] : undefined,
    } : undefined,
  };
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;

  const product = await getProduct(handle);

  if (!product) return notFound();

  return (
    <ProductProvider>
      <div className="mx-auto max-w-screen-2xl pt-10">
        <div className="flex flex-col bg-[#F5F5F5] p-8 md:p-12 lg:flex-row lg:gap-8">
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

        <div className="flex flex-col lg:flex-row pt-12">
          <div className="w-full lg:w-4/6 flex justify-center items-top">
            <video
              src="/videos/video-under-product.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-[700px] h-[428px] object-cover ml-44"
            />
          </div>
          <div className="w-full lg:w-2/6 ">
            <RelatedProducts id={product.id} tags={product.tags} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <Reviews productName={product.title} />
        </div>
        <div className="text-center px-16 py-24 w-full text-4xl font-bold leading-none bg-[#588FAE] text-neutral-100 tracking-[2px] max-md:px-5 max-md:max-w-full font-[bero]">
          no restocks, limited quantity.
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
    <section className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-full overflow-x-auto">
          <div className="flex gap-8 pb-4 min-w-max">
            {relatedProducts.map((product) => (
              <article key={product.handle} className="flex-none w-[342px]">
                <div className="flex flex-col h-full space-y-4">
                  <Link
                    href={`/catalog/${product.handle}`}
                    className="group block flex-grow"
                    prefetch={true}
                  >
                    <figure className="relative w-[342px] h-[428px] overflow-hidden">
                      <Image
                        src={product.featuredImage?.url}
                        alt={product.title}
                        fill
                        sizes="(min-width: 342px) 342px, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </figure>
                    <div className="text-center mt-2">
                      <h2 className="text-2xl font-bold font-[bero]">
                        Complete the set
                      </h2>
                      <h3 className="font-darker-grotesque text-lg">
                        {product.title}
                      </h3>
                    </div>
                  </Link>
                  <div className="mt-auto">
                    <AddToCart product={relatedProducts[0]} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
