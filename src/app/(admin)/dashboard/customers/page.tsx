import { getCustomers } from "@/app/lib/shopify/admin/shopify-admin";
import DataTable from "@/app/components/admin/DataTable";
import { CustomerData } from "@/app/components/admin/types";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = typeof params.cursor === "string" ? params.cursor : undefined;
  const searchQuery = typeof params.search === "string" ? params.search : "";
  const dateFilter = typeof params.date === "string" ? params.date : "";

  const data = await getCustomers(10, cursor, searchQuery, dateFilter);
  const { customers } = data;

  // Transform to match exactly what DataTable needs
  const transformedData = customers.edges.map((edge) => ({
    node: {
      id: edge.node.id,
      firstName: edge.node.firstName || "",
      lastName: edge.node.lastName || "",
      email: edge.node.email || "",
      phone: edge.node.phone || "-",
      amountSpent: edge.node.amountSpent,
    } as CustomerData,
  }));

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">
            Customers
          </h1>
          <form
            action="/dashboard/customers"
            method="GET"
            className="flex gap-2"
          >
            <input
              type="text"
              name="search"
              placeholder="Search customers"
              defaultValue={searchQuery}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
            {(searchQuery || dateFilter) && (
              <Link
                href="/dashboard/customers"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
        <DataTable
          data={transformedData}
          hasNextPage={customers.pageInfo.hasNextPage}
          endCursor={customers.pageInfo.endCursor}
          baseUrl="/dashboard/customers"
          type="customers"
        />
      </div>
    </div>
  );
}
