import { Metadata } from 'next';
import { getSEODataForRoute } from './seo-generator';

export interface GenerateMetadataParams {
  params?: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Generate metadata for a page using our SEO system
 */
export async function generateMetadata(
  path: string,
  params?: GenerateMetadataParams['params']
): Promise<Metadata> {
  try {
    // Handle dynamic routes by replacing params in the path
    let resolvedPath = path;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'string') {
          resolvedPath = resolvedPath.replace(`[${key}]`, value);
        }
      });
    }

    const seoData = await getSEODataForRoute(resolvedPath);
    
    if (!seoData) {
      return {
        title: 'Cheyenne Pearl - Luxury Swimwear',
        description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.',
      };
    }

    const metadata: Metadata = {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      robots: seoData.robots,
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

    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Cheyenne Pearl - Luxury Swimwear',
      description: 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.',
    };
  }
}

/**
 * Generate structured data for a page
 */
export async function generateStructuredData(
  path: string,
  params?: GenerateMetadataParams['params']
): Promise<Record<string, unknown> | null> {
  try {
    let resolvedPath = path;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'string') {
          resolvedPath = resolvedPath.replace(`[${key}]`, value);
        }
      });
    }

    const seoData = await getSEODataForRoute(resolvedPath);
    return seoData?.structuredData || null;
  } catch (error) {
    console.error('Error generating structured data:', error);
    return null;
  }
}

/**
 * Create a metadata generator function for specific routes
 */
export function createMetadataGenerator(path: string) {
  return async (params: GenerateMetadataParams): Promise<Metadata> => {
    return generateMetadata(path, params.params);
  };
}

/**
 * Create a structured data generator function for specific routes
 */
export function createStructuredDataGenerator(path: string) {
  return async (params: GenerateMetadataParams): Promise<Record<string, unknown> | null> => {
    return generateStructuredData(path, params.params);
  };
} 