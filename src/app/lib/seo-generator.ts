import { getProducts, getProduct, getCollections } from './shopify';
import { Product, Collection } from './shopify/types';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    type: string;
    url: string;
    image?: string;
    siteName: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
  structuredData?: Record<string, unknown>;
  canonical?: string;
  robots?: string;
}

export interface RouteSEOData {
  path: string;
  seo: SEOData;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

// Static page SEO configurations
const STATIC_PAGES_SEO: Record<string, SEOData> = {
  '/': {
    title: 'Cheyenne Pearl - Luxury Swimwear Collection',
    description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali. Premium quality, sustainable fashion for the modern woman.',
    keywords: ['luxury swimwear', 'bikini', 'one-piece', 'sustainable fashion', 'California swimwear', 'Bali made'],
    openGraph: {
      title: 'Cheyenne Pearl - Luxury Swimwear Collection',
      description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cheyenne Pearl - Luxury Swimwear Collection',
      description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Cheyenne Pearl',
      description: 'Luxury swimwear collection designed on the California coast, artisan made in Bali',
      url: 'https://cheyenne-pearl.vercel.app',
      brand: {
        '@type': 'Brand',
        name: 'Cheyenne Pearl',
        description: 'Luxury swimwear brand designed on the California coast, artisan made in Bali'
      }
    }
  },
  '/catalog': {
    title: 'Swimwear Collection - Cheyenne Pearl',
    description: 'Browse our complete collection of luxury swimwear including bikinis, one-pieces, and cover-ups. Premium quality, sustainable fashion.',
    keywords: ['swimwear collection', 'bikini collection', 'one-piece swimsuits', 'luxury swimwear', 'sustainable fashion'],
    openGraph: {
      title: 'Swimwear Collection - Cheyenne Pearl',
      description: 'Browse our complete collection of luxury swimwear including bikinis, one-pieces, and cover-ups.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/catalog',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Swimwear Collection - Cheyenne Pearl',
      description: 'Browse our complete collection of luxury swimwear including bikinis, one-pieces, and cover-ups.'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Cheyenne Pearl Swimwear Collection',
      description: 'Luxury swimwear collection designed on the California coast, artisan made in Bali',
      url: 'https://cheyenne-pearl.vercel.app/catalog',
      brand: {
        '@type': 'Brand',
        name: 'Cheyenne Pearl'
      }
    }
  },
  '/about': {
    title: 'About Us - Cheyenne Pearl',
    description: 'Learn about Cheyenne Pearl, our story of creating luxury swimwear designed on the California coast and artisan made in Bali.',
    keywords: ['about cheyenne pearl', 'swimwear brand story', 'California swimwear', 'Bali made swimwear', 'luxury swimwear brand'],
    openGraph: {
      title: 'About Us - Cheyenne Pearl',
      description: 'Learn about Cheyenne Pearl, our story of creating luxury swimwear designed on the California coast and artisan made in Bali.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/about',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Us - Cheyenne Pearl',
      description: 'Learn about Cheyenne Pearl, our story of creating luxury swimwear designed on the California coast and artisan made in Bali.'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Cheyenne Pearl',
      description: 'Luxury swimwear brand designed on the California coast, artisan made in Bali',
      url: 'https://cheyenne-pearl.vercel.app',
      logo: 'https://cheyenne-pearl.vercel.app/logo.png'
    }
  },
  '/contact': {
    title: 'Contact Us - Cheyenne Pearl',
    description: 'Get in touch with Cheyenne Pearl. We\'re here to help with any questions about our luxury swimwear collection.',
    keywords: ['contact cheyenne pearl', 'customer service', 'swimwear support', 'luxury swimwear help'],
    openGraph: {
      title: 'Contact Us - Cheyenne Pearl',
      description: 'Get in touch with Cheyenne Pearl. We\'re here to help with any questions about our luxury swimwear collection.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/contact',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us - Cheyenne Pearl',
      description: 'Get in touch with Cheyenne Pearl. We\'re here to help with any questions about our luxury swimwear collection.'
    }
  },
  '/sustainability': {
    title: 'Sustainability - Cheyenne Pearl',
    description: 'Learn about our commitment to sustainability in luxury swimwear. Eco-friendly materials and responsible manufacturing practices.',
    keywords: ['sustainable swimwear', 'eco-friendly swimwear', 'sustainable fashion', 'environmental responsibility'],
    openGraph: {
      title: 'Sustainability - Cheyenne Pearl',
      description: 'Learn about our commitment to sustainability in luxury swimwear. Eco-friendly materials and responsible manufacturing practices.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/sustainability',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sustainability - Cheyenne Pearl',
      description: 'Learn about our commitment to sustainability in luxury swimwear. Eco-friendly materials and responsible manufacturing practices.'
    }
  },
  '/size-guide': {
    title: 'Size Guide - Cheyenne Pearl',
    description: 'Find your perfect fit with our comprehensive size guide for luxury swimwear. Detailed measurements and fitting tips.',
    keywords: ['swimwear size guide', 'bikini sizing', 'one-piece sizing', 'swimwear measurements', 'fitting guide'],
    openGraph: {
      title: 'Size Guide - Cheyenne Pearl',
      description: 'Find your perfect fit with our comprehensive size guide for luxury swimwear. Detailed measurements and fitting tips.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/size-guide',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Size Guide - Cheyenne Pearl',
      description: 'Find your perfect fit with our comprehensive size guide for luxury swimwear. Detailed measurements and fitting tips.'
    }
  },
  '/returns': {
    title: 'Returns & Exchanges - Cheyenne Pearl',
    description: 'Easy returns and exchanges for our luxury swimwear. Customer satisfaction guaranteed with our flexible return policy.',
    keywords: ['swimwear returns', 'swimwear exchanges', 'return policy', 'customer satisfaction'],
    openGraph: {
      title: 'Returns & Exchanges - Cheyenne Pearl',
      description: 'Easy returns and exchanges for our luxury swimwear. Customer satisfaction guaranteed with our flexible return policy.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/returns',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Returns & Exchanges - Cheyenne Pearl',
      description: 'Easy returns and exchanges for our luxury swimwear. Customer satisfaction guaranteed with our flexible return policy.'
    }
  },
  '/faq': {
    title: 'Frequently Asked Questions - Cheyenne Pearl',
    description: 'Find answers to common questions about our luxury swimwear collection, sizing, care instructions, and more.',
    keywords: ['swimwear faq', 'frequently asked questions', 'swimwear care', 'sizing questions'],
    openGraph: {
      title: 'Frequently Asked Questions - Cheyenne Pearl',
      description: 'Find answers to common questions about our luxury swimwear collection, sizing, care instructions, and more.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/faq',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Frequently Asked Questions - Cheyenne Pearl',
      description: 'Find answers to common questions about our luxury swimwear collection, sizing, care instructions, and more.'
    }
  },
  '/privacy': {
    title: 'Privacy Policy - Cheyenne Pearl',
    description: 'Learn how Cheyenne Pearl protects your privacy and personal information when you shop with us.',
    keywords: ['privacy policy', 'data protection', 'personal information'],
    openGraph: {
      title: 'Privacy Policy - Cheyenne Pearl',
      description: 'Learn how Cheyenne Pearl protects your privacy and personal information when you shop with us.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/privacy',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Privacy Policy - Cheyenne Pearl',
      description: 'Learn how Cheyenne Pearl protects your privacy and personal information when you shop with us.'
    }
  },
  '/tos': {
    title: 'Terms of Service - Cheyenne Pearl',
    description: 'Read our terms of service for using Cheyenne Pearl\'s website and purchasing our luxury swimwear.',
    keywords: ['terms of service', 'terms and conditions', 'website terms'],
    openGraph: {
      title: 'Terms of Service - Cheyenne Pearl',
      description: 'Read our terms of service for using Cheyenne Pearl\'s website and purchasing our luxury swimwear.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/tos',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Terms of Service - Cheyenne Pearl',
      description: 'Read our terms of service for using Cheyenne Pearl\'s website and purchasing our luxury swimwear.'
    }
  },
  '/accessibility': {
    title: 'Accessibility - Cheyenne Pearl',
    description: 'Learn about Cheyenne Pearl\'s commitment to web accessibility and inclusive design.',
    keywords: ['web accessibility', 'inclusive design', 'accessibility features'],
    openGraph: {
      title: 'Accessibility - Cheyenne Pearl',
      description: 'Learn about Cheyenne Pearl\'s commitment to web accessibility and inclusive design.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/accessibility',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Accessibility - Cheyenne Pearl',
      description: 'Learn about Cheyenne Pearl\'s commitment to web accessibility and inclusive design.'
    }
  },
  '/collection-journal': {
    title: 'Collection Journal - Cheyenne Pearl',
    description: 'Explore the inspiration and stories behind our luxury swimwear collections. Behind-the-scenes insights and design philosophy.',
    keywords: ['collection journal', 'swimwear inspiration', 'design stories', 'behind the scenes'],
    openGraph: {
      title: 'Collection Journal - Cheyenne Pearl',
      description: 'Explore the inspiration and stories behind our luxury swimwear collections. Behind-the-scenes insights and design philosophy.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/collection-journal',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Collection Journal - Cheyenne Pearl',
      description: 'Explore the inspiration and stories behind our luxury swimwear collections. Behind-the-scenes insights and design philosophy.'
    }
  },
  '/search': {
    title: 'Search - Cheyenne Pearl',
    description: 'Search our luxury swimwear collection to find your perfect piece. Browse by style, size, and more.',
    keywords: ['search swimwear', 'browse swimwear', 'find swimwear'],
    openGraph: {
      title: 'Search - Cheyenne Pearl',
      description: 'Search our luxury swimwear collection to find your perfect piece. Browse by style, size, and more.',
      type: 'website',
      url: 'https://cheyenne-pearl.vercel.app/search',
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Search - Cheyenne Pearl',
      description: 'Search our luxury swimwear collection to find your perfect piece. Browse by style, size, and more.'
    }
  }
};

// Routes to exclude from SEO generation
const EXCLUDED_ROUTES = [
  '/dashboard',
  '/dashboard/*',
  '/account',
  '/account/*',
  '/admin',
  '/admin/*',
  '/api',
  '/api/*',
  '/_next',
  '/_next/*',
  '/404',
  '/500',
  '/collections/runaway'
];

/**
 * Check if a route should be excluded from SEO generation
 */
export function isExcludedRoute(path: string): boolean {
  return EXCLUDED_ROUTES.some(excludedRoute => {
    if (excludedRoute.endsWith('/*')) {
      const baseRoute = excludedRoute.slice(0, -2);
      return path.startsWith(baseRoute);
    }
    return path === excludedRoute;
  });
}

/**
 * Generate SEO data for a product page
 */
export async function generateProductSEO(product: Product): Promise<SEOData> {
  const baseUrl = 'https://cheyenne-pearl.vercel.app';
  const productUrl = `${baseUrl}/catalog/${product.handle}`;
  
  // Extract price information
  const price = product.priceRange.minVariantPrice.amount;
  const currency = product.priceRange.minVariantPrice.currencyCode;
  
  // Generate keywords from product data
  const keywords = [
    product.title.toLowerCase(),
    'luxury swimwear',
    'cheyenne pearl',
    ...(product.tags || []),
    'bikini',
    'one-piece',
    'swimsuit'
  ].filter(Boolean);

  const seoData: SEOData = {
    title: `${product.title} - Cheyenne Pearl`,
    description: product.description || `Shop ${product.title} from Cheyenne Pearl's luxury swimwear collection. Premium quality, sustainable fashion.`,
    keywords,
    openGraph: {
      title: `${product.title} - Cheyenne Pearl`,
      description: product.description || `Shop ${product.title} from Cheyenne Pearl's luxury swimwear collection.`,
      type: 'product',
      url: productUrl,
      image: product.featuredImage?.url,
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - Cheyenne Pearl`,
      description: product.description || `Shop ${product.title} from Cheyenne Pearl's luxury swimwear collection.`,
      image: product.featuredImage?.url
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      url: productUrl,
      image: product.featuredImage?.url,
      brand: {
        '@type': 'Brand',
        name: 'Cheyenne Pearl'
      },
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: currency,
        availability: product.availableForSale 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        url: productUrl
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127'
      }
    },
    canonical: productUrl
  };

