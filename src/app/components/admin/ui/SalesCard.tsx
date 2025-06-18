export default function SalesCard({title, value}: {title: string, value: string}) {
  return (
    <div className="bg-white rounded-3xl border-2 border-[#DADEE0] p-4 w-full">
      <h2 className="text-[26px] font-semibold text-[#212121] tracking-wider font-darker-grotesque">{title}</h2>
      <p className="text-[48px] font-semibold text-[#212121] tracking-wider font-darker-grotesque leading-12">{value}</p>
    </div>
  );
}