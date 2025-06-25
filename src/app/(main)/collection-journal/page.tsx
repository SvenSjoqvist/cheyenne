import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata as generatePageMetadata, generateStructuredData } from '@/app/lib/metadata-generator';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await generatePageMetadata('/collection-journal');
  
  // Enhanced metadata for the Collection Journal page
  return {
    ...baseMetadata,
    title: 'The Runaway Collection - Kilaeko | Journey of Self-Discovery',
    description: 'Discover The Runaway Collection by Kilaeko - a journey of self-discovery through luxury swimwear. Explore the inspiration, behind-the-scenes stories, and the authentic vision behind our first collection.',
    keywords: [
      'The Runaway Collection',
      'Kilaeko swimwear collection',
      'luxury swimwear journey',
      'self-discovery swimwear',
      'California coast swimwear',
      'artisan made bikinis',
      'limited edition collection',
      'behind the scenes swimwear',
      'authentic swimwear design',
      'summer collection 2025'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'The Runaway Collection - Kilaeko | Journey of Self-Discovery',
      description: 'Discover The Runaway Collection by Kilaeko - a journey of self-discovery through luxury swimwear. Explore the inspiration, behind-the-scenes stories, and the authentic vision behind our first collection.',
      images: [
        {
          url: '/images/ocean-print-triangle-bikini-back-black-and-white.jpg',
          width: 1200,
          height: 630,
          alt: 'The Runaway Collection by Kilaeko - luxury swimwear journey of self-discovery',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      ...baseMetadata.twitter,
      title: 'The Runaway Collection - Kilaeko | Journey of Self-Discovery',
      description: 'Discover The Runaway Collection by Kilaeko - a journey of self-discovery through luxury swimwear. Explore the inspiration, behind-the-scenes stories, and the authentic vision behind our first collection.',
      images: ['/images/ocean-print-triangle-bikini-back-black-and-white.jpg'],
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
      canonical: 'https://kilaeko.com/collection-journal',
    },
    other: {
      'theme-color': '#F5F5F5',
      'color-scheme': 'light',
    },
  };
}

export default async function CollectionJournalPage() {
  // Generate structured data for the Collection Journal page
  const structuredData = await generateStructuredData('/collection-journal') || {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Runaway Collection: A Journey of Self-Discovery',
    description: 'Discover The Runaway Collection by Kilaeko - a journey of self-discovery through luxury swimwear designed on the California coast, artisan made in Bali.',
    author: {
      '@type': 'Organization',
      name: 'Kilaeko',
      url: 'https://kilaeko.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kilaeko',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kilaeko.com/logo.png'
      }
    },
    datePublished: '2025-01-22',
    dateModified: '2025-01-22',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://kilaeko.com/collection-journal'
    },
    image: [
      {
        '@type': 'ImageObject',
        url: 'https://kilaeko.com/images/ocean-print-triangle-bikini-back-black-and-white.jpg',
        caption: 'The Runaway Collection - Ocean Print Triangle Bikini'
      },
      {
        '@type': 'ImageObject',
        url: 'https://kilaeko.com/images/two-bikinis-one-piece-group.jpg',
        caption: 'The Runaway Collection - Multiple Swimwear Pieces'
      },
      {
        '@type': 'ImageObject',
        url: 'https://kilaeko.com/images/behind-the-scenes-camera.JPG',
        caption: 'Behind the Scenes - The Runaway Collection Photography'
      }
    ],
    about: [
      {
        '@type': 'Thing',
        name: 'Luxury Swimwear'
      },
      {
        '@type': 'Thing',
        name: 'Self-Discovery'
      },
      {
        '@type': 'Thing',
        name: 'California Coast Fashion'
      },
      {
        '@type': 'Thing',
        name: 'Artisan Made Clothing'
      }
    ],
    mentions: [
      {
        '@type': 'Thing',
        name: 'The Runaway Collection'
      },
      {
        '@type': 'Thing',
        name: 'Summer Collection 2025'
      },
      {
        '@type': 'Thing',
        name: 'Behind the Scenes'
      }
    ],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://kilaeko.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Collection Journal',
          item: 'https://kilaeko.com/collection-journal'
        }
      ]
    },
    mainEntity: {
      '@type': 'Product',
      name: 'The Runaway Collection',
      description: 'Luxury swimwear collection designed on the California coast, artisan made in Bali',
      brand: {
        '@type': 'Brand',
        name: 'Kilaeko'
      },
      category: 'Luxury Swimwear',
      material: 'Premium swimwear fabric',
      color: 'Various',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        url: 'https://kilaeko.com/catalog'
      }
    }
  };

  return (
    <>
      <Script
        id="collection-journal-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center font-[bero] mt-10 md:mt-20">
          the runaway collection: <br />
          a journey of self-discovery
        </h1>
        <div className="flex justify-center items-center mt-6 md:mt-10 flex-col">
          <iframe 
            style={{borderRadius: "12px"}} 
            src="https://open.spotify.com/embed/playlist/50Ln1bXzaVUuQ3OhXz3J2A?utm_source=generator&theme=0" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="w-full max-w-[800px]"
            title="The Runaway Collection Spotify Playlist"
          />
          <p className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] mt-8 md:mt-15 px-4">
            The Runaway Collection began with a feeling we all know: the urge to escape everything familiar and find freedom. It captures those perfect summer afternoons when warm sand meets your feet and salt air settles on your skin. These moments exist outside of time, where authenticity is personified through swimwear.
          </p>
          <Image
            src="/images/ocean-print-triangle-bikini-back-black-and-white.jpg"
            alt="The Runaway Collection - Ocean print triangle bikini in black and white, showcasing the journey of self-discovery"
            width={361}
            height={542}
            className="mt-8 md:mt-10 w-full max-w-[361px]"
            priority
          />
          <p className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] mt-8 md:mt-15 px-4">
            &quot;Runaway&quot; speaks to the woman who steps beyond boundaries. She understands that true freedom comes from embracing who she really is. This collection celebrates running toward something greater, toward moments of joy that become treasured memories.
          </p>
          <div className="mt-8 md:mt-10 w-full max-w-[624px] relative h-[383px]">
            <Image
              src="/images/two-bikinis-one-piece-group.jpg"
              alt="The Runaway Collection - Multiple luxury swimwear pieces including bikinis and one-piece swimsuits"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] mt-8 md:mt-15 px-4">
            Because this collection is our first, it&apos;s personal. There&apos;s an unfinished edge to it&mdash;a looseness in how things came together. But the vision was always clear. Even without a polished blueprint, we knew what we were trying to say and stayed close to that feeling the whole way through. Each piece is built to move with the body and feel right without needing adjustment. The fabrics are soft, but strong enough to handle long days in the sun. We&apos;re not rushing anything. Every decision is intentional, led by a feeling we trust when we see it come to life.
          </p>
        </div>
        <div className="flex justify-center items-center mt-8 md:mt-10 bg-[#212121] text-white w-full min-h-[457px] py-12 px-4">
          <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-light text-[#F7F7F7] font-darker-grotesque max-w-[472px] leading-normal">
            Each design invites you to embrace your individual story. This is swimwear for women who refuse to apologize for taking up space, who understand that true luxury is the freedom to be completely yourself.
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mt-8 md:mt-10">
          <Image
            src="/images/behind-the-scenes-camera.jpg"
            alt="Behind the scenes photography session for The Runaway Collection - camera setup and creative process"
            width={361}
            height={542}
            className="w-full max-w-[361px]"
          />
          <Image
            src="/images/behind-the-scenes-bikini-picture.jpg"
            alt="Behind the scenes bikini photography for The Runaway Collection - capturing authentic moments"
            width={361}
            height={542}
            className="w-full max-w-[361px]"
          />
          <Image
            src="/images/behind-the-scenes-polaroid-camera.jpg"
            alt="Behind the scenes polaroid photography for The Runaway Collection - vintage camera and creative process"
            width={361}
            height={542}
            className="w-full max-w-[361px]"
          />
        </div>
        <div className="flex justify-center items-center mt-8 md:mt-10 flex-col px-4">
          <blockquote className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] italic">
            &quot;Working on the first collection was an experience to remember. Connecting with our closest friends who believe in the brand is truly something we appreciate so deeply. Getting together, trying on the bikinis, and creating elaborate sets to take the perfect photos is so core to what this brand stands for&mdash;intimacy, intention, and joy. I won&apos;t forget the smiles on all of our faces, seeing the vision come to life.&quot;
          </blockquote>
          <p className="text-center text-base md:text-lg lg:text-xl font-light font-darker-grotesque mt-4">
            &mdash; Note from the Founders
          </p>
        </div>
        <div className="flex justify-center items-center mt-8 md:mt-10 bg-[#212121] w-screen min-h-[703px] py-12">
          <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-light text-[#F7F7F7] font-darker-grotesque max-w-[472px] leading-normal">
            Every detail serves a greater purpose: to celebrate the remarkable woman who will wear these pieces. We&apos;re honored to create swimwear that becomes part of your most treasured experiences, holding within them summer laughter, unexpected connections, and the quiet confidence that comes from knowing you belong exactly where you are.
          </h2>
        </div>
      </div>
    </>
  );
}