  return seoData;
}

/**
 * Generate SEO data for a collection page
 */
export async function generateCollectionSEO(collection: Collection): Promise<SEOData> {
  const baseUrl = 'https://cheyenne-pearl.vercel.app';
  const collectionUrl = `${baseUrl}/catalog/${collection.handle}`;
  
  const seoData: SEOData = {
    title: `${collection.title} - Cheyenne Pearl`,
    description: collection.description || `Browse our ${collection.title} collection. Luxury swimwear designed on the California coast, artisan made in Bali.`,
    keywords: [
      collection.title.toLowerCase(),
      'luxury swimwear',
      'cheyenne pearl',
      'swimwear collection',
      'bikini collection',
      'one-piece collection'
    ],
    openGraph: {
      title: `${collection.title} - Cheyenne Pearl`,
      description: collection.description || `Browse our ${collection.title} collection. Luxury swimwear designed on the California coast, artisan made in Bali.`,
      type: 'website',
      url: collectionUrl,
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${collection.title} - Cheyenne Pearl`,
      description: collection.description || `Browse our ${collection.title} collection. Luxury swimwear designed on the California coast, artisan made in Bali.`
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${collection.title} Collection`,
      description: collection.description || `Browse our ${collection.title} collection.`,
      url: collectionUrl,
      brand: {
        '@type': 'Brand',
        name: 'Cheyenne Pearl'
      }
    },
    canonical: collectionUrl
  };

  return seoData;
}

