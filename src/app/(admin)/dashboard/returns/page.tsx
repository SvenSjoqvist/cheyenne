"use client";

import { useEffect, useState } from "react";
import { getReturns, updateReturnStatus } from "@/app/lib/actions/returns";
import { useDashboard } from "@/app/components/admin/DashboardContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ReturnItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  returnId: string;
  productName: string;
  variant: string;
  reason: string;
  quantity: number;
};

type Return = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  orderNumber: number;
  customerId: string;
  customerEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  additionalNotes: string | null;
  items: ReturnItem[];
};

export default function ReturnsPage() {
  const { refreshData } = useDashboard();
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReturns, setSelectedReturns] = useState<Set<string>>(new Set());
  const MAX_SELECTION = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const data = await getReturns();
        setReturns(data);
      } catch (error) {
        console.error('Error fetching returns:', error);
        setError('Failed to load returns');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const handleStatusUpdate = async (returnId: string, newStatus: Return["status"]) => {
    try {
      await updateReturnStatus(returnId, newStatus);
      
      setReturns(returns.map(returnRequest => 
        returnRequest.id === returnId 
          ? { ...returnRequest, status: newStatus }
          : returnRequest
      ));
      
      refreshData();
    } catch (error) {
      console.error('Error updating return status:', error);
      setError('Failed to update return status');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = returns.map(returnRequest => returnRequest.id);
      setSelectedReturns(new Set(allIds.slice(0, MAX_SELECTION)));
    } else {
      setSelectedReturns(new Set());
    }
  };

  const handleSelectReturn = (returnId: string, checked: boolean) => {
    const newSelected = new Set(selectedReturns);
    if (checked) {
      if (newSelected.size < MAX_SELECTION) {
        newSelected.add(returnId);
      }
    } else {
      newSelected.delete(returnId);
    }
    setSelectedReturns(newSelected);
  };

  const handleViewSelected = () => {
    const selectedIds = Array.from(selectedReturns);
    router.push(`/dashboard/returns/view?ids=${selectedIds.join(',')}`);
  };

  const isAllSelected = returns.length > 0 && returns.every(
    returnRequest => selectedReturns.has(returnRequest.id)
  );

  const hasSelectedReturns = selectedReturns.size > 0;
  const canSelectMore = selectedReturns.size < MAX_SELECTION;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading returns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Returns</h1>
        </div>

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
                <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Return ID</th>
                <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Customer ID</th>
                <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Order ID</th>
                <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Date</th>
                <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Status</th>
                <th className="p-4 text-[26px] font-semibold font-darker-grotesque text-[#212121]">Reason</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((returnRequest) => (
                <tr key={returnRequest.id} className="border border-[#DADEE0] rounded-2xl">
                  <td className="p-4 rounded-l-2xl">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedReturns.has(returnRequest.id)}
                        onChange={(e) => handleSelectReturn(returnRequest.id, e.target.checked)}
                        disabled={!selectedReturns.has(returnRequest.id) && !canSelectMore}
                        className={`cursor-pointer h-6.5 w-6.5 rounded-md appearance-none border-2 border-black bg-white checked:bg-white checked:border-black relative checked:after:content-['✕'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-black checked:after:font-bold checked:after:text-lg ${
                          !selectedReturns.has(returnRequest.id) && !canSelectMore ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {returnRequest.id}
                  </td>
                  <td className="p-4 text-center">
                    {returnRequest.customerId.split('/').pop() || '-'}
                  </td>
                  <td className="p-4 text-center">
                    <Link 
                      href={`/dashboard/orders/${returnRequest.orderId.split('/').pop()?.split('?')[0]}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {returnRequest.orderId.split('/').pop()?.split('?')[0]}
                    </Link>
                  </td>
                  <td className="p-4 text-center">
                    {new Date(returnRequest.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={returnRequest.status}
                      onChange={(e) => handleStatusUpdate(returnRequest.id, e.target.value as Return["status"])}
                      className="p-2  rounded-md border-none appearance-none focus:outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="p-4 text-center rounded-r-2xl">
                    {returnRequest.items[0]?.reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-4 items-center">
          {hasSelectedReturns && (
            <span className="text-sm text-gray-600">
              {selectedReturns.size} of {MAX_SELECTION} returns selected
            </span>
          )}
          <button
            onClick={handleViewSelected}
            disabled={!hasSelectedReturns}
            className={`inline-flex items-center px-4 py-2 border-2 border-black rounded-xl text-sm font-medium transition-colors duration-200 font-darker-grotesque ${
              hasSelectedReturns 
                ? 'text-black bg-white hover:bg-black hover:text-white cursor-pointer' 
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            }`}
          >
            View Selected
          </button>
        </div>
      </div>
    </div>
  );
} 