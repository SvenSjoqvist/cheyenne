'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from "@/app/lib/utils";
import { TableData, Column, DataTableProps, CustomerData, CancellationData } from './types';
import React from 'react';

export default function DataTable<T extends TableData>({ 
  data, 
  hasNextPage, 
  endCursor, 
  baseUrl,
  type,
  hideActions = false,
  customColumns,
}: DataTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor', endCursor);
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const getColumns = (): Column<T>[] => {
    if (customColumns) return customColumns;

    switch (type) {
      case 'orders':
        return [
          { header: 'OrderID', accessor: 'id' as keyof T },
          { header: 'CustomerID', accessor: 'customer' as keyof T },
          { header: 'Total Price', accessor: 'totalPriceSet' as keyof T },
          { header: 'Date', accessor: 'createdAt' as keyof T },
          { header: 'Status', accessor: 'displayFulfillmentStatus' as keyof T }
        ] as Column<T>[];
      case 'customers':
        return [
          { header: 'CustomerID', accessor: 'id' as keyof T },
          { header: 'Name', accessor: 'firstName' as keyof T },
          { header: 'Email', accessor: 'email' as keyof T },
          { header: 'Phone', accessor: 'phone' as keyof T },
          { header: 'Total Spent', accessor: 'orders' as keyof T }
        ] as Column<T>[];
      case 'cancellations':
        return [
          { header: 'OrderID', accessor: 'orderNumber' as keyof T },
          { header: 'CustomerID', accessor: 'customerId' as keyof T },
          { header: 'Total Price', accessor: 'totalAmount' as keyof T },
          { header: 'Date', accessor: 'createdAt' as keyof T },
          { header: 'Status', accessor: 'status' as keyof T }
        ] as Column<T>[];
      case 'returns':
        return [
          { header: 'Return ID', accessor: 'id' as keyof T },
          { header: 'Customer ID', accessor: 'customerId' as keyof T },
          { header: 'Order ID', accessor: 'orderId' as keyof T },
          { header: 'Date', accessor: 'createdAt' as keyof T },
          { header: 'Status', accessor: 'status' as keyof T },
          { header: 'Reason', accessor: 'items' as keyof T }
        ] as Column<T>[];
      case 'products':
        return [
          { header: 'SKU', accessor: 'sku' as keyof T },
          { header: 'Name', accessor: 'title' as keyof T },
          { header: 'Description', accessor: 'description' as keyof T },
          { header: 'Quantity', accessor: 'totalInventory' as keyof T },
          { header: 'Category', accessor: 'category' as keyof T },
          { header: 'Status', accessor: 'status' as keyof T }
        ] as Column<T>[];
    }
  };

  const formatValue = (value: unknown, column: Column<T>, row: T): string | React.ReactElement => {
    if (value === undefined || value === null) return '-';

    switch (type) {
      case 'orders':
        switch (column.accessor) {
          case 'id':
            return String(value).split('/').pop() || String(value);
          case 'customer':
            const customer = value as { id?: string };
            if (!customer?.id) return 'Guest';
            return String(customer.id).split('/').pop() || 'Guest';
          case 'totalPriceSet':
            const priceSet = value as { shopMoney: { amount: string; currencyCode: string } };
            return formatCurrency(priceSet.shopMoney.amount, priceSet.shopMoney.currencyCode);
          case 'createdAt':
            return (value as Date).toISOString().split('T')[0];
          default:
            return String(value);
        }
      case 'customers':
        const customerRow = row as CustomerData;
        switch (column.accessor) {
          case 'id':
            return String(value).split('/').pop() || String(value);
          case 'firstName':
            return `${String(value)} ${customerRow.lastName || ''}`;
          case 'orders':
            const orders = value as { edges?: Array<{ node: { totalPriceSet: { shopMoney: { amount: string } } } }> };
            if (!orders?.edges?.length) return formatCurrency(0, 'USD');
            const total = orders.edges.reduce((sum: number, edge) => {
              const amount = parseFloat(edge.node.totalPriceSet.shopMoney.amount);
              return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            return formatCurrency(total, 'USD');
          default:
            return String(value);
        }
      case 'cancellations':
        const cancellationRow = row as CancellationData;
        switch (column.accessor) {
          case 'customerId':
            if (!value) return '-';
            return String(value).split('/').pop() || '-';
          case 'totalAmount':
            return formatCurrency(value as number, cancellationRow.currency);
          case 'createdAt':
            return (value as Date).toISOString().split('T')[0];
          default:
            return String(value);
        }
      case 'returns':
        switch (column.accessor) {
          case 'customerId':
          case 'orderId':
            if (!value) return '-';
            return String(value).split('/').pop()?.split('?')[0] || '-';
          case 'createdAt':
            return (value as Date).toLocaleDateString();
          case 'items':
            const items = value as Array<{ reason?: string }>;
            return items?.[0]?.reason || '-';
          default:
            return String(value);
        }
      case 'products':
        switch (column.accessor) {
          case 'stock':
            const stockStatusStyles = {
              in_stock: 'bg-green-100 text-green-800',
              low_stock: 'bg-yellow-100 text-yellow-800',
              out_of_stock: 'bg-red-100 text-red-800'
            };
            const stockStatusLabels = {
              in_stock: 'In Stock',
              low_stock: 'Low Stock',
              out_of_stock: 'Out of Stock'
            };
            const stockValue = value as keyof typeof stockStatusStyles;
            if (!stockValue || !(stockValue in stockStatusStyles)) return '-';
            const statusLabel = stockStatusLabels[stockValue];
            return (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatusStyles[stockValue]}`}>
                {statusLabel}
              </span>
            );
          case 'description':
            const desc = value as string;
            return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
          default:
            return String(value);
        }
      default:
        return String(value);
    }
  };

  const columns = getColumns();

  return (
    <>
      <div className="mt-4 w-full">
        <div className="overflow-x-auto rounded-2xl border-2 border-[#DADEE0]">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-[#DADEE0]">
              <thead>
                <tr className="border-b-2 border-[#DADEE0]">
                  {columns.map((column) => (
                    <th 
                      key={String(column.accessor)} 
                      className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 text-xs sm:text-sm md:text-base lg:text-[26px] font-semibold font-darker-grotesque text-[#212121] tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                  {!hideActions && (
                    <th className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 text-xs sm:text-sm md:text-base lg:text-[26px] font-semibold font-darker-grotesque text-[#212121]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DADEE0]">
                {data.map(({ node }) => {
                  const id = String(node.id).split('/').pop() || String(node.id);
                  
                  return (
                    <tr key={String(node.id)} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td 
                          key={String(column.accessor)} 
                          className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 text-xs sm:text-sm md:text-base lg:text-lg text-center"
                        >
                          {formatValue(node[column.accessor], column, node)}
                        </td>
                      ))}
                      {!hideActions && (
                        <td className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3">
                          <div className="flex justify-center">
                            <button
                              onClick={() => router.push(`${baseUrl}/${id}`)}
                              className="font-regular text-xs sm:text-sm md:text-base lg:text-[26px] font-darker-grotesque cursor-pointer hover:text-blue-600 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 md:mt-6 flex justify-end gap-2 sm:gap-4 items-center">
        {hasNextPage && (
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border-2 border-black rounded-xl text-xs sm:text-sm font-medium text-black bg-white hover:bg-black hover:text-white transition-colors duration-200 font-darker-grotesque"
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
} 