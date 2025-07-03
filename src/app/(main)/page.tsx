import HeroSection from "@/app/components/client/main/Hero";
import ProductSection from "@/app/components/client/main/Products";
import ImageOverlay from "@/app/components/client/main/Overlay";
import RunawaySection from "@/app/components/client/main/About";
import { Product } from "@/app/lib/shopify/types";
import Link from "next/link";
import { getProducts } from "@/app/lib/shopify";
import { Metadata } from "next";
import Script from "next/script";
import FooterHeader from "@/app/components/client/footer/footerHeader";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Kilaeko | Luxury Swimwear & Sustainable Fashion",
    description:
      "Discover Kilaeko's luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention. Shop limited edition swimwear made in Bali. No restocks, limited quantity.",
    keywords: [
      "Kilaeko",
      "luxury swimwear",
      "sustainable swimwear",
      "ethical fashion",
      "Bali swimwear",
      "limited edition swimwear",
      "artisan swimwear",
      "slow fashion",
      "conscious production",
      "swimwear brand",
      "bikini",
      "one-piece swimsuit",
      "swim top",
      "swim bottom",
      "limited quantity",
      "no restocks",
    ],
    openGraph: {
      title: "Kilaeko | Luxury Swimwear & Sustainable Fashion",
      description:
        "Discover Kilaeko's luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention. Shop limited edition swimwear made in Bali.",
      url: "https://kilaeko.com",
      siteName: "Kilaeko",
      images: [
        {
          url: "/images/homepage-hero.jpg",
          width: 1200,
          height: 630,
          alt: "Kilaeko Luxury Swimwear - Sustainable and ethical swimwear collection",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Kilaeko | Luxury Swimwear & Sustainable Fashion",
      description:
        "Discover Kilaeko's luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention.",
      images: ["/images/homepage-hero.jpg"],
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
      canonical: "https://kilaeko.com",
    },
    other: {
      "theme-color": "#F5F5F5",
      "color-scheme": "light",
    },
  };
}

const KilaekoPage: React.FC = async () => {
  try {
    const products = await getProducts({ query: "" });

    const productPairs = new Map<
      string,
      { main: Product; related: Product[] }
    >();

    const getBaseName = (title: string | undefined) => {
      if (!title) return "";
      return title.replace(/\s+(Top|Bottom|One Piece)$/, "");
    };

    // Group products by their base name
    products.forEach((product) => {
      if (!product?.title) return;

      const baseName = getBaseName(product.title);
      if (!baseName) return;

      if (!productPairs.has(baseName)) {
        productPairs.set(baseName, { main: product, related: [] });
      }

      const pair = productPairs.get(baseName)!;

      // If it's a one piece, make it the main product
      if (product.title.includes("One Piece")) {
        pair.main = product;
      }
      // If it's a top, make it the main product
      else if (product.title.includes("Top")) {
        pair.main = product;
      }
      // If it's a bottom, add it to related
      else if (product.title.includes("Bottom")) {
        pair.related.push(product);
      }
    });

    // Convert map to array and take first 4 unique products
    const productGroups = Array.from(productPairs.values())
      .filter((group) => group.main && group.main.title)
      .slice(0, 4);

    // Generate structured data for the homepage
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Kilaeko Homepage",
      description:
        "Discover Kilaeko's luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention.",
      url: "https://kilaeko.com",
      mainEntity: {
        "@type": "CollectionPage",
        name: "Kilaeko Swimwear Collection",
        description:
          "Luxury swimwear collection featuring sustainable and ethical pieces made in Bali",
        url: "https://kilaeko.com",
        hasPart: productGroups.map((group) => ({
          "@type": "Product",
          name: group.main.title,
          description:
            group.main.description || `Luxury ${group.main.title} from Kilaeko`,
          url: `https://testing.kilaeko.com/products/${group.main.handle}`,
          image: group.main.featuredImage?.url,
          brand: {
            "@type": "Brand",
            name: "Kilaeko",
          },
          category: "Swimwear",
          offers: {
            "@type": "Offer",
            price: group.main.priceRange?.minVariantPrice?.amount,
            priceCurrency:
              group.main.priceRange?.minVariantPrice?.currencyCode || "USD",
            availability: group.main.availableForSale
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "Kilaeko",
            },
          },
        })),
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://kilaeko.com",
          },
        ],
      },
      hasPart: {
        "@type": "ItemList",
        name: "Featured Products",
        description: "Featured swimwear pieces from Kilaeko collection",
        numberOfItems: productGroups.length,
        itemListElement: productGroups.map((group, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: group.main.title,
          description:
            group.main.description || `Luxury ${group.main.title} from Kilaeko`,
        })),
      },
    };

    return (
      <>
        <Script
          id="homepage-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <div className="flex overflow-hidden flex-col bg-neutral-100">
          <section className="relative">
            <HeroSection />
            <div className="relative w-full">
              <ImageOverlay
                backgroundSrc="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/f69a4747478375673d3bf50b5295aac6cd7566809f6d599e8786c19a699a02a9?apiKey=df24f938eeb948889fe9ad55656873a2&"
                overlaySrc="/home.webp"
              />
            </div>
          </section>

          {productGroups.length > 0 && (
            <section>
              <ProductSection productGroups={productGroups} />
            </section>
          )}

          <section className="text-center">
            <Link
              className="cursor-pointer self-center px-5 py-2 mt-32 max-w-full text-2xl font-darker-grotesque tracking-wider leading-none bg-neutral-800 text-neutral-100 w-auto max-md:mt-10 inline-flex items-center justify-center"
              href="/catalog"
              aria-label="Shop our complete collection"
            >
              shop now
            </Link>
          </section>

          <section>
            <RunawaySection />
          </section>

          <section className="text-center px-16 py-24 w-full text-4xl font-bold leading-none bg-[#588FAE] text-neutral-100 tracking-[2px] max-md:px-5 max-md:max-w-full font-[bero]">
            no restocks, limited quantity.
          </section>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching products:", error);

    // Generate fallback structured data
    const fallbackStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Kilaeko Homepage",
      description:
        "Discover Kilaeko's luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention.",
      url: "https://kilaeko.com",
      mainEntity: {
        "@type": "CollectionPage",
        name: "Kilaeko Swimwear Collection",
        description:
          "Luxury swimwear collection featuring sustainable and ethical pieces made in Bali",
      },
    };

    // Return a fallback UI if products can't be loaded
    return (
      <>
        <Script
          id="homepage-fallback-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(fallbackStructuredData),
          }}
        />
        <div className="flex overflow-hidden flex-col bg-neutral-100">
          <section className="relative">
            <HeroSection />
            <div className="relative w-full">
              <ImageOverlay
                backgroundSrc="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/f69a4747478375673d3bf50b5295aac6cd7566809f6d599e8786c19a699a02a9?apiKey=df24f938eeb948889fe9ad55656873a2&"
                overlaySrc="/home.png"
              />
            </div>
          </section>

          <section className="text-center py-10">
            <p className="text-lg">Loading products...</p>
          </section>

          <section>
            <RunawaySection />
          </section>

          <FooterHeader />
        </div>
      </>
    );
  }
};

export default KilaekoPage;
