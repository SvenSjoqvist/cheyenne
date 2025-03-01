"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { createUrl } from '../lib/utils';

export default function SearchBar () {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();   
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement
    const search = val.search as HTMLFormElement
    const newParams = new URLSearchParams(searchParams.toString())

    console.log(newParams);
    
    if (search.value) {
        newParams.set('q', search.value);
    } else {
        newParams.delete('q');
    }
    router.push(createUrl("/search", newParams));
  };

  return (
    <div className="relative">
      <form 
        onSubmit={handleSubmit}
        className="flex items-center"
      >
        <div 
          className={`flex items-center bg-neutral-100 transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-64 border rounded-lg' : 'w-10'
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => !searchTerm && setIsExpanded(false)}
        >
          <button
            type="submit"
            className="p-2 hover:text-gray-600 transition-colors"
            onClick={() => setIsExpanded(true)}
            aria-label="Search"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 20 20" 
              fill="none" 
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M19.361 18.217l-4.76-4.95a8.049 8.049 0 001.894-5.192C16.495 3.623 12.873 0 8.42 0 3.968 0 .345 3.623.345 8.075c0 4.453 3.623 8.075 8.075 8.075a8.01 8.01 0 004.957-1.725l4.797 4.988c.158.164.37.255.593.255a.831.831 0 00.594-.255.84.84 0 000-1.196zM8.42 14.465a6.396 6.396 0 01-6.39-6.39 6.397 6.397 0 016.39-6.39 6.397 6.397 0 016.39 6.39 6.396 6.396 0 01-6.39 6.39z" 
                fill="currentColor"
              />
            </svg>
          </button>
          
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            name="search"
            autoComplete="off"
            className={`outline-none bg-transparent transition-all duration-300 ${
              isExpanded ? 'w-full px-2 py-1' : 'w-0 p-0'
            }`}
            defaultValue={searchParams?.get("q") || ""}
            onFocus={() => setIsExpanded(true)}
          />
        </div>
      </form>
    </div>
  );
};
