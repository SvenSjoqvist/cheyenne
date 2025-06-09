import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  variant?: 'black' | 'white';
  valueSize?: string;
}

export default function MetricCard({ title, value, variant = 'black', valueSize = 'text-[68px]' }: MetricCardProps) {
  const isDark = variant === 'black';
  const bgColor = isDark ? 'bg-[#212121]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const borderClass = isDark ? '' : 'border-2 border-[#E0E0E0]';

  return (
    <div className={`${bgColor} ${borderClass} w-full h-1/2 rounded-2xl`}>
      <div className='flex flex-col h-full pl-6 justify-center'>
        <p className={`${textColor} font-regular font-darker-grotesque text-[26px] tracking-wider mb-[-25px]`}>{title}</p>
        <p className={`${textColor} ${valueSize} font-semibold font-darker-grotesque`}>{value}</p>
      </div>
    </div>
  );
} 