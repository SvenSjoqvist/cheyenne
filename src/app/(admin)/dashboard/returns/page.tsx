"use client";
import { useEffect, useState } from "react";
import { getReturns, updateReturnStatus } from "@/app/lib/actions/returns";
import { useDashboard } from "@/app/components/admin/DashboardContext";
import DataTable from "@/app/components/admin/DataTable";
import { Return } from "@/app/lib/types/returns";

type StatusUpdateEvent = CustomEvent<{
  returnId: string;
  newStatus: Return["status"];
}>;

export default function ReturnsPage() {
  const { refreshData } = useDashboard();
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const data = await getReturns();
        setReturns(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching returns:', error);
        setError('Failed to load returns');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  useEffect(() => {
    const handleStatusUpdate = async (event: Event) => {
      const customEvent = event as StatusUpdateEvent;
      const { returnId, newStatus } = customEvent.detail;
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

    window.addEventListener('statusUpdate', handleStatusUpdate);
    return () => {
      window.removeEventListener('statusUpdate', handleStatusUpdate);
    };
  }, [returns, refreshData]);

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

        <DataTable
          data={returns.map(returnRequest => ({ node: returnRequest }))}
          hasNextPage={false}
          endCursor=""
          baseUrl="/dashboard/returns"
          type="returns"
        />
      </div>
    </div>
  );
} 