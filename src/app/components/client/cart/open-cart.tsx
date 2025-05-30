import Image from "next/image";

export default function OpenCart({
  quantity,
}: {
  quantity?: number;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <Image
        className="cursor-pointer"
        src="/icons/checkout.svg"
        alt="Shopping cart"
        width={28}
        height={28}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}