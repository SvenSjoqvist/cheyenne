import { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata as generatePageMetadata, generateStructuredData } from '@/app/lib/metadata-generator';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await generatePageMetadata('/accessibility');
  
  // Enhanced metadata for the Accessibility page
  return {
    ...baseMetadata,
    title: 'Accessibility Policy - Kilaeko | WCAG 2.1 AA Compliant Website',
    description: 'Kilaeko is committed to web accessibility for all users. Learn about our WCAG 2.1 AA compliance, accessibility features, and how to report accessibility issues.',
    keywords: [
      'Kilaeko accessibility',
      'WCAG 2.1 AA compliance',
      'web accessibility policy',
      'disability-friendly website',
      'accessible swimwear website',
      'keyboard navigation',
      'screen reader support',
      'color contrast compliance',
      'alternative text images',
      'accessible fashion website'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: 'Accessibility Policy - Kilaeko | WCAG 2.1 AA Compliant Website',
      description: 'Kilaeko is committed to web accessibility for all users. Learn about our WCAG 2.1 AA compliance, accessibility features, and how to report accessibility issues.',
      images: [
        {
          url: '/images/accessibility.jpg',
          width: 1200,
          height: 630,
          alt: 'Kilaeko accessibility policy - WCAG 2.1 AA compliant website for all users',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      ...baseMetadata.twitter,
      title: 'Accessibility Policy - Kilaeko | WCAG 2.1 AA Compliant Website',
      description: 'Kilaeko is committed to web accessibility for all users. Learn about our WCAG 2.1 AA compliance, accessibility features, and how to report accessibility issues.',
      images: ['/images/accessibility.jpg'],
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
      canonical: 'https://kilaeko.com/accessibility',
    },
    other: {
      'theme-color': '#F7F7F7',
      'color-scheme': 'light',
    },
  };
}

export default async function Accessibility() {
  // Generate structured data for the Accessibility page
  const structuredData = await generateStructuredData('/accessibility') || {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Accessibility Policy - Kilaeko',
    description: 'Kilaeko accessibility policy and WCAG 2.1 AA compliance information',
    url: 'https://kilaeko.com/accessibility',
    mainEntity: {
      '@type': 'Article',
      headline: 'Accessibility Policy - Kilaeko',
      description: 'Kilaeko is committed to ensuring that our website is accessible to all users, including those with disabilities.',
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
        '@id': 'https://kilaeko.com/accessibility'
      },
      about: [
        {
          '@type': 'Thing',
          name: 'Web Accessibility'
        },
        {
          '@type': 'Thing',
          name: 'WCAG 2.1 AA'
        },
        {
          '@type': 'Thing',
          name: 'Disability Access'
        }
      ],
      mentions: [
        {
          '@type': 'Thing',
          name: 'Web Content Accessibility Guidelines'
        },
        {
          '@type': 'Thing',
          name: 'WCAG 2.1 level AA'
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
          name: 'Accessibility Policy',
          item: 'https://kilaeko.com/accessibility'
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="accessibility-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
       <div className="bg-[#F7F7F7] pt-20 pb-32">Add commentMore actions
      <h1 className="text-[40px] font-[bero] text-center px-4">
        Accessibility Policy
      </h1>

      <div className="max-w-3xl mx-auto px-6 mt-12">
        <p className="font-darker-grotesque text-lg mb-8">
          TWO DNA LLC (&ldquo;Kilaeko&rdquo;) is committed to ensuring that our
          website is accessible to all users, including those with disabilities.
          We strive to comply with the Web Content Accessibility Guidelines
          (WCAG) 2.1 level AA, which is an internationally recognized standard
          for web accessibility.
        </p>

        <p className="text-lg font-darker-grotesque">
          Website Accessibility Features
        </p>
        <p className="font-darker-grotesque text-lg">
          Our website incorporates several features to enhance accessibility,
          such as:
        </p>
        <ul className="list-none font-darker-grotesque text-lg mb-8">
          <li>1. Alternative text for images and non-text content</li>
          <li>2. Keyboard navigation for all site functionalities</li>
          <li>3. Proper heading structure and semantic HTML elements</li>
          <li>4. Sufficient color contrast ratios</li>
          <li>5. Descriptive link text and page titles</li>
          <li>6. Closed captions or transcripts for video content</li>
        </ul>

        <p className="text-lg font-darker-grotesque">Continuous Improvement</p>
        <p className="font-darker-grotesque text-lg mb-8">
          We recognize that accessibility is an ongoing process, and we are
          constantly working to improve the user experience for all visitors. As
          new technologies and best practices emerge, we will update our site
          accordingly.
        </p>

        <p className="text-lg font-darker-grotesque">Feedback and Assistance</p>
        <p className="font-darker-grotesque text-lg mb-8">
          Despite our best efforts, if you encounter any accessibility barriers
          while using our site, please let us know. You can contact us at
          accessibility@kilaeko.com with a description of the issue you faced
          and the specific page or feature where it occurred. We will make every
          reasonable effort to address your concerns and provide a prompt
          resolution.
        </p>

        <p className="text-lg font-darker-grotesque">Third-Party Content</p>
        <p className="font-darker-grotesque text-lg mb-8">
          While we strive to ensure accessibility across our site, some content
          provided by third parties, such as embedded videos or external links,
          may not be fully compliant with our accessibility standards. We will
          work with these parties to encourage adherence to WCAG guidelines
          whenever possible.
        </p>

        <p className="text-lg font-darker-grotesque">Limitations</p>
        <p className="font-darker-grotesque text-lg mb-8">
          Although we aim for full WCAG 2.1 AA compliance, there may be some
          instances where our site falls short due to technical limitations or
          the nature of certain content. In such cases, we will provide
          alternative means of accessing the information upon request.
        </p>

        <p className="font-darker-grotesque text-lg mt-12 italic">
          This policy was last updated on January 22, 2025. We review our
          accessibility policy and practices annually to ensure they remain
          current and effective. If you have any questions or suggestions
          regarding the accessibility of our site, please contact us at
          info@kilaeko.com.
        </p>
        </div>
      </div>
    </>
  );
}
