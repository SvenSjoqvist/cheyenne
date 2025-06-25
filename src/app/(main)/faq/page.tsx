import { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata as generatePageMetadata, generateStructuredData } from '@/app/lib/metadata-generator';
import FAQComponent from './components/FAQComponent';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await generatePageMetadata('/faq');
  
  // Enhanced metadata for the FAQ page
  return {
    ...baseMetadata,
    title: 'Frequently Asked Questions - Kilaeko | Customer Support FAQ',
    description: 'Find answers to common questions about Kilaeko swimwear including sizing, shipping, returns, restocks, and more. Get quick answers to your luxury swimwear questions.',
    keywords: [
      'Kilaeko FAQ',
      'swimwear frequently asked questions',
      'bikini sizing questions',
      'swimwear shipping info',
      'luxury swimwear returns',
      'swimwear restock policy',
      'bikini care instructions',
      'swimwear customer support',
      'Kilaeko customer service',
      'swimwear order questions'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Frequently Asked Questions - Kilaeko | Customer Support FAQ',
      description: 'Find answers to common questions about Kilaeko swimwear including sizing, shipping, returns, restocks, and more. Get quick answers to your luxury swimwear questions.',
      images: [
        {
          url: '/images/faq.jpg',
          width: 1200,
          height: 630,
          alt: 'Kilaeko FAQ - Frequently asked questions about luxury swimwear',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      ...baseMetadata.twitter,
      title: 'Frequently Asked Questions - Kilaeko | Customer Support FAQ',
      description: 'Find answers to common questions about Kilaeko swimwear including sizing, shipping, returns, restocks, and more. Get quick answers to your luxury swimwear questions.',
      images: ['/images/faq.jpg'],
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
      canonical: 'https://kilaeko.com/faq',
    },
    other: {
      'theme-color': '#F5F5F5',
      'color-scheme': 'light',
    },
  };
}

export default async function FAQPage() {
  // Generate structured data for the FAQ page
  const structuredData = await generateStructuredData('/faq') || {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'will there be restock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Due to our drop system business model, we do not offer restocks. We will never have a bikini with the same style & print twice.'
        }
      },
      {
        '@type': 'Question',
        name: 'when can I expect my package?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Please allow up to 5 business days for order processing. All orders are shipped via expedited service, with estimated delivery within 5–7 business days from the date of shipment.'
        }
      },
      {
        '@type': 'Question',
        name: 'what if I am unsure about my size?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We recommend reviewing our Size & Fit guide, or contacting our team for personalized assistance before purchasing.'
        }
      },
      {
        '@type': 'Question',
        name: 'what is the presale process?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Presale orders secure your item in advance. Payment is taken at the time of purchase and your order will ship as soon as it\'s available.'
        }
      },
      {
        '@type': 'Question',
        name: 'what should I do if I receive a damaged item?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Please contact us within 3 days of delivery with photos of the item and packaging. We\'ll help resolve the issue quickly.'
        }
      },
      {
        '@type': 'Question',
        name: 'how much is shipping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer free US shipping on all orders, and free worldwide shipping on orders over $200.'
        }
      },
      {
        '@type': 'Question',
        name: 'what if I accidentally ordered the wrong item?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If your order hasn\'t shipped yet, contact us immediately to request changes. Once shipped, we are unable to make changes.'
        }
      },
      {
        '@type': 'Question',
        name: 'do you have a loyalty program?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We\'re currently developing our loyalty program! Stay tuned by signing up for our newsletter.'
        }
      },
      {
        '@type': 'Question',
        name: 'are there any care instructions for my swimwear?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Hand wash cold, dry flat in shade, and avoid harsh detergents or wringing to preserve the fabric and shape.'
        }
      },
      {
        '@type': 'Question',
        name: 'are there any additional fees for international orders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Some countries may charge customs or import fees. These are the buyer\'s responsibility and not included at checkout.'
        }
      },
      {
        '@type': 'Question',
        name: 'can I change my shipping address after placing an order?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If your order hasn\'t shipped, email us as soon as possible to update the address.'
        }
      },
      {
        '@type': 'Question',
        name: 'are your products tested for quality and durability?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all items are quality-checked and undergo wear testing to ensure longevity and satisfaction.'
        }
      },
      {
        '@type': 'Question',
        name: 'what are your business hours for customer support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our support team is available Monday–Friday, 9 AM to 5 PM PST. We aim to respond within 24 hours.'
        }
      },
      {
        '@type': 'Question',
        name: 'do you offer any collaborations or partnerships with influencers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We love collaborating with creators. Reach out to us via our Contact page or DM us on Instagram.'
        }
      }
    ],
    about: [
      {
        '@type': 'Thing',
        name: 'Kilaeko Swimwear'
      },
      {
        '@type': 'Thing',
        name: 'Luxury Swimwear'
      },
      {
        '@type': 'Thing',
        name: 'Customer Support'
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
          name: 'FAQ',
          item: 'https://kilaeko.com/faq'
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <FAQComponent />
    </>
  );
}
