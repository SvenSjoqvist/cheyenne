export interface Order {
  id: string;
  name: string;
  createdAt: string;
  totalPrice: string;
  currency: string;
}

export interface CustomerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  orders: Order[];
  totalSpent: number;
}

export interface OrderNode {
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface CustomerNode {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  orders: {
    pageInfo: {
      hasNextPage: boolean;
    };
    edges: Array<{
      node: OrderNode;
    }>;
  };
} 