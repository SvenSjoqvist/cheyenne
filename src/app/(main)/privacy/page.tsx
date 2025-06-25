import { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata as generatePageMetadata, generateStructuredData } from '@/app/lib/metadata-generator';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await generatePageMetadata('/privacy');
  
  // Enhanced metadata for the Privacy Policy page
  return {
    ...baseMetadata,
    title: 'Privacy Policy - Kilaeko | Data Protection & Privacy Information',
    description: 'Learn about Kilaeko\'s privacy policy, data collection practices, and how we protect your personal information. Understand your rights under CCPA and GDPR.',
    keywords: [
      'Kilaeko privacy policy',
      'data protection swimwear',
      'personal information collection',
      'CCPA compliance',
      'GDPR compliance',
      'privacy rights',
      'data sharing policy',
      'customer data protection',
      'swimwear privacy policy',
      'online privacy protection'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Privacy Policy - Kilaeko | Data Protection & Privacy Information',
      description: 'Learn about Kilaeko\'s privacy policy, data collection practices, and how we protect your personal information. Understand your rights under CCPA and GDPR.',
      images: [
        {
          url: '/images/privacy.jpg',
          width: 1200,
          height: 630,
          alt: 'Kilaeko Privacy Policy - Data protection and privacy information',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      ...baseMetadata.twitter,
      title: 'Privacy Policy - Kilaeko | Data Protection & Privacy Information',
      description: 'Learn about Kilaeko\'s privacy policy, data collection practices, and how we protect your personal information. Understand your rights under CCPA and GDPR.',
      images: ['/images/privacy.jpg'],
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
      canonical: 'https://kilaeko.com/privacy',
    },
    other: {
      'theme-color': '#F7F7F7',
      'color-scheme': 'light',
    },
  };
}

export default async function Privacy() {
  // Generate structured data for the Privacy Policy page
  const structuredData = await generateStructuredData('/privacy') || {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - Kilaeko',
    description: 'Kilaeko privacy policy and data protection information',
    url: 'https://kilaeko.com/privacy',
    mainEntity: {
      '@type': 'Article',
      headline: 'Privacy Policy - Kilaeko',
      description: 'Learn about Kilaeko\'s privacy policy, data collection practices, and how we protect your personal information.',
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
      datePublished: '2025-01-30',
      dateModified: '2025-01-30',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://kilaeko.com/privacy'
      },
      about: [
        {
          '@type': 'Thing',
          name: 'Privacy Policy'
        },
        {
          '@type': 'Thing',
          name: 'Data Protection'
        },
        {
          '@type': 'Thing',
          name: 'Personal Information'
        },
        {
          '@type': 'Thing',
          name: 'CCPA Compliance'
        },
        {
          '@type': 'Thing',
          name: 'GDPR Compliance'
        }
      ],
      mentions: [
        {
          '@type': 'Thing',
          name: 'California Consumer Privacy Act'
        },
        {
          '@type': 'Thing',
          name: 'General Data Protection Regulation'
        }
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
          name: 'Privacy Policy',
          item: 'https://kilaeko.com/privacy'
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="privacy-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
<div className="bg-[#F7F7F7] pt-20 pb-32">
      <h1 className="text-[40px] font-[bero] text-center px-4">
        Privacy Policy
      </h1>

      <div className="max-w-3xl mx-auto px-6 mt-12">
        <h1 className="text-lg font-darker-grotesque font-bold">
          Privacy Policy
        </h1>
        <p className="font-darker-grotesque text-lg">
          Last updated: January 30, 2025
        </p>

        <p className="font-darker-grotesque text-lg mb-8">
          TWO DNA LLC (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
          operates the kilaeko.com website. This page informs you of our
          policies regarding the collection, use, and disclosure of personal
          information when you use our website.
        </p>

        <p className="text-lg font-darker-grotesque font-medium">
          Information we collect
        </p>
        <p className="font-darker-grotesque text-lg mb-2">
          We collect several types of information from and about users of our
          website, including:
        </p>
        <ul className="list-none font-darker-grotesque text-lg mb-8">
          <li>
            - Personal information such as names, email addresses, birthdays,
            phone numbers, billing &amp; shipping addresses
          </li>
          <li>
            - Order information such as the items you purchased, payment
            information, IP address, and other identifiers
          </li>
          <li>
            - Tracking data such as cookies, log files, and web beacons that
            collect information about your browsing activities and patterns
          </li>
        </ul>

        <p className="text-lg font-darker-grotesque font-medium">
          How we use your information
        </p>
        <p className="font-darker-grotesque text-lg mb-2">
          We use the information we collect for various purposes:
        </p>
        <ul className="list-none font-darker-grotesque text-lg mb-8">
          <li>
            - To contact you about your orders, account, or customer service
            matters
          </li>
          <li>
            - To personalize your experience and deliver content and product
            offerings relevant to your interests
          </li>
          <li>
            - For our marketing and advertising purposes, including sending
            promotional emails or newsletters
          </li>
          <li>- To screen for potential fraud or risk</li>
          <li>- To improve our website and offerings</li>
        </ul>

        <p className="text-lg font-darker-grotesque font-medium">
          Data sharing &amp; third parties
        </p>
        <p className="font-darker-grotesque text-lg mb-2">
          We may share your personal information with trusted third parties who
          assist us in operating our website, conducting our business, or
          servicing you. These may include:
        </p>
        <ul className="list-none font-darker-grotesque text-lg mb-8">
          <li>- Payment processors to authorize and complete transactions</li>
          <li>- Delivery and fulfillment partners to ship your orders</li>
          <li>- Marketing platforms to send emails and advertisements</li>
          <li>- Analytics providers to understand usage of our site</li>
        </ul>
        <p className="font-darker-grotesque text-lg mb-8">
          We may also share your information to comply with applicable laws and
          regulations, respond to lawful requests, or protect our rights.
        </p>

        <p className="text-lg font-darker-grotesque font-medium">
          Your rights &amp; choices
        </p>
        <p className="font-darker-grotesque text-lg mb-8">
          California residents and data subjects in Europe have certain rights
          regarding their personal data under the CCPA and GDPR respectively,
          including the right to access, delete, and opt-out of the sale of your
          data. You can exercise these rights by contacting us. You may opt out
          of receiving promotional emails by following the instructions in those
          emails. If you opt out, we may still send you transactional emails,
          such as those about your orders. If you leave items in your shopping
          cart without completing the purchase, we may send you reminder emails
          about your abandoned cart. We will retain your information for as long
          as needed to provide you services and as necessary to comply with
          legal obligations.
        </p>

        <p className="text-lg font-darker-grotesque font-medium">
          Changes to this policy
        </p>
        <p className="font-darker-grotesque text-lg mb-8">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new policy on this page.
        </p>

        <p className="text-lg font-darker-grotesque font-bold">Contact us</p>
        <p className="font-darker-grotesque text-lg mb-8">
          If you have any questions about this Privacy Policy, please contact us
          at info@kilaeko.com.
        </p>
      </div>
    </div>
    </>
  );
}
