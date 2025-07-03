"use client";

import { updateReturnStatus } from "@/app/lib/actions/returns";
import { useRouter } from "next/navigation";
import { ReturnStatus } from "@/app/lib/types";

interface ReturnStatusFormProps {
  returnId: string;
  currentStatus: ReturnStatus;
}

export default function ReturnStatusForm({
  returnId,
  currentStatus,
}: ReturnStatusFormProps) {
  const router = useRouter();

  const handleStatusUpdate = async (formData: FormData) => {
    const newStatus = formData.get("status") as ReturnStatus;
    await updateReturnStatus(returnId, newStatus);
    router.refresh();
  };

  return (
    <div>
      <h2 className="text-2xl font-medium mb-4">Status</h2>
      <div className="space-y-4">
        <form action={handleStatusUpdate}>
          <select
            name="status"
            defaultValue={currentStatus}
            className="p-2 rounded-md border-none appearance-none focus:outline-none bg-gray-100 w-full"
          >
            <option value={ReturnStatus.PENDING}>Pending</option>
            <option value={ReturnStatus.APPROVED}>Approved</option>
            <option value={ReturnStatus.REJECTED}>Rejected</option>
            <option value={ReturnStatus.COMPLETED}>Completed</option>
          </select>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Status
          </button>
        </form>
      </div>
    </div>
  );
}
