import React, { Suspense } from "react";
import ProductGrid from "@/app/components/client/product/ProductGrid";
import { getProducts } from "@/app/lib/shopify";
import { getCookies } from "@/app/components/client/account/actions";
import { Metadata } from "next";
import Script from "next/script";
import FooterHeader from "@/app/components/client/footer/footerHeader";
export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts({ query: "" });
  const hasProducts = products.length > 0;

  const title = hasProducts
    ? "Swimwear Collection | Kilaeko - Luxury Bikinis & One-Piece Swimsuits"
    : "New Collection Coming Soon | Kilaeko - Limited Edition Swimwear";

  const description = hasProducts
    ? "Discover our curated collection of luxury swimwear. Handcrafted in Bali, designed on the California coast. Shop limited-edition bikinis, one-piece swimsuits, and beach essentials. Free shipping on all orders."
    : "Join our exclusive community for early access to our upcoming limited-edition swimwear collection. Designed on the California coast, artisan made in Bali. Sign up for member-only access.";

  return {
    title,
    description,
    keywords: [
      "luxury swimwear",
      "designer bikinis",
      "one-piece swimsuits",
      "beachwear",
      "California swimwear",
      "Bali made swimwear",
      "limited edition swimwear",
      "sustainable swimwear",
      "premium beach essentials",
      "coastal fashion",
    ].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://testing.kilaeko.com/catalog",
      siteName: "Kilaeko",
      images: [
        {
          url: "https://kilaeko.com/images/og-catalog.jpg", // You'll need to add this image
          width: 1200,
          height: 630,
          alt: "Kilaeko Swimwear Collection - Luxury Bikinis and One-Piece Swimsuits",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://kilaeko.com/images/twitter-catalog.jpg"], // You'll need to add this image
      creator: "@kilaekoswim",
      site: "@kilaekoswim",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "https://testing.kilaeko.com/catalog",
    },
    other: {
      "theme-color": "#F5F5F5",
      "color-scheme": "light",
    },
  };
}

const BikiniBoutique: React.FC = async () => {
  const topProducts = await getProducts({ query: "" });
  const hasCookie = await getCookies({ cookieName: "customerAccessToken" });

  // Generate structured data for products
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kilaeko Swimwear Collection",
    description:
      "Luxury swimwear collection designed on the California coast, artisan made in Bali",
    url: "https://testing.kilaeko.com/catalog",
    brand: {
      "@type": "Brand",
      name: "Kilaeko",
      description:
        "Luxury swimwear brand designed on the California coast, artisan made in Bali",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      offerCount: topProducts.length,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: topProducts.length,
      itemListElement: topProducts.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          description: product.description,
          url: `https://testing.kilaeko.com/catalog/${product.handle}`,
          image: product.featuredImage?.url,
          brand: {
            "@type": "Brand",
            name: "Kilaeko",
          },
          offers: {
            "@type": "Offer",
            price: product.priceRange.minVariantPrice.amount,
            priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            availability: product.availableForSale
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `https://testing.kilaeko.com/catalog/${product.handle}`,
          },
        },
      })),
    },
  };

  if (topProducts.length === 0) {
    return (
      <>
        <Script
          id="structured-data-empty"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "New Collection Coming Soon | Kilaeko",
              description:
                "Join our exclusive community for early access to our upcoming limited-edition swimwear collection.",
              url: "https://testing.kilaeko.com/catalog",
            }),
          }}
        />
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-5xl font-bold font-[bero]">new collection</h1>
          <h2 className="text-2xl font-bold font-[bero] mt-2">
            dropping soon...
          </h2>
          <h3 className="text-xl font-light font-darker-grotesque mt-2">
            only for members, limited stock.
          </h3>
          <div className="flex flex-col items-center justify-center mt-4">
            {!hasCookie ? (
              <button className="text-black py-2 rounded-md cursor-pointer">
                <span className="underline underline-offset-5 my-2">
                  Sign up
                </span>{" "}
                for early access
              </button>
            ) : null}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Script
        id="structured-data-catalog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="flex overflow-hidden flex-col bg-[#F5F5F5] pb-10">
        <div className="container mx-auto px-4 max-w-[1376px] mt-20">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-[bero] mb-4">
              {topProducts.length > 0 ? "Runaway Collection" : "New Collection"}
            </h1>
            {topProducts.length > 0 && (
              <p className="text-lg md:text-xl font-light font-darker-grotesque text-gray-700 max-w-2xl mx-auto">
                Discover our curated collection of luxury swimwear. Handcrafted
                in Bali, designed on the California coast.
              </p>
            )}
          </header>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrid products={topProducts} />
        </Suspense>
      </div>
      <FooterHeader />
    </>
  );
};

export default BikiniBoutique;
