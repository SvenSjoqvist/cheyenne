import { getOrders } from "@/app/lib/shopify/admin/shopify-admin";
import DataTable from "@/app/components/admin/DataTable";
import { OrderData } from "@/app/components/admin/types";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = typeof params.cursor === "string" ? params.cursor : undefined;
  const searchQuery = typeof params.search === "string" ? params.search : "";
  const dateFilter = typeof params.date === "string" ? params.date : "";

  const orders = await getOrders(10, cursor, searchQuery, dateFilter);

  // Transform the orders to match OrderData type
  const transformedOrders = orders.edges.map((edge) => ({
    node: {
      id: edge.node.id,
      name: edge.node.name,
      orderNumber: edge.node.name,
      customer: edge.node.customer
        ? {
            id: edge.node.customer.id,
            firstName: edge.node.customer.firstName || "",
            lastName: edge.node.customer.lastName || "",
            email: edge.node.customer.email || "",
            phone: edge.node.customer.phone || "",
          }
        : null,
      totalPriceSet: edge.node.totalPriceSet,
      createdAt: new Date(edge.node.createdAt),
      displayFulfillmentStatus: edge.node.displayFulfillmentStatus,
      displayFinancialStatus: edge.node.displayFinancialStatus || "",
      billingAddress: edge.node.billingAddress || null,
      shippingAddress: edge.node.shippingAddress || null,
      discountApplications: { edges: [] },
      shippingLine: null,
      paymentGatewayNames: [],
      fulfillments: [],
    } as OrderData,
  }));

  return (
    <div className="pt-16 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-7">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">
            Orders
          </h1>
          <form action="/dashboard/orders" method="GET" className="flex gap-2">
            <input
              type="text"
              name="search"
              placeholder="Search orders"
              defaultValue={searchQuery}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="date"
              defaultValue={dateFilter}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
            {(searchQuery || dateFilter) && (
              <a
                href="/dashboard/orders"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear
              </a>
            )}
          </form>
        </div>
        <DataTable
          data={transformedOrders}
          hasNextPage={orders.pageInfo.hasNextPage}
          endCursor={orders.pageInfo.endCursor}
          baseUrl="/dashboard/orders"
          type="orders"
        />
      </div>
    </div>
  );
}
