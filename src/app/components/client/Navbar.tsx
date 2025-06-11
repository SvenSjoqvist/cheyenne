'use client';

import Link from "next/link";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import SearchBar from "./Search";
import CartModal from "./cart/modal";
import OpenForm from "./account/open-form";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { title: "Catalog", path: "/catalog" },
    { title: "Collection Journal", path: "/collection-journal" },
    { title: "About", path: "/about" },
    { title: "Size & Fit", path: "/size-guide" },
  ];

  return (
    <nav className="p-8 w-full border-b bg-neutral-100 border-zinc-300 max-[1004px]:px-5">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-between items-center w-full max-[1004px]:flex-col max-[1004px]:gap-8 relative">
          {/* Mobile Layout Container */}
          <div className="flex items-center justify-between w-full lg:hidden">
            {/* Left Section: Hamburger and Search */}
            <div className="flex items-center gap-4">
              <button
                className="p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              <Suspense fallback={<div>Loading search...</div>}>
                <SearchBar isMenuOpen={isMenuOpen} />
              </Suspense>
            </div>

            {/* Center: Logo */}
            <Link href={"/"} className="mx-4">
              <Image
                loading="lazy"
                src={"/logo.svg"}
                width={100}
                height={100}
                alt="Company logo"
                className="object-contain w-[150px]"
              />
            </Link>

            {/* Right Section: Account and Cart */}
            <div className="flex items-center gap-4">
              <OpenForm />
              <CartModal />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex gap-4 md:gap-8 flex-nowrap max-[1004px]:justify-center max-[1004px]:w-full">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="hover:underline text-base font-darker-grotesque tracking-wider leading-none overflow-y-hidden text-black flex-shrink-0 py-1 font-medium"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed top-[160px] left-0 right-0 w-full bg-neutral-100 border-b border-zinc-300 shadow-md z-50">
              <div className="w-full max-w-[100vw] px-4 py-3">
                <div className="flex flex-col gap-4">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.path}
                      className="hover:underline text-base font-darker-grotesque tracking-wider leading-none text-black py-3 font-medium border-b border-zinc-200 last:border-b-0"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Logo - Desktop Only */}
          <Link href={"/"} className="my-2 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 z-10 hidden lg:block">
            <Image
              loading="lazy"
              src={"/logo.svg"}
              width={100}
              height={100}
              alt="Company logo"
              className="object-contain w-[190px]"
            />
          </Link>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-4 md:gap-8">
            <Suspense fallback={<div>Loading search...</div>}>
              <SearchBar />
            </Suspense>
            <OpenForm />
            <div className="flex items-center">
              <Image
                src="/icons/money.svg"
                alt="Cart"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <CartModal />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
