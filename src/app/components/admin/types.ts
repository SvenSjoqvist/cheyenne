export interface BaseTableData {
  id: string;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface CustomerData extends BaseTableData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amountSpent: {
    amount: string;
    currencyCode: string;
  };
}

export interface OrderData extends BaseTableData {
  id: string;
  name: string;
  orderNumber: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  createdAt: Date;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  billingAddress:
    | {
        address1?: string;
        address2?: string;
        city?: string;
        province?: string;
        zip?: string;
        country?: string;
      }
    | null
    | undefined;
  shippingAddress:
    | {
        address1?: string;
        address2?: string;
        city?: string;
        province?: string;
        zip?: string;
        country?: string;
      }
    | null
    | undefined;
  discountApplications: { edges: { node: { code: string } }[] } | undefined;
  shippingLine:
    | {
        title: string;
        price: string;
      }
    | null
    | undefined;
  paymentGatewayNames: string[] | undefined;
  fulfillments: { trackingInfo: { number: string; url: string } }[] | undefined;
}

export interface CancellationData extends BaseTableData {
  orderNumber: string;
  customerId: string;
  totalAmount: number;
  currency: string;
  createdAt: Date;
  status: string;
}

export interface ReturnData extends BaseTableData {
  customerId: string;
  orderId: string;
  createdAt: Date;
  status: string;
  items: Array<{
    reason: string;
  }>;
}

export interface ProductData extends BaseTableData {
  title: string;
  description: string;
  totalInventory: number;
  sku: string;
  category: string;
  stock: string;
}

export interface InventoryDetailData extends BaseTableData {
  sku: string;
  name: string;
  colorDescription: string;
  category: string;
}

export interface InventoryQuantityData extends BaseTableData {
  totalQuantity: number;
  xsQuantity: number;
  sQuantity: number;
  mQuantity: number;
  lQuantity: number;
  xlQuantity: number;
}

export interface ProductDetailData extends BaseTableData {
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  description: string;
  productInfo: string;
}

export interface CustomerDetailData extends BaseTableData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amountSpent: {
    amount: string;
    currencyCode: string;
  };
  orders: {
    edges: Array<{
      node: {
        id: string;
        createdAt: string;
        status: string;
        financialStatus: string;
        name: string;
        totalQuantity: number;
        totalPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
  refunds?: {
    totalRefunds: number;
    totalItemsReturned: number;
  };
  metrics: {
    region: string;
    averageOrderValue: number;
    totalOrders: number;
  };
}

export type TableData =
  | CustomerData
  | OrderData
  | CancellationData
  | ReturnData
  | ProductData
  | InventoryDetailData
  | InventoryQuantityData
  | ProductDetailData
  | CustomerDetailData;

export type TableType =
  | "orders"
  | "customers"
  | "cancellations"
  | "returns"
  | "products"
  | "inventory-detail"
  | "inventory-quantity"
  | "product-detail";

export interface Column<T extends TableData> {
  header: string;
  accessor: keyof T;
}

export interface DataTableProps<T extends TableData> {
  data: Array<{ node: T }>;
  hasNextPage: boolean;
  endCursor: string;
  baseUrl: string;
  type: TableType;
  hideActions?: boolean;
  customColumns?: Column<T>[];
}
