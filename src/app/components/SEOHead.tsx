'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SEOData } from '@/app/lib/seo-generator';

interface SEOHeadProps {
  seoData?: SEOData;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export default function SEOHead({ 
  seoData, 
  fallbackTitle = 'Cheyenne Pearl - Luxury Swimwear',
  fallbackDescription = 'Discover our luxury swimwear collection designed on the California coast, artisan made in Bali.'
}: SEOHeadProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!seoData) return;

    // Update document title
    document.title = seoData.title || fallbackTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoData.description || fallbackDescription);

    // Update keywords
    if (seoData.keywords && seoData.keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', seoData.keywords.join(', '));
    }

    // Update canonical URL
    if (seoData.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', seoData.canonical);
    }

    // Update robots meta
    if (seoData.robots) {
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', seoData.robots);
    }

    // Update Open Graph tags
    if (seoData.openGraph) {
      updateOpenGraphTags(seoData.openGraph);
    }

    // Update Twitter Card tags
    if (seoData.twitter) {
      updateTwitterTags(seoData.twitter);
    }

    // Add structured data
    if (seoData.structuredData) {
      addStructuredData(seoData.structuredData);
    }

  }, [seoData, fallbackTitle, fallbackDescription, pathname]);

  const updateOpenGraphTags = (og: SEOData['openGraph']) => {
    if (!og) return;

    const ogTags = [
      { property: 'og:title', content: og.title },
      { property: 'og:description', content: og.description },
      { property: 'og:type', content: og.type },
      { property: 'og:url', content: og.url },
      { property: 'og:site_name', content: og.siteName },
    ];

    if (og.image) {
      ogTags.push({ property: 'og:image', content: og.image });
    }

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  const updateTwitterTags = (twitter: SEOData['twitter']) => {
    if (!twitter) return;

    const twitterTags = [
      { name: 'twitter:card', content: twitter.card },
      { name: 'twitter:title', content: twitter.title },
      { name: 'twitter:description', content: twitter.description },
    ];

    if (twitter.image) {
      twitterTags.push({ name: 'twitter:image', content: twitter.image });
    }

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  const addStructuredData = (structuredData: Record<string, unknown>) => {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      if (script.textContent?.includes('"@context":"https://schema.org"')) {
        script.remove();
      }
    });

    // Add new structured data
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything
} 