/**
 * Get SEO data for a specific route
 */
export async function getSEODataForRoute(path: string): Promise<SEOData | null> {
  // Check if route should be excluded
  if (isExcludedRoute(path)) {
    return null;
  }

  // Handle static pages
  if (STATIC_PAGES_SEO[path]) {
    return STATIC_PAGES_SEO[path];
  }

  // Handle dynamic product routes
  if (path.startsWith('/catalog/')) {
    const handle = path.replace('/catalog/', '');
    if (handle) {
      try {
        const product = await getProduct(handle);
        if (product) {
          return await generateProductSEO(product);
        }
      } catch (error) {
        console.error(`Error fetching product for SEO: ${handle}`, error);
      }
    }
  }

  // Handle collection routes (if you have them)
  if (path.startsWith('/collections/')) {
    const handle = path.replace('/collections/', '');
    if (handle) {
      try {
        const collections = await getCollections();
        const collection = collections.find(c => c.handle === handle);
        if (collection) {
          return await generateCollectionSEO(collection);
        }
      } catch (error) {
        console.error(`Error fetching collection for SEO: ${handle}`, error);
      }
    }
  }

  // Return default SEO for unknown routes
  return {
    title: 'Cheyenne Pearl - Luxury Swimwear',
    description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.',
    openGraph: {
      title: 'Cheyenne Pearl - Luxury Swimwear',
      description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.',
      type: 'website',
      url: `https://cheyenne-pearl.vercel.app${path}`,
      siteName: 'Cheyenne Pearl'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cheyenne Pearl - Luxury Swimwear',
      description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.'
    }
  };
}

