import { getReturns } from "@/app/lib/actions/returns";
import { getTemplateByName } from "@/app/lib/actions/templates";
import Link from "next/link";
import DataTable from "@/app/components/admin/DataTable";
import ReturnCards from "@/app/components/admin/ui/EditableReturnCards";
import ReturnActionForm from "@/app/components/admin/ui/ReturnActionForm";
import { ReturnData } from "@/app/components/admin/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReturnViewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const returns = await getReturns();
  const returnRequest = returns.find((r) => r.id === resolvedParams.id);

  // Fetch email templates
  const [returnApprovedTemplate, returnDeniedTemplate] = await Promise.all([
    getTemplateByName("return_approved"),
    getTemplateByName("return_denied"),
  ]);

  if (!returnRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Return not found</p>
          <Link
            href="/dashboard/returns"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Returns
          </Link>
        </div>
      </div>
    );
  }

  // Transform return data for DataTable
  const tableData: Array<{ node: ReturnData & { allReasons: string } }> = [
    {
      node: {
        id: returnRequest.id,
        customerId: returnRequest.customerId.split("/").pop() || "",
        orderId: returnRequest.orderId.split("/").pop()?.split("?")[0] || "",
        createdAt: new Date(returnRequest.createdAt),
        status: returnRequest.status,
        items: returnRequest.items.map((item) => ({ reason: item.reason })),
        allReasons: returnRequest.items.map((item) => item.reason).join(", "),
      },
    },
  ];

  // Custom columns for returns
  const customColumns = [
    {
      header: "Return ID",
      accessor: "id" as keyof (ReturnData & { allReasons: string }),
    },
    {
      header: "Customer ID",
      accessor: "customerId" as keyof (ReturnData & { allReasons: string }),
    },
    {
      header: "Order ID",
      accessor: "orderId" as keyof (ReturnData & { allReasons: string }),
    },
    {
      header: "Date",
      accessor: "createdAt" as keyof (ReturnData & { allReasons: string }),
    },
    {
      header: "Status",
      accessor: "status" as keyof (ReturnData & { allReasons: string }),
    },
    {
      header: "Reason",
      accessor: "allReasons" as keyof (ReturnData & { allReasons: string }),
    },
  ];

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">
            Return Details
          </h1>
        </div>

        {/* DataTable */}
        <div className="mb-8">
          <DataTable
            data={tableData}
            hasNextPage={false}
            endCursor=""
            baseUrl="/dashboard/returns"
            type="returns"
            hideActions={true}
            customColumns={customColumns}
          />
        </div>

        {/* Editable Cards */}
        <ReturnCards returnRequest={returnRequest} />

        {/* Return Action Form - Only show for pending returns */}
        {returnRequest.status === "PENDING" && (
          <ReturnActionForm
            returnId={returnRequest.id}
            customerEmail={returnRequest.customerEmail}
            customerName={returnRequest.customerName}
            approvedTemplate={returnApprovedTemplate}
            deniedTemplate={returnDeniedTemplate}
          />
        )}
      </div>
    </div>
  );
}
