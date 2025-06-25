import { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata as generatePageMetadata, generateStructuredData } from '@/app/lib/metadata-generator';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await generatePageMetadata('/contact');
  
  // Enhanced metadata for the Contact page
  return {
    ...baseMetadata,
    title: 'Contact Us - Kilaeko | Customer Support & Inquiries',
    description: 'Get in touch with Kilaeko for sizing help, order support, general questions, and PR inquiries. We\'re here to help with all your luxury swimwear needs.',
    keywords: [
      'Kilaeko contact',
      'customer support swimwear',
      'sizing help bikini',
      'order support Kilaeko',
      'luxury swimwear customer service',
      'swimwear sizing questions',
      'PR inquiries Kilaeko',
      'media contact swimwear',
      'customer service bikini',
      'contact luxury swimwear brand'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Contact Us - Kilaeko | Customer Support & Inquiries',
      description: 'Get in touch with Kilaeko for sizing help, order support, general questions, and PR inquiries. We\'re here to help with all your luxury swimwear needs.',
      images: [
        {
          url: '/images/contact.jpg',
          width: 1200,
          height: 630,
          alt: 'Contact Kilaeko - Customer support and inquiries for luxury swimwear',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      ...baseMetadata.twitter,
      title: 'Contact Us - Kilaeko | Customer Support & Inquiries',
      description: 'Get in touch with Kilaeko for sizing help, order support, general questions, and PR inquiries. We\'re here to help with all your luxury swimwear needs.',
      images: ['/images/contact.jpg'],
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
      canonical: 'https://kilaeko.com/contact',
    },
    other: {
      'theme-color': '#F7F7F7',
      'color-scheme': 'light',
    },
  };
}

export default async function ContactPage() {
  // Generate structured data for the Contact page
  const structuredData = await generateStructuredData('/contact') || {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us - Kilaeko',
    description: 'Get in touch with Kilaeko for customer support, sizing help, order inquiries, and PR opportunities',
    url: 'https://kilaeko.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Kilaeko',
      description: 'Luxury swimwear brand designed on the California coast, artisan made in Bali',
      url: 'https://kilaeko.com',
      logo: 'https://kilaeko.com/logo.png',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'info@kilaeko.com',
          name: 'General Inquiries',
          description: 'For general questions and feedback'
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'sizing@kilaeko.com',
          name: 'Sizing Support',
          description: 'Help finding the right fit for swimwear'
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'orders@kilaeko.com',
          name: 'Order Support',
          description: 'Questions about orders, shipping, and returns'
        },
        {
          '@type': 'ContactPoint',
          contactType: 'public relations',
          email: 'connect@kilaeko.com',
          name: 'PR & Media',
          description: 'Press inquiries and media opportunities'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US',
        addressRegion: 'California'
      },
      sameAs: [
        'https://instagram.com/kilaeko',
        'https://tiktok.com/@kilaeko'
      ]
    },
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
          name: 'Contact',
          item: 'https://kilaeko.com/contact'
        }
      ]
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://kilaeko.com/contact'
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Customer Service'
      },
      {
        '@type': 'Thing',
        name: 'Luxury Swimwear Support'
      },
      {
        '@type': 'Thing',
        name: 'Sizing Help'
      },
      {
        '@type': 'Thing',
        name: 'Order Support'
      }
    ]
  };

  return (
    <>
      <Script
        id="contact-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
<div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center font-[bero] mt-10 md:mt-20">
          Contact
        </h1>
      </div>

      <div>
        <p className="text-[14px] sm:text-[16px] font-darker-grotesque tracking-wider font-medium mt-4 sm:mt-7 text-center px-4">
          For detailed sizing information and fit notes, refer to the guide
          below before placing your order.
        </p>
      </div>

      <div>
        <h1 className="text-[32px] sm:text-[32px] font-darker-grotesque tracking-wider font-medium mt-4 sm:mt-7 text-center px-4">
          Sizing Concerns
        </h1>
        <h1 className="text-[20px] sm:text-[20px] font-darker-grotesque tracking-wider font-medium text-center">
          sizing@kilaeko.com
        </h1>
      </div>

      <div>
        <h1 className="text-[32px] sm:text-[32px] font-darker-grotesque tracking-wider font-medium mt-4 sm:mt-7 text-center px-4">
          Orders
        </h1>
        <h1 className="text-[20px] sm:text-[20px] font-darker-grotesque tracking-wider font-medium text-center">
          orders@kilaeko.com
        </h1>
      </div>

      <div>
        <h1 className="text-[32px] sm:text-[32px] font-darker-grotesque tracking-wider font-medium mt-4 sm:mt-7 text-center px-4">
          General Questions
        </h1>
        <h1 className="text-[20px] sm:text-[20px] font-darker-grotesque tracking-wider font-medium text-center">
          info@kilaeko.com
        </h1>
      </div>

      <div>
        <h1 className="text-[32px] sm:text-[32px] font-darker-grotesque tracking-wider font-medium mt-4 sm:mt-7 text-center px-4">
          Public Relations
        </h1>
        <h1 className="text-[20px] sm:text-[20px] font-darker-grotesque tracking-wider font-medium text-center pb-20">
          connect@kilaeko.com
        </h1>
      </div>
    </>
  );
}
