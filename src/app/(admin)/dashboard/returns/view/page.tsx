"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { getReturns, updateReturnStatus } from "@/app/lib/actions/returns";
import { useDashboard } from "@/app/components/admin/DashboardContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

function ReturnViewContent() {
  const searchParams = useSearchParams();
  const { refreshData } = useDashboard();
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const data = await getReturns();
        const selectedIds = searchParams.get('ids')?.split(',') || [];
        const filteredReturns = data.filter(returnRequest => 
          selectedIds.includes(returnRequest.id)
        );
        setReturns(filteredReturns);
      } catch (error) {
        console.error('Error fetching returns:', error);
        setError('Failed to load returns');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [searchParams]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading return details...</p>
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
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Return Details</h1>
        </div>

        <div className="space-y-6">
          {returns.map((returnRequest) => (
            <div key={returnRequest.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-medium mb-4">Return Information</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Return ID:</span> {returnRequest.id}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Customer ID:</span> {returnRequest.customerId.split('/').pop()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Order ID:</span>{' '}
                      <Link 
                        href={`/dashboard/orders/${returnRequest.orderId.split('/').pop()?.split('?')[0]}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {returnRequest.orderId.split('/').pop()?.split('?')[0]}
                      </Link>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Customer Email:</span>{' '}
                      <a href={`mailto:${returnRequest.customerEmail}`} className="text-blue-600 hover:text-blue-800">
                        {returnRequest.customerEmail}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Requested On:</span>{' '}
                      {new Date(returnRequest.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(returnRequest.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-medium mb-4">Status</h2>
                  <div className="space-y-4">
                    <select
                      value={returnRequest.status}
                      onChange={(e) => handleStatusUpdate(returnRequest.id, e.target.value as Return["status"])}
                      className="p-2 rounded-md border-none appearance-none focus:outline-none bg-gray-100 w-full"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-medium mb-4">Items to Return</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {returnRequest.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {returnRequest.additionalNotes && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h2 className="text-2xl font-medium mb-4">Additional Notes</h2>
                  <p className="text-gray-600">{returnRequest.additionalNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReturnViewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Loading...</p>
    </div>}>
      <ReturnViewContent />
    </Suspense>
  );
} 