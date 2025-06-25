import Header from "@/app/components/client/Header";
import Navbar from "@/app/components/client/navbar/Navbar";
import { Footer } from "@/app/components/client/Footer";
import { CartProvider } from "@/app/components/client/cart/cart-context";
import { cookies } from "next/headers";
import { getCart, getCustomer, getCustomerOrders } from "@/app/lib/shopify";
import SizeGuide from "@/app/components/client/SizeGuide";
import CartModal from "../components/client/cart/modal";
import { UserProvider } from "../components/client/account/AccountContext";
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://testing.kilaeko.com'),
  title: {
    default: 'Kilaeko | Luxury Swimwear & Sustainable Fashion',
    template: '%s | Kilaeko'
  },
  description: 'Discover Kilaeko\'s luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention. Shop limited edition swimwear made in Bali.',
  keywords: [
    'Kilaeko',
    'luxury swimwear',
    'sustainable swimwear',
    'ethical fashion',
    'Bali swimwear',
    'limited edition swimwear',
    'artisan swimwear',
    'slow fashion',
    'conscious production',
    'swimwear brand',
    'bikini',
    'one-piece swimsuit',
    'swim top',
    'swim bottom'
  ],
  authors: [{ name: 'Kilaeko' }],
  creator: 'Kilaeko',
  publisher: 'Kilaeko',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://testing.kilaeko.com',
    siteName: 'Kilaeko',
    title: 'Kilaeko | Luxury Swimwear & Sustainable Fashion',
    description: 'Discover Kilaeko\'s luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention. Shop limited edition swimwear made in Bali.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kilaeko Luxury Swimwear - Sustainable and ethical swimwear collection',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kilaeko',
    creator: '@kilaeko',
    title: 'Kilaeko | Luxury Swimwear & Sustainable Fashion',
    description: 'Discover Kilaeko\'s luxury swimwear collection. Sustainable, ethical, and timeless pieces crafted with intention.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://testing.kilaeko.com',
  },
  other: {
    'theme-color': '#F5F5F5',
    'color-scheme': 'light',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Kilaeko',
    'application-name': 'Kilaeko',
    'msapplication-TileColor': '#F5F5F5',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = getCart(cartId);
  const customerPromise = getCustomer();
  const ordersPromise = getCustomerOrders();

  // Generate structured data for the main layout
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kilaeko',
    url: 'https://testing.kilaeko.com',
    description: 'Luxury swimwear brand focused on sustainability and ethical production',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://testing.kilaeko.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kilaeko',
      url: 'https://testing.kilaeko.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://testing.kilaeko.com/logo.png',
        width: 200,
        height: 60
      },
      sameAs: [
        'https://www.instagram.com/kilaeko',
        'https://www.facebook.com/kilaeko',
        'https://www.pinterest.com/kilaeko'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-XXX-XXX-XXXX',
        contactType: 'customer service',
        email: 'hello@kilaeko.com',
        availableLanguage: 'English'
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US',
        addressLocality: 'United States'
      }
    },
    mainEntity: {
      '@type': 'Organization',
      name: 'Kilaeko',
      description: 'Luxury swimwear brand committed to sustainability and ethical production',
      url: 'https://testing.kilaeko.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://testing.kilaeko.com/logo.png'
      },
      foundingDate: '2020',
      knowsAbout: [
        'Sustainable Fashion',
        'Ethical Production',
        'Luxury Swimwear',
        'Slow Fashion',
        'Artisan Manufacturing'
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Kilaeko Swimwear Collection',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Swim Tops',
              description: 'Luxury swim tops crafted with sustainable materials'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Swim Bottoms',
              description: 'Ethical swim bottoms made in Bali'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'One-Piece Swimsuits',
              description: 'Timeless one-piece swimsuits designed for longevity'
            }
          }
        ]
      }
    }
  };
  
  return (
    <>
      <Script
        id="main-layout-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="bg-[#F5F5F5]">
        <CartProvider cartPromise={cart}>
          <UserProvider customer={customerPromise} orders={ordersPromise}>
            <Header />
            <Navbar />
            <CartModal />
            <main>
              {children}
            </main>
            <Footer />
            <SizeGuide />
          </UserProvider>
        </CartProvider>
      </div>
    </>
  );
}

