# SEO System Documentation

This document explains the comprehensive SEO system built for Cheyenne Pearl, which automatically generates SEO data for all pages including dynamic product routes.

## Overview

The SEO system provides:
- **Automatic SEO data generation** for all static and dynamic routes
- **Structured data** for rich snippets in search results
- **Open Graph and Twitter Card** metadata for social sharing
- **Canonical URLs** to prevent duplicate content
- **Robots meta tags** for proper indexing
- **Exclusion system** for admin/account routes
- **Sitemap generation** with real product data from Shopify

## Architecture

### Core Components

1. **`src/app/lib/seo-generator.ts`** - Main SEO data generator
2. **`src/app/lib/metadata-generator.ts`** - Next.js metadata integration
3. **`src/app/components/SEOHead.tsx`** - Client-side SEO component
4. **`scripts/sitemap-generator.js`** - Updated sitemap generator
5. **`scripts/generate-seo-data.js`** - SEO data export script

### File Structure

```
src/app/lib/
├── seo-generator.ts          # Main SEO logic
├── metadata-generator.ts     # Next.js metadata helpers
└── shopify/                  # Shopify integration

src/app/components/
└── SEOHead.tsx              # Client-side SEO component

scripts/
├── sitemap-generator.js      # Sitemap generation
└── generate-seo-data.js      # SEO data export

docs/
└── SEO-SYSTEM.md            # This documentation
```

## Features

### 1. Static Page SEO

All static pages have predefined SEO configurations:

- **Homepage** (`/`) - Priority 1.0, daily updates
- **Catalog** (`/catalog`) - Priority 0.9, daily updates
- **About** (`/about`) - Priority 0.6, monthly updates
- **Contact** (`/contact`) - Priority 0.6, monthly updates
- **Sustainability** (`/sustainability`) - Priority 0.5, monthly updates
- **Size Guide** (`/size-guide`) - Priority 0.5, monthly updates
- **Returns** (`/returns`) - Priority 0.5, monthly updates
- **FAQ** (`/faq`) - Priority 0.5, monthly updates
- **Legal pages** (`/privacy`, `/tos`, `/accessibility`) - Priority 0.3, yearly updates
- **Collection Journal** (`/collection-journal`) - Priority 0.6, weekly updates
- **Search** (`/search`) - Priority 0.7, daily updates

### 2. Dynamic Product SEO

Product pages automatically generate SEO data including:

- **Title**: `{Product Name} - Cheyenne Pearl`
- **Description**: Product description or auto-generated
- **Keywords**: Product title, tags, and relevant terms
- **Structured Data**: Product schema with pricing, availability, ratings
- **Open Graph**: Product-specific social sharing metadata
- **Canonical URL**: `https://cheyenne-pearl.vercel.app/catalog/{handle}`

### 3. Collection SEO

Collection pages include:

- **Title**: `{Collection Name} - Cheyenne Pearl`
- **Description**: Collection description or auto-generated
- **Structured Data**: CollectionPage schema
- **Priority**: 0.7, monthly updates

### 4. Route Exclusion

The following routes are automatically excluded from SEO generation:

- `/dashboard/*` - Admin dashboard
- `/account/*` - User account pages
- `/admin/*` - Admin pages
- `/api/*` - API routes
- `/_next/*` - Next.js internal routes
- `/404`, `/500` - Error pages

## Usage

### 1. In Page Components

#### For Static Pages

```tsx
import { Metadata } from 'next';
import { generateMetadata } from '@/app/lib/metadata-generator';

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadata('/about');
}

export default function AboutPage() {
  return <div>About content</div>;
}
```

#### For Dynamic Product Pages

```tsx
import { Metadata } from 'next';
import { generateProductSEO } from '@/app/lib/seo-generator';
import { getProduct } from '@/app/lib/shopify';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);
  
  if (!product) return notFound();
  
  const seoData = await generateProductSEO(product);
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    // ... other metadata
  };
}
```

#### For Client-Side SEO Updates

```tsx
'use client';

import SEOHead from '@/app/components/SEOHead';
import { SEOData } from '@/app/lib/seo-generator';

export default function ProductPage({ seoData }: { seoData: SEOData }) {
  return (
    <div>
      <SEOHead seoData={seoData} />
      {/* Page content */}
    </div>
  );
}
```

### 2. Generating SEO Data

#### Generate All SEO Data

```bash
node scripts/generate-seo-data.js
```

