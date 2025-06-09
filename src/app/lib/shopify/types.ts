export type Menu = {
  title: string;
  path: string;
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type Edge<T> = {
  node: T;
};

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
  materialComposition?: string;
  care?: string;
  sustainability?: string;
  shippingAndReturns?: string;
};

export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  image?: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type CollectionJournalField = {
  key: string;
  value: string;
};

export type ShopifyCollectionJournalOperation = {
  data: {
    metaobject: {
      type: string;
      fields: CollectionJournalField[];
      main_content: CollectionJournalField;
      bottom_content: CollectionJournalField;
      layout: CollectionJournalField;
    };
  };
};

export type CollectionJournal = {
  mainContent: {
    leftColumn: {
      text: string[];
    };
    rightColumn: {
      images: Array<{
        url: string;
        alt: string;
        position: string;
      }>;
    };
  };
  bottomContent: {
    text: string[];
    additionalImage: {
      url: string;
      alt: string;
    };
  };
  layout: {
    spacing: Record<string, string>;
    responsiveClasses: Record<string, string>;
  };
};

export type ShopifyProductsByTagOperation = {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
  variables: {
    query: string;
    limit: number;
    productId: string;
  };
};

export type CustomerCreateResponse = {
  customer: Customer | null;
  customerUserErrors: {
    code: string;
    field: string[];
    message: string;
  }[];
};

export type ShopifyCustomerCreateOperation = {
  data: {
    customerCreate: {
      customer: Customer;
      customerUserErrors: {
        code: string;
        field: string[];
        message: string;
      }[];
    };
  };
  variables: {
    input: CustomerCreateInput;
  };
};

// Update your CustomerCreateInput type if necessary
export type CustomerCreateInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
  phone?: string;
};

export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

export type CustomerAccessTokenCreateResponse = {
  customerAccessToken: CustomerAccessToken | null;
  customerUserErrors: {
    code: string;
    field: string[];
    message: string;
  }[];
};

export type ShopifyCustomerAccessTokenOperation = {
  data: {
    customerAccessTokenCreate: CustomerAccessTokenCreateResponse;
  };
  variables: {
    input: {
      email: string;
      password: string;
    };
  };
};

export interface ShopifyCustomerActivateByUrlOperation {
  data: {
    customerActivateByUrl: {
      customer: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
      } | null;
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: {
        code: string;
        field: string[];
        message: string;
      }[];
    };
  };
  variables: {
    activationUrl: string;
    password: string;
  };
}

// types/customer.ts

// Customer type
export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  password: string;
  displayName: string | null;
  defaultAddress?: {
    id: string;
    formatted: string[];
  } | null;
}

// Order type
export interface Order {
  id: string;
  orderNumber: number;
  userErrors: {
    message: string;
  }[];
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          title: string;
          image: {
            url: string;
          } | null;
        } | null;
      };
    }>;
  };
}

// Response types for the functions
export type CustomerResponse = {
  customer: Customer | null;
  error?: string;
};

export interface OrdersResponse {
  orders: Order[];
  error?: string;
}

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface CustomerUpdateResponse {
  success?: boolean;
  customer?: Customer;
  error?: string;
}

// GraphQL operation types
export interface ShopifyCustomerOperation {
  data: {
    customer: Customer | null;
  };
  variables: {
    customerAccessToken: string;
  };
}

export interface ShopifyCustomerOrdersOperation {
  data: {
    customer: {
      orders: {
        edges: Array<{
          node: Order;
        }>;
      };
    } | null;
  };
  variables: {
    customerAccessToken: string;
    orderNumber?: string;
  };
}

export interface ShopifyCustomerUpdateOperation {
  data: {
    customerUpdate: {
      customer?: Customer | null;
      password?: string;
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: Array<{
        code: string;
        field: string[];
        message: string;
      }>;
    };
  };
  variables: {
    customerAccessToken: string;
    password?: string; // At this level, not inside customer
    customer?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface ShopifyCustomerRecoverOperation {
  data: {
    customerRecover: {
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: {
        code: string;
        field: string[];
        message: string;
      }[];
    };
  };
  variables: {
    email: string;
  };
}

export interface ShopifyUpdateOrderOperation {
  data: {
    orderLinesUpdate: {
      order: Order;
    };
  };
  variables: {
    orderId: string;
    lineItemId: string;
    quantity: number;
  };
}

export interface ShopifyCancelOrderOperation {
  data: {
    orderCancel: {
      order: Order;
    };
  };
  variables: {
    orderId: string;
    reason: string;
    refund: boolean;
    restock: boolean;
  };
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
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

export interface ShopifyOrder {
  id: string;
  name: string;
  orderNumber: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
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
  lineItems?: {
    edges: Array<{
      node: {
        quantity: number;
      };
    }>;
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

export interface ShopifyAdminProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  totalInventory: number;
  priceRangeV2: {
    minVariantPrice: ShopifyMoney;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
}

export interface ShopifyShop {
  name: string;
  totalOrders: string;
  totalProducts: string;
  totalCustomers: string;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface ShopifyEdge<T> {
  node: T;
}

export interface ShopifyConnection<T> {
  pageInfo: ShopifyPageInfo;
  edges: ShopifyEdge<T>[];
} 