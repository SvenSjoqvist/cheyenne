export type TableType = 'orders' | 'customers' | 'cancellations' | 'returns';

export interface OrderData {
  id: string;
  customer: { 
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  createdAt: string;
  displayFulfillmentStatus: string;
}

export interface OrderDetailData extends OrderData {
  name: string;
  orderNumber: string;
  displayFinancialStatus: string;
  shippingAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
  };
  billingAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
  };
  discountApplications?: {
    edges: Array<{
      node: {
        code: string;
      };
    }>;
  };
  shippingLine?: {
    title: string;
    price: string;
  };
  paymentGatewayNames?: string[];
  fulfillments?: Array<{
    trackingInfo: {
      number: string;
      url: string;
    };
  }>;
}

export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orders: {
    edges: Array<{
      node: {
        totalPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
}

export interface CustomerDetailData extends CustomerData {
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

export interface CancellationData {
  id: string;
  orderNumber: string;
  customerId: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  status: string;
}

export interface ReturnData {
  id: string;
  customerId: string;
  orderId: string;
  createdAt: string;
  status: string;
  items: Array<{ reason: string }>;
}

export type TableData = OrderData | CustomerData | CancellationData | ReturnData;

export interface Column<T extends TableData> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T extends TableData> {
  data: Array<{
    node: T;
  }>;
  hasNextPage: boolean;
  endCursor: string;
  baseUrl: string;
  type: TableType;
  hideActions?: boolean;
  customColumns?: Column<T>[];
}