This creates:
- `public/seo/routes-seo.json` - All route SEO data
- `public/seo/sitemap-data.json` - Sitemap data
- `public/seo/seo-summary.json` - Summary statistics
- `public/seo/seo-report.txt` - Human-readable report

#### Generate SEO for Specific Route

```bash
node scripts/generate-seo-data.js --route /catalog/product-handle
```

### 3. Sitemap Generation

The sitemap is automatically generated with real product data:

```bash
npm run build
npm run postbuild
```

This uses the updated `scripts/sitemap-generator.js` which:
- Fetches all products from Shopify
- Fetches all collections from Shopify
- Generates dynamic routes for each product/collection
- Excludes admin/account routes
- Sets appropriate priorities and change frequencies

## SEO Data Structure

### SEOData Interface

```typescript
interface SEOData {
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
  structuredData?: any;
  canonical?: string;
  robots?: string;
}
```

### Example Product SEO Data

```json
{
  "title": "Classic Bikini - Cheyenne Pearl",
  "description": "Shop Classic Bikini from Cheyenne Pearl's luxury swimwear collection. Premium quality, sustainable fashion.",
  "keywords": ["classic bikini", "luxury swimwear", "cheyenne pearl", "bikini"],
  "openGraph": {
    "title": "Classic Bikini - Cheyenne Pearl",
    "description": "Shop Classic Bikini from Cheyenne Pearl's luxury swimwear collection.",
    "type": "product",
    "url": "https://cheyenne-pearl.vercel.app/catalog/classic-bikini",
    "image": "https://cdn.shopify.com/...",
    "siteName": "Cheyenne Pearl"
  },
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Classic Bikini",
    "description": "Luxury swimwear...",
    "url": "https://cheyenne-pearl.vercel.app/catalog/classic-bikini",
    "brand": {
      "@type": "Brand",
      "name": "Cheyenne Pearl"
    },
    "offers": {
      "@type": "Offer",
      "price": "89.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
}
```

## Environment Variables

Required environment variables:

```env
# Shopify Store Domain
SHOPIFY_STORE_DOMAIN=kilaeko-application.myshopify.com

# Shopify Storefront Access Token (for sitemap generation)
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token

# Site URL
SITE_URL=https://cheyenne-pearl.vercel.app
```

## Best Practices

### 1. SEO Optimization

- **Unique titles** for each page
- **Descriptive meta descriptions** (150-160 characters)
- **Relevant keywords** from product data
- **Structured data** for rich snippets
- **Canonical URLs** to prevent duplicates

### 2. Social Media

- **Open Graph tags** for Facebook/LinkedIn
- **Twitter Card tags** for Twitter
- **High-quality images** (1200x630px recommended)
- **Descriptive alt text** for images

### 3. Performance

- **Lazy loading** of SEO components
- **Caching** of SEO data
- **Error handling** for failed API calls
- **Fallback metadata** for missing data

### 4. Maintenance

- **Regular sitemap updates** (daily/weekly)
- **SEO data validation** before deployment
- **Monitoring** of search console performance
- **Testing** of structured data

## Troubleshooting

### Common Issues

1. **Missing Shopify Access Token**
   - Ensure `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is set
   - Check token permissions

2. **SEO Data Not Generating**
   - Verify Shopify API connectivity
   - Check for API rate limits
   - Review error logs

3. **Structured Data Errors**
   - Validate JSON-LD format
   - Check required fields
   - Use Google's Rich Results Test

4. **Sitemap Generation Fails**
   - Check file permissions
   - Verify output directory exists
   - Review network connectivity

### Debugging

```bash
# Test specific route SEO generation
node scripts/generate-seo-data.js --route /catalog/test-product

# Check sitemap generation
npm run build && npm run postbuild

# Validate structured data
# Use Google's Rich Results Test: https://search.google.com/test/rich-results
```

## Future Enhancements

1. **SEO Analytics Integration**
   - Google Search Console API
   - Performance monitoring
   - Keyword tracking

2. **Advanced Structured Data**
   - BreadcrumbList schema
   - Organization schema
   - LocalBusiness schema

3. **International SEO**
   - Hreflang tags
   - Multi-language support
   - Regional targeting

4. **Automated SEO Audits**
   - Page speed optimization
   - Mobile-friendliness
   - Accessibility compliance

## Support

For questions or issues with the SEO system:

1. Check this documentation
2. Review error logs
3. Test with the provided scripts
4. Validate with Google's SEO tools

---

*Last updated: December 2024* 