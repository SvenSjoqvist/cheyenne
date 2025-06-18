import React from 'react';

interface CustomerDetailsCardProps {
  title: string;
  data: {
    label: string;
    value: string | number;
  }[];
  bgColor?: 'white' | 'black';
}

export default function CustomerDetailsCard({data, bgColor = 'white' }: CustomerDetailsCardProps) {
  const isDark = bgColor === 'black';
  const textColor = isDark ? 'text-white' : 'text-black';
  const labelColor = isDark ? 'text-white' : 'text-[#212121]';
  const borderClass = isDark ? '' : 'border-2 border-[#E0E0E0]';

  return (
    <div className={`h-auto w-full ${borderClass} rounded-2xl ${isDark ? 'bg-[#212121]' : 'bg-[#F7F7F7]'}`}>
      <table className='w-full h-full'>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className={`${labelColor} font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px] py-2 sm:py-3 lg:py-4 px-2 sm:px-3 md:px-6 border-r-2 border-[#E0E0E0] w-1/2`}>
                {item.label}
              </td>
              <td className={`${textColor} text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque py-2 sm:py-3 lg:py-4 px-2 sm:px-3 md:px-6 w-1/2`}>
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 