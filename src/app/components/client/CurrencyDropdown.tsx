"use client";

import { useState, useEffect } from 'react';

const CURRENCIES = [
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
];

export default function CurrencyDropdown() {
  const [selectedCurrency, setSelectedCurrency] = useState('DKK');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    } else {
      // Try to detect user's location and set appropriate currency
      const detectUserCurrency = async () => {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          // Map common countries to currencies
          const countryToCurrency: { [key: string]: string } = {
            'DK': 'DKK',
            'DE': 'EUR',
            'FR': 'EUR',
            'IT': 'EUR',
            'ES': 'EUR',
            'NL': 'EUR',
            'BE': 'EUR',
            'AT': 'EUR',
            'FI': 'EUR',
            'IE': 'EUR',
            'PT': 'EUR',
            'GR': 'EUR',
            'US': 'USD',
            'GB': 'GBP',
            'SE': 'SEK',
            'NO': 'NOK',
            'AU': 'AUD',
            'CA': 'CAD',
            'CH': 'CHF',
            'JP': 'JPY',
          };
          
          const detectedCurrency = countryToCurrency[data.country_code] || 'DKK';
          setSelectedCurrency(detectedCurrency);
          localStorage.setItem('selectedCurrency', detectedCurrency);
        } catch {
          console.log('Could not detect location, defaulting to DKK');
          setSelectedCurrency('DKK');
          localStorage.setItem('selectedCurrency', 'DKK');
        }
      };

      detectUserCurrency();
    }
  }, []);

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    localStorage.setItem('selectedCurrency', currencyCode);
    setIsOpen(false);
    
    // Optional: Reload the page to update all prices
    // window.location.reload();
  };

  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>{currentCurrency?.symbol}</span>
        <span>{currentCurrency?.code}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedCurrency === currency.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{currency.symbol} {currency.name}</span>
                  {selectedCurrency === currency.code && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 