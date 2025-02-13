import React, { Suspense } from "react";
import Collections from "@/app/components/layout/search/collections";
import FilterList from "@/app/components/layout/search/filter";
import { sorting } from "@/app/lib/constants";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
        {/* Wrap Collections in Suspense */}
        <div className="order-first w-full flex-none md:max-w-[125px]">
          <Suspense fallback={<div>Loading Collections...</div>}>
            <Collections />
          </Suspense>
        </div>

        {/* Wrap children in Suspense if they use client-side features */}
        <div className="order-last min-h-screen w-full md:order-none">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </div>

        {/* Wrap FilterList in Suspense */}
        <div className="order-none flex-none md:order-last md:w-[125px]">
          <Suspense fallback={<div>Loading Filters...</div>}>
            <FilterList list={sorting} title="Sort by" />
          </Suspense>
        </div>
      </div>
    </>
  );
}