/**
 * Generate SEO data for all routes (for sitemap generation)
 */
export async function generateAllRouteSEO(): Promise<RouteSEOData[]> {
  const routes: RouteSEOData[] = [];
  const currentDate = new Date().toISOString();

  // Add static pages
  for (const [path, seo] of Object.entries(STATIC_PAGES_SEO)) {
    routes.push({
      path,
      seo,
      lastmod: currentDate,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? 1.0 : 0.8
    });
  }

  // Add dynamic product routes
  try {
    const products = await getProducts({});
    for (const product of products) {
      const path = `/catalog/${product.handle}`;
      const seo = await generateProductSEO(product);
      
      routes.push({
        path,
        seo,
        lastmod: product.updatedAt || currentDate,
        changefreq: 'weekly',
        priority: 0.8
      });
    }
  } catch (error) {
    console.error('Error fetching products for SEO generation:', error);
  }

  // Add collection routes
  try {
    const collections = await getCollections();
    for (const collection of collections) {
      if (collection.handle && collection.handle !== 'all') {
        const path = `/collections/${collection.handle}`;
        const seo = await generateCollectionSEO(collection);
        
        routes.push({
          path,
          seo,
          lastmod: collection.updatedAt || currentDate,
          changefreq: 'monthly',
          priority: 0.7
        });
      }
    }
  } catch (error) {
    console.error('Error fetching collections for SEO generation:', error);
  }

  return routes;
}

/**
 * Generate a comprehensive sitemap with SEO data
 */
export async function generateSitemapWithSEO(): Promise<{
  routes: RouteSEOData[];
  sitemap: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }>;
}> {
  const routes = await generateAllRouteSEO();
  
  const sitemap = routes
    .filter(route => !isExcludedRoute(route.path))
    .map(route => ({
      loc: route.path,
      lastmod: route.lastmod || new Date().toISOString(),
      changefreq: route.changefreq || 'weekly',
      priority: route.priority || 0.5
    }));

  return { routes, sitemap };
} 