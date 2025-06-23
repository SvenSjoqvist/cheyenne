"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { createUrl } from '@/app/lib/utils';

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();   
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLFormElement;
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }
    router.push(createUrl("/search", newParams));
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        type="button"
        className="py-2.5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Search"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M19.361 18.217l-4.76-4.95a8.049 8.049 0 001.894-5.192C16.495 3.623 12.873 0 8.42 0 3.968 0 .345 3.623.345 8.075c0 4.453 3.623 8.075 8.075 8.075a8.01 8.01 0 004.957-1.725l4.797 4.988c.158.164.37.255.593.255a.831.831 0 00.594-.255.84.84 0 000-1.196zM8.42 14.465a6.396 6.396 0 01-6.39-6.39 6.397 6.397 0 016.39-6.39 6.397 6.397 0 016.39 6.39 6.396 6.396 0 01-6.39 6.39z" 
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Full Width Search Bar */}
      {isExpanded && (
        <div className="absolute top-[75px] left-0 right-0 w-screen -ml-5 -mr-5 max-[1004px]:-ml-5 max-[1004px]:-mr-5 lg:-ml-8 lg:-mr-8 bg-neutral-100 border-b border-zinc-300 shadow-md z-50" ref={searchRef}>
          <form onSubmit={handleSubmit} className="w-full py-4 px-2">
            <div className="relative w-full mx-auto">
              <input
                type="text"
                placeholder="Search for products..."
                name="search"
                autoComplete="off"
                className="w-full p-4 pl-12 pr-4 border-2 border-zinc-300 rounded-lg outline-none bg-white text-lg font-darker-grotesque focus:border-black transition-colors"
                defaultValue={searchParams?.get("q") || ""}
                autoFocus
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M19.361 18.217l-4.76-4.95a8.049 8.049 0 001.894-5.192C16.495 3.623 12.873 0 8.42 0 3.968 0 .345 3.623.345 8.075c0 4.453 3.623 8.075 8.075 8.075a8.01 8.01 0 004.957-1.725l4.797 4.988c.158.164.37.255.593.255a.831.831 0 00.594-.255.84.84 0 000-1.196zM8.42 14.465a6.396 6.396 0 01-6.39-6.39 6.397 6.397 0 016.39-6.39 6.397 6.397 0 016.39 6.39 6.396 6.396 0 01-6.39 6.39z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                aria-label="Close search"
              >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
