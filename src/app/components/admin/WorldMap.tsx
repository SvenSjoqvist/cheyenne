"use client";

import { useMemo, useEffect, useState } from 'react';

interface CountryOrderData {
  countryCode: string;
  orderCount: number;
}

interface WorldMapProps {
  countryData: CountryOrderData[];
}

// Map country codes to display names
const countryCodeToName: { [key: string]: string } = {
  'US': 'United States',
  'CA': 'Canada', 
  'GB': 'United Kingdom',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'JP': 'Japan',
  'CN': 'China',
  'IN': 'India',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'MA': 'Morocco',
  'RU': 'Russia',
  'TR': 'Turkey',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'ID': 'Indonesia',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'PH': 'Philippines',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'KR': 'South Korea',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',
  'NZ': 'New Zealand',
  'BD': 'Bangladesh',
  'PK': 'Pakistan',
  'IL': 'Israel',
  'GR': 'Greece',
  'PT': 'Portugal',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'SI': 'Slovenia',
  'SK': 'Slovakia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'IR': 'Iran',
  'IQ': 'Iraq'
};

// Colors for top countries (from most to least orders)
const TOP_COUNTRY_COLORS = [
  '#1e40af', // Blue - 1st place
  '#3b82f6', // Lighter blue - 2nd place  
  '#60a5fa', // Even lighter blue - 3rd place
  '#93c5fd', // Light blue - 4th place
  '#bfdbfe'  // Very light blue - 5th place
];

export default function WorldMap({ countryData }: WorldMapProps) {
  const [svgContent, setSvgContent] = useState<string>('');

  const { topCountries, countryColorMap } = useMemo(() => {
    const sortedCountries = [...countryData]
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);
    const colorMap: { [key: string]: string } = {};
    sortedCountries.forEach((country, index) => {
      colorMap[country.countryCode] = TOP_COUNTRY_COLORS[index];
    });
    return {
      topCountries: sortedCountries,
      countryColorMap: colorMap
    };
  }, [countryData]);

  useEffect(() => {
    fetch('/admin/World.svg')
      .then(response => response.text())
      .then(content => {
        setSvgContent(content);
      });
  }, []);

  useEffect(() => {
    if (!svgContent) return;
    const timer = setTimeout(() => {
      const countryPaths = document.querySelectorAll('#world-map path[data-country]');
      countryPaths.forEach((path) => {
        const pathElement = path as SVGPathElement;
        const countryCode = pathElement.getAttribute('data-country');
        if (countryCode && countryColorMap[countryCode]) {
          pathElement.style.fill = countryColorMap[countryCode];
          pathElement.style.stroke = '#1e293b';
          pathElement.style.strokeWidth = '1';
        } else {
          pathElement.style.fill = '#CCCCCC';
          pathElement.style.stroke = 'white';
          pathElement.style.strokeWidth = '0.5';
        }
        pathElement.style.transition = 'fill 0.3s';
        pathElement.style.cursor = 'default';
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [svgContent, countryColorMap]);

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-lg overflow-auto relative flex-1">
        <div className="flex flex-col justify-start items-center h-[calc(100%-80px)]">
          {svgContent ? (
            <div
              id="world-map"
              className="w-full h-full"
              style={{ width: '100%', height: '100%', maxHeight: 'calc(100% - 80px)' }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading world map...
            </div>
          )}
        </div>
        <div className="px-10 -mt-32">
          <h3 className="text-[36px] font-semibold font-darker-grotesque tracking-wider leading-10">The Top 5</h3>
          {topCountries.length > 0 ? (
            <div className="flex flex-col">
              <div className="flex items-center space-x-4">
                {topCountries.slice(0, 5).map((country, index) => (
                  <div key={country.countryCode} className="flex items-center">
                    <span className="text-[20px] font-regular font-darker-grotesque tracking-wider">
                      {countryCodeToName[country.countryCode] || country.countryCode}
                    </span>
                    {index < 4 && <span className="text-gray-300 ml-3">|</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No order data available</div>
          )}
        </div>
      </div>
    </div>
  );
}