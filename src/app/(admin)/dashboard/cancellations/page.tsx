import { Suspense } from "react";
import { getCancelledOrders } from "@/app/lib/shopify/admin/shopify-admin";
import CancellationsWrapper from "@/app/components/admin/cancellations/CancellationsWrapper";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  };

export default async function CancellationsPage({ searchParams }: Props) {
    const params = await searchParams;
    const ids = typeof params.ids === 'string' ? params.ids : undefined;
  const { orders } = await getCancelledOrders(10, ids);

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Cancellations</h1>
        </div>

        <Suspense fallback={<div>Loading cancellations...</div>}>
          <CancellationsWrapper
            cancellations={orders}
            maxSelection={5}
          />
        </Suspense>
      </div>
    </div>
  );
}