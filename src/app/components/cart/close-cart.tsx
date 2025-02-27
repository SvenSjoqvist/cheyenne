import Image from "next/image";

export default function CloseCart() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center transition-colors">
      <Image src="/icons/exit.svg" alt="Close" width={20} height={20} />
    </div>
  );
}