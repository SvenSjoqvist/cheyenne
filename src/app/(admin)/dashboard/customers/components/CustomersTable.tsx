'use client';

import { ShopifyCustomer } from '@/app/lib/shopify/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CustomersTableProps {
  customers: Array<{
    node: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      createdAt: string;
      orders: {
        edges: Array<{
          node: {
            totalPriceSet: {
              shopMoney: {
                amount: string;
                currencyCode: string;
              };
            };
          };
        }>;
      };
    };
  }>;
  hasNextPage: boolean;
  endCursor: string;
}

export default function CustomersTable({ customers, hasNextPage, endCursor }: CustomersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const MAX_SELECTION = 1;

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor', endCursor);
    router.push(`/dashboard/customers?${params.toString()}`);
  };

  const handleViewSelected = () => {
    const selectedIds = Array.from(selectedCustomers).map(id => id.split('/').pop() || id);
    router.push(`/dashboard/customers/view?ids=${selectedIds.join(',')}`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = customers.map(({ node }) => node.id);
      setSelectedCustomers(new Set(allIds.slice(0, MAX_SELECTION)));
    } else {
      setSelectedCustomers(new Set());
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      if (newSelected.size < MAX_SELECTION) {
        newSelected.add(customerId);
      }
    } else {
      newSelected.delete(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const isAllSelected = customers.length > 0 && customers.every(
    ({ node }) => selectedCustomers.has(node.id)
  );

  const hasSelectedCustomers = selectedCustomers.size > 0;
  const canSelectMore = selectedCustomers.size < MAX_SELECTION;

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
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Id</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">First Name</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Last Name</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Email</th>
              <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(({ node }) => {
              const numericId = node.id.split('/').pop() || node.id;
              const customer: ShopifyCustomer = {
                id: numericId,
                firstName: node.firstName,
                lastName: node.lastName,
                email: node.email,
                createdAt: node.createdAt,
                orders: node.orders
              };
              
              return (
                <tr key={node.id} className="border border-[#DADEE0] rounded-2xl">
                  <td className="p-4 rounded-l-2xl">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.has(node.id)}
                        onChange={(e) => handleSelectCustomer(node.id, e.target.checked)}
                        disabled={!selectedCustomers.has(node.id) && !canSelectMore}
                        className={`cursor-pointer h-6.5 w-6.5 rounded-md appearance-none border-2 border-black bg-white checked:bg-white checked:border-black relative checked:after:content-['✕'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-black checked:after:font-bold checked:after:text-lg ${
                          !selectedCustomers.has(node.id) && !canSelectMore ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-center">{numericId}</td>
                  <td className="p-4 text-center">{customer.firstName}</td>
                  <td className="p-4 text-center">{customer.lastName}</td>
                  <td className="p-4 text-center">{customer.email}</td>
                  <td className="p-4 text-center rounded-r-2xl">{node.phone || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end gap-4 items-center">
        {hasSelectedCustomers && (
          <span className="text-sm text-gray-600">
            {selectedCustomers.size} of {MAX_SELECTION} customers selected
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
          disabled={!hasSelectedCustomers}
          className={`inline-flex items-center px-4 py-2 border-2 border-black rounded-xl text-sm font-medium transition-colors duration-200 font-darker-grotesque ${
            hasSelectedCustomers 
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