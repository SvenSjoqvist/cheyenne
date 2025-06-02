'use client';

import { ShopifyOrder } from '@/app/lib/shopify/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { formatCurrency } from '@/app/lib/utils';

interface OrdersTableProps {
  orders: Array<{
    node: ShopifyOrder;
  }>;
  hasNextPage: boolean;
  endCursor: string;
}

export default function OrdersTable({ orders, hasNextPage, endCursor }: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const MAX_SELECTION = 1;

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor', endCursor);
    router.push(`/dashboard/orders?${params.toString()}`);
  };

  const handleViewSelected = () => {
    const selectedIds = Array.from(selectedOrders).map(id => id.split('/').pop() || id);
    router.push(`/dashboard/orders/${selectedIds[0]}`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = orders.map(({ node }) => node.id);
      setSelectedOrders(new Set(allIds.slice(0, MAX_SELECTION)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      if (newSelected.size < MAX_SELECTION) {
        newSelected.add(orderId);
      }
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const isAllSelected = orders.length > 0 && orders.every(
    ({ node }) => selectedOrders.has(node.id)
  );

  const hasSelectedOrders = selectedOrders.size > 0;
  const canSelectMore = selectedOrders.size < MAX_SELECTION;

  return (
    <>
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
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">OrderID</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">CustomerID</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Date</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Total</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ node: order }) => {
              const orderId = order.id.split('/').pop() || order.id;
              const customerId = order.customer?.id ? order.customer.id.split('/').pop() : 'Guest';
              
              return (
                <tr key={order.id} className="border border-[#DADEE0] rounded-2xl">
                  <td className="p-4 rounded-l-2xl">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.has(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        disabled={!selectedOrders.has(order.id) && !canSelectMore}
                        className={`cursor-pointer h-6.5 w-6.5 rounded-md appearance-none border-2 border-black bg-white checked:bg-white checked:border-black relative checked:after:content-['✕'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-black checked:after:font-bold checked:after:text-lg ${
                          !selectedOrders.has(order.id) && !canSelectMore ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-center">{orderId}</td>
                  <td className="p-4 text-center">{customerId}</td>
                  <td className="p-4 text-center">{new Date(order.createdAt).toISOString().split('T')[0]}</td>
                  <td className="p-4 text-center">
                    {formatCurrency(order.totalPriceSet.shopMoney.amount, order.totalPriceSet.shopMoney.currencyCode)}
                  </td>
                  <td className="p-4 text-center rounded-r-2xl">{order.displayFulfillmentStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end gap-4 items-center">
        {hasSelectedOrders && (
          <span className="text-sm text-gray-600">
            {selectedOrders.size} of {MAX_SELECTION} orders selected
          </span>
        )}
        {hasNextPage && (
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center px-4 py-2 border-2 border-black rounded-xl text-sm font-medium text-black bg-white hover:bg-black hover:text-white transition-colors duration-200 font-darker-grotesque"
          >
            Load More
          </button>
        )}
        <button
          onClick={handleViewSelected}
          disabled={!hasSelectedOrders}
          className={`inline-flex items-center px-4 py-2 border-2 border-black rounded-xl text-sm font-medium transition-colors duration-200 font-darker-grotesque ${
            hasSelectedOrders 
              ? 'text-black bg-white hover:bg-black hover:text-white cursor-pointer' 
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        >
          View Selected
        </button>
      </div>
    </>
  );
} 