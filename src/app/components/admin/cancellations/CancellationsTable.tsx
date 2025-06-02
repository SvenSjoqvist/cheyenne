"use client";

import { useState } from "react";
import Link from "next/link";

type CancelledOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  createdAt: Date;
  cancelledAt: Date;
  reason: string;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
};

type CancellationsTableProps = {
  cancellations: CancelledOrder[];
  onSelectionChange: (selectedIds: Set<string>) => void;
  selectedCancellations: Set<string>;
  maxSelection: number;
};

export default function CancellationsTable({
  cancellations,
  onSelectionChange,
  selectedCancellations,
  maxSelection,
}: CancellationsTableProps) {
  const [error] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = cancellations.map(order => order.id);
      onSelectionChange(new Set(allIds.slice(0, maxSelection)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectCancellation = (cancellationId: string, checked: boolean) => {
    const newSelected = new Set(selectedCancellations);
    if (checked) {
      if (newSelected.size < maxSelection) {
        newSelected.add(cancellationId);
      }
    } else {
      newSelected.delete(cancellationId);
    }
    onSelectionChange(newSelected);
  };

  const isAllSelected = cancellations.length > 0 && cancellations.every(
    order => selectedCancellations.has(order.id)
  );

  const canSelectMore = selectedCancellations.size < maxSelection;

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#DADEE0]">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#DADEE0]">
              <th className="p-4">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="cursor-pointer h-6.5 w-6.5 rounded-md appearance-none border-2 border-black bg-white checked:bg-white checked:border-black relative checked:after:content-['✕'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-black checked:after:font-bold checked:after:text-lg" 
                />
              </th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Order ID</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Customer ID</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Date</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Amount</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Status</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Reason</th>
            </tr>
          </thead>
          <tbody>
            {cancellations.map((order) => (
              <tr key={order.id} className="border border-[#DADEE0] rounded-2xl">
                <td className="p-4 rounded-l-2xl">
                  <div className="flex justify-center">
                    <input 
                      type="checkbox" 
                      checked={selectedCancellations.has(order.id)}
                      onChange={(e) => handleSelectCancellation(order.id, e.target.checked)}
                      disabled={!selectedCancellations.has(order.id) && !canSelectMore}
                      className={`cursor-pointer h-6.5 w-6.5 rounded-md appearance-none border-2 border-black bg-white checked:bg-white checked:border-black relative checked:after:content-['✕'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-black checked:after:font-bold checked:after:text-lg ${
                        !selectedCancellations.has(order.id) && !canSelectMore ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Link 
                    href={`/dashboard/orders/${order.id.split('/').pop()}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {order.id.split('/').pop()}
                  </Link>
                </td>
                <td className="p-4 text-center">
                  {order.customerId.split('/').pop()}
                </td>
                <td className="p-4 text-center">
                  {formatDate(order.cancelledAt)}
                </td>
                <td className="p-4 text-center">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: order.currency
                  }).format(order.totalAmount)}
                </td>
                <td className="p-4 text-center">
                  {order.status}
                </td>
                <td className="p-4 text-center rounded-r-2xl">
                  {order.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
} 