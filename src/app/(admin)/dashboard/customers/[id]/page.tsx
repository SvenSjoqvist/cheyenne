import { getCustomers } from "@/app/lib/shopify/admin/shopify-admin";
import { getOrders } from "@/app/lib/shopify/admin/shopify-admin";
import { getCustomerRefunds } from "@/app/lib/actions/returns";
import DataTable from "@/app/components/admin/DataTable";
import CustomerDetailsCard from "@/app/components/admin/CustomerDetailsCard";
import MetricCard from "@/app/components/admin/MetricCard";
import {
  Column,
  OrderData,
  CustomerDetailData,
} from "@/app/components/admin/types";
import { ShopifyOrder } from "@/app/lib/shopify/types";

async function getCustomerDetails(
  ids: string[]
): Promise<CustomerDetailData[]> {
  if (ids.length === 0) return [];

  const data = await getCustomers(ids.length, undefined, ids.join(","));
  const customerNodes = data.customers.edges.map((edge) => edge.node);

  const customerDetails = await Promise.all(
    customerNodes.map(async (customer) => {
      // Extract numeric ID from Shopify Global ID
      const numericId = customer.id.split("/").pop() || customer.id;

      // Use numeric ID for querying orders
      const ordersData = await getOrders(10, undefined, numericId);

      // Get refund information
      const refundInfo = await getCustomerRefunds(numericId);

      // Calculate metrics
      const orders = ordersData.edges;
      const totalOrders = orders.length;

      // Calculate average order value
      const totalSpent = orders.reduce(
        (sum: number, order: { node: ShopifyOrder }) => {
          const amount = parseFloat(order.node.totalPriceSet.shopMoney.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        },
        0
      );
      const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

      // Get country from the most recent order's shipping address
      const mostRecentOrder = orders[0]?.node;
      const country =
        mostRecentOrder?.shippingAddress?.country || "No Country Data";

      return {
        id: numericId,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "-",
        amountSpent: {
          amount: totalSpent.toString(),
          currencyCode:
            orders[0]?.node.totalPriceSet.shopMoney.currencyCode || "USD",
        },
        orders: {
          edges: orders.map((edge: { node: ShopifyOrder }) => {
            const totalQuantity =
              edge.node.lineItems?.edges?.reduce(
                (sum: number, item: { node: { quantity: number } }) => {
                  return sum + (item.node.quantity || 0);
                },
                0
              ) || 0;

            return {
              node: {
                id: edge.node.id,
                createdAt: edge.node.createdAt,
                status: edge.node.displayFulfillmentStatus,
                financialStatus: edge.node.displayFinancialStatus,
                name: edge.node.name,
                totalQuantity,
                totalPriceSet: {
                  shopMoney: {
                    amount: edge.node.totalPriceSet.shopMoney.amount,
                    currencyCode:
                      edge.node.totalPriceSet.shopMoney.currencyCode,
                  },
                },
              },
            };
          }),
        },
        refunds: refundInfo,
        metrics: {
          region: country,
          averageOrderValue,
          totalOrders,
        },
      };
    })
  );

  return customerDetails;
}

// Custom columns for this specific view
const customColumns: Column<CustomerDetailData>[] = [
  {
    header: "First Name",
    accessor: "firstName",
  },
  {
    header: "Last Name",
    accessor: "lastName",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Phone",
    accessor: "phone",
  },
];

// Custom columns for orders table
const orderColumns: Column<OrderData>[] = [
  {
    header: "Order ID",
    accessor: "id",
  },
  {
    header: "Date",
    accessor: "createdAt",
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerViewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const customerPromise = getCustomerDetails([resolvedParams.id]);
  const customer = (await customerPromise)[0];

  const orderDetails = [
    {
      label: "Last Order Date",
      value: !customer.orders.edges[0]?.node.createdAt
        ? "-"
        : new Date(
            customer.orders.edges[0].node.createdAt
          ).toLocaleDateString(),
    },
    {
      label: "Last Order Status",
      value: !customer.orders.edges[0]?.node.status
        ? "-"
        : customer.orders.edges[0].node.status,
    },
    {
      label: "Total Items Ordered",
      value: !customer.orders.edges[0]?.node.totalQuantity
        ? "-"
        : customer.orders.edges[0].node.totalQuantity,
    },
    {
      label: "Total Refunds",
      value: !customer.refunds?.totalRefunds
        ? "-"
        : customer.refunds.totalRefunds,
    },
  ];

  const totalSpent = customer.orders.edges.reduce((total, edge) => {
    const amount = parseFloat(edge.node.totalPriceSet.shopMoney.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);

  const formattedTotalSpent =
    totalSpent === 0 ? "-" : `$${totalSpent.toFixed(2)}`;

  const averageOrderValue = customer.metrics.averageOrderValue
    ? `$${customer.metrics.averageOrderValue.toFixed(2)}`
    : "-";

  const formattedOrders = customer.orders.edges.map((edge) => ({
    node: {
      id: edge.node.id,
      name: edge.node.name,
      orderNumber: edge.node.name,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
      totalPriceSet: {
        shopMoney: {
          amount: edge.node.totalPriceSet.shopMoney.amount,
          currencyCode: edge.node.totalPriceSet.shopMoney.currencyCode,
        },
      },
      createdAt: new Date(edge.node.createdAt),
      displayFulfillmentStatus: edge.node.status,
      displayFinancialStatus: edge.node.financialStatus || "",
      billingAddress: null,
      shippingAddress: null,
      discountApplications: { edges: [] },
      shippingLine: null,
      paymentGatewayNames: [],
      fulfillments: [],
    } as OrderData,
  }));

  const customers = await customerPromise;

  return (
    <div className="pt-16 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-7 ">
        <div className="flex flex-col gap-4 justify-center items-center mb-7">
          <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">
            Customers
          </h1>
        </div>
        <DataTable<CustomerDetailData>
          data={customers.map((customer) => ({ node: customer }))}
          hasNextPage={false}
          endCursor=""
          baseUrl="/dashboard/customers"
          type="customers"
          hideActions={true}
          customColumns={customColumns}
        />
      </div>
      <div className="flex flex-row gap-3 sm:gap-4 lg:gap-8 mt-3 sm:mt-4 px-6 max-w-7xl justify-center">
        <CustomerDetailsCard
          title="Order Details"
          data={orderDetails}
          bgColor="white"
        />
        <div className="h-auto w-full flex flex-col gap-6">
          <MetricCard
            title="Total Spent"
            value={formattedTotalSpent}
            variant="black"
            valueSize="text-[68px]"
          />
          <MetricCard
            title="Average Order Value"
            value={averageOrderValue}
            variant="white"
            valueSize="text-[68px]"
          />
        </div>
        <div className="h-auto w-full flex flex-col gap-6">
          <MetricCard
            title="Active Region"
            value={customer.metrics.region}
            variant="white"
            valueSize="text-[60px]"
          />
          <MetricCard
            title="Total Orders"
            value={customer.metrics.totalOrders}
            variant="black"
            valueSize="text-[68px]"
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-7 mt-8">
        <div className="flex flex-col gap-4 justify-center items-center mb-7">
          <h2 className="text-[32px] font-darker-grotesque tracking-wider font-regular">
            Customer Orders
          </h2>
        </div>
        <DataTable<OrderData>
          data={formattedOrders}
          hasNextPage={false}
          endCursor=""
          baseUrl="/dashboard/orders"
          type="orders"
          hideActions={false}
          customColumns={orderColumns}
        />
      </div>
    </div>
  );
}
