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
      <div className="bg-[#F7F7F7] pt-17 pb-32">
        <h1 className="text-[40px] font-bold font-[bero] text-center px-4">contact</h1>
        
        <div className="max-w-3xl mx-auto px-6 mt-4">
          <p className="font-darker-grotesque text-lg mb-8 text-center">
            For inquiries or support, please contact us using the emails below. We&apos;re committed to responding promptly and thoughtfully to every message.
          </p>
          
          <div className="space-y-8 text-center">
            <section>
              <h2 className="text-[32px] font-darker-grotesque font-medium">Sizing Concerns</h2>
              <p className="font-darker-grotesque text-lg mb-1">
                Need help finding the right fit?
              </p>
              <p className="font-darker-grotesque text-lg mb-4">
                Email: <a href="mailto:sizing@kilaeko.com" className="text-blue-600 hover:underline transition-colors duration-200">sizing@kilaeko.com</a>
              </p>
            </section>
            
            <section>
              <h2 className="text-[32px] font-darker-grotesque font-medium">Orders</h2>
              <p className="font-darker-grotesque text-lg mb-1">
                Questions about your order, shipping, or returns?
              </p>
              <p className="font-darker-grotesque text-lg mb-4">
                Email: <a href="mailto:orders@kilaeko.com" className="text-blue-600 hover:underline transition-colors duration-200">orders@kilaeko.com</a>
              </p>
            </section>
            
            <section>
              <h2 className="text-[32px] font-darker-grotesque font-medium">General Questions</h2>
              <p className="font-darker-grotesque text-lg mb-1">
                For general questions and feedback:
              </p>
              <p className="font-darker-grotesque text-lg mb-4">
                Email: <a href="mailto:info@kilaeko.com" className="text-blue-600 hover:underline transition-colors duration-200">info@kilaeko.com</a>
              </p>
            </section>
            
            <section>
              <h2 className="text-[32px] font-darker-grotesque font-medium">PR & Media</h2>
              <p className="font-darker-grotesque text-lg mb-1">
                For press inquiries and media opportunities:
              </p>
              <p className="font-darker-grotesque text-lg mb-4">
                Email: <a href="mailto:connect@kilaeko.com" className="text-blue-600 hover:underline transition-colors duration-200">connect@kilaeko.com</a>
              </p>
            </section>
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-lg font-darker-grotesque font-bold mb-4">We&apos;re Here to Help</h2>
            <p className="font-darker-grotesque text-lg mb-8">
              Thank you for choosing Kilaeko. We appreciate your business and look forward to assisting you with any questions or concerns you may have.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
