import React from 'react';

type SizeColumn = 'Size' | 'US' | 'AUS' | 'UK' | 'EU' | 'Cup Size' | 'Bust' | 'Waist' | 'Hips';

interface SizeTableProps {
    columns: SizeColumn[];
    data: Partial<Record<SizeColumn, string | number>>[];
    title?: string;
}

export default function SizeTable({ columns, data, title }: SizeTableProps) {
    return (
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 mt-6 sm:mt-8 md:mt-10">
            {title && (
                <h3 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-darker-grotesque tracking-wider font-semibold mb-2">
                    {title}
                </h3>
            )}
            <div className="overflow-x-auto border-2 border-[#DADEE0]">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b-2 border-[#DADEE0]">
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className={`px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[26px] font-darker-grotesque tracking-wider font-semibold w-1/${columns.length}`}
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="h-4 sm:h-5 md:h-6"></tr>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column) => (
                                    <td
                                        key={`${rowIndex}-${column}`}
                                        className={`px-2 sm:px-3 md:px-4 lg:px-6 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[26px] font-darker-grotesque tracking-wider font-regular text-center w-1/${columns.length}`}
                                    >
                                        {row[column] ?? '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr className="h-4 sm:h-5 md:h-6"></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
} 