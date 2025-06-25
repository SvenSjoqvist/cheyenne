import Link from "next/link";

const SizeGuide: React.FC = () => {
  return (
    <div className="fixed bottom-0 right-0 w-24 h-24 text-lg font-regular tracking-wider leading-5 text-white flex items-center justify-center text-center rounded-tl-lg bg-neutral-800 z-10">
      <Link className="overflow-y-hidden" href="/size-guide">
        size & fit guide
      </Link>
    </div>
  );
};

export default SizeGuide;
