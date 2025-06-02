import React, { Suspense } from "react";
import ProductGrid from "@/app/components/client/product/ProductGrid";
import { getProducts } from "@/app/lib/shopify";
import { getCookies } from "@/app/components/client/account/actions";

const BikiniBoutique: React.FC = async () => {
  const topProducts = await getProducts({ query: "" });
  const hasCookie = await getCookies({ cookieName: "customerAccessToken" });

  if (topProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-5xl font-bold font-[bero]">new collection</h1>
        <h2 className="text-2xl font-bold font-[bero] mt-2">
          dropping soon...
        </h2>
        <h3 className="text-xl font-light font-darker-grotesque mt-2">
          only for members, limited stock.
        </h3>
        <div className="flex flex-col items-center justify-center mt-4">
          {!hasCookie ? (
            <button className="text-black py-2 rounded-md cursor-pointer">
              <span className="underline underline-offset-5 my-2">Sign up</span>{" "}
              for early access
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden flex-col bg-white pb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductGrid products={topProducts} />
      </Suspense>
    </div>
  );
};

export default BikiniBoutique;