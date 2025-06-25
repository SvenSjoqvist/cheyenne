import Image from 'next/image'
import { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata as generatePageMetadata, generateStructuredData } from '@/app/lib/metadata-generator';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await generatePageMetadata('/about');
  
  // Enhanced metadata for the About page
  return {
    ...baseMetadata,
    title: 'About Kilaeko - Luxury Swimwear Brand Story | California Coast to Bali Artisans',
    description: 'Discover Kilaeko\'s journey from California coastal roots to Bali artisans. Learn about our luxury swimwear brand story, sustainable practices, and commitment to authentic, timeless designs that celebrate individual beauty.',
    keywords: [
      'Kilaeko about',
      'luxury swimwear brand story',
      'California coast swimwear',
      'Bali artisan made',
      'sustainable luxury fashion',
      'authentic swimwear design',
      'limited edition swimwear',
      'young founders swimwear',
      'coastal fashion brand',
      'artisan made bikinis'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'About Kilaeko - Luxury Swimwear Brand Story | California Coast to Bali Artisans',
      description: 'Discover Kilaeko\'s journey from California coastal roots to Bali artisans. Learn about our luxury swimwear brand story and commitment to authentic, timeless designs.',
      images: [
        {
          url: '/images/about.jpg',
          width: 1200,
          height: 630,
          alt: 'Kilaeko luxury swimwear brand story - California coast to Bali artisans',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      ...baseMetadata.twitter,
      title: 'About Kilaeko - Luxury Swimwear Brand Story | California Coast to Bali Artisans',
      description: 'Discover Kilaeko\'s journey from California coastal roots to Bali artisans. Learn about our luxury swimwear brand story and commitment to authentic, timeless designs.',
      images: ['/images/about.jpg'],
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
    alternates: {
      canonical: 'https://kilaeko.com/about',
    },
    other: {
      'theme-color': '#F5F5F5',
      'color-scheme': 'light',
    },
  };
}

export default async function About() {
  // Generate structured data for the About page
  const structuredData = await generateStructuredData('/about') || {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kilaeko',
    description: 'Luxury swimwear brand designed on the California coast, artisan made in Bali',
    url: 'https://kilaeko.com',
    logo: 'https://kilaeko.com/logo.png',
    foundingDate: '2024',
    founder: [
      {
        '@type': 'Person',
        name: 'Kilaeko Founders',
        description: 'Young founders redefining luxury swimwear'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'California'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://kilaeko.com/contact'
    },
    sameAs: [
      'https://instagram.com/kilaeko',
      'https://tiktok.com/@kilaeko'
    ],
    knowsAbout: [
      'Luxury Swimwear',
      'Sustainable Fashion',
      'Artisan Made Clothing',
      'California Coast Fashion',
      'Bali Made Swimwear'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Kilaeko Swimwear Collection',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Luxury Swimwear Collection',
            description: 'Limited edition luxury swimwear designed on the California coast, artisan made in Bali'
          }
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="flex flex-col items-center mt-32 pb-32">
        <h1 className="text-[40px] font-[bero] text-center px-4">designed on the California coast, artisan made in Bali.</h1>
        <div className='mb-8 ml-32 mt-36'>
          <h2 className='text-[32px] font-[bero] font-bold'>About us</h2>
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex flex-col md:flex-row'>
            <div className='flex flex-1 w-full justify-center md:justify-start'>
              <Image 
                src="/images/about.jpg" 
                alt="Kilaeko luxury swimwear brand story - California coast to Bali artisans" 
                width={500} 
                height={500} 
                className="object-contain"
                priority
              />
            </div>
            <div className='flex flex-1 w-full flex-col px-4 md:px-0'>
              <p className='text-xl md:text-2xl pr-4 md:pr-14 font-darker-grotesque font-medium'>
                Kilaeko emerged from coastal roots and a shared vision for redefining luxury swimwear. an upbringing surrounded by ocean waters and endless summer days instilled an appreciation for beauty in its most authentic form. our environment shaped how we view elegance and memorable experiences. we discovered that true luxury isn&apos;t just about the product—it&apos;s about the story behind it and the attention to small details that make it special.
              </p>
              <br />
              <p className='text-xl md:text-2xl pr-4 md:pr-14 font-darker-grotesque font-medium'>
                at Kilaeko, we curate more than swimwear—we craft characters within a larger narrative. each piece possesses its own distinct personality, designed to complement your unique story while embodying our core values of authenticity, timelessness, and freedom. we see each design as having its own soul. when a woman chooses Kilaeko, she&apos;s not just selecting a swimsuit—she&apos;s adopting a character that resonates with her own narrative and becomes part of her most cherished memories.
              </p>
              <br />
              <p className='text-xl md:text-2xl pr-4 md:pr-14 font-darker-grotesque font-medium'>
                with the vibrant energy of youth driving our creative vision, Kilaeko cultivates an exclusive community of discerning individuals who appreciate the value of limited-edition luxury. our curated collections invite you into a space where each piece becomes a representation of your most meaningful moments. being young founders gives us the freedom to challenge conventions. we&apos;re not bound by traditional approaches to luxury—we&apos;re redefining it through our lens of authenticity, limited availability, and emotional connection, creating a sanctuary where individual beauty flourishes beyond societal expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}