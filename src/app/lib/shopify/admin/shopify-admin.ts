const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
  }>;
}

async function shopifyRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(SHOPIFY_ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const data = await response.json() as ShopifyResponse<T>;
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

interface DashboardStats {
  shop: {
    name: string;
    totalOrders: string;
    totalProducts: string;
    totalCustomers: string;
  };
  orders: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        createdAt: string;
        totalPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
        customer: {
          firstName: string;
          lastName: string;
          email: string;
        };
      };
    }>;
  };
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        totalInventory: number;
        priceRangeV2: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
}

interface RecentItemsResponse {
  orders: DashboardStats['orders'];
  products: DashboardStats['products'];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const countsQuery = `
    query {
      shop {
        name
      }
      orders(first: 250) {
        pageInfo {
          hasNextPage
        }
      }
      products(first: 250) {
        pageInfo {
          hasNextPage
        }
      }
      customers(first: 250) {
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

  const recentItemsQuery = `
    query {
      orders(first: 5, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              firstName
              lastName
              email
            }
          }
        }
      }
      products(first: 5, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            totalInventory
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const [countsData, recentData] = await Promise.all([
    shopifyRequest<{
      shop: { name: string };
      orders: { pageInfo: { hasNextPage: boolean } };
      products: { pageInfo: { hasNextPage: boolean } };
      customers: { pageInfo: { hasNextPage: boolean } };
    }>(countsQuery),
    shopifyRequest<RecentItemsResponse>(recentItemsQuery)
  ]);

  return {
    shop: {
      name: countsData.shop.name,
      totalOrders: countsData.orders.pageInfo.hasNextPage ? '250+' : '250',
      totalProducts: countsData.products.pageInfo.hasNextPage ? '250+' : '250',
      totalCustomers: countsData.customers.pageInfo.hasNextPage ? '250+' : '250',
    },
    orders: recentData.orders,
    products: recentData.products,
  };
}

interface OrdersResponse {
  orders: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Array<{
      node: {
        id: string;
        name: string;
        createdAt: string;
        totalPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
        customer: {
          firstName: string;
          lastName: string;
          email: string;
        };
        displayFulfillmentStatus: string;
        displayFinancialStatus: string;
      };
    }>;
  };
}

export async function getOrders(cursor: string | null = null, limit = 10): Promise<OrdersResponse> {
  const query = `
    query getOrders($first: Int!, $after: String) {
      orders(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              firstName
              lastName
              email
            }
            displayFulfillmentStatus
            displayFinancialStatus
          }
        }
      }
    }
  `;

  const variables = {
    first: limit,
    after: cursor,
  };

  return shopifyRequest<OrdersResponse>(query, variables);
}

interface ProductsResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        totalInventory: number;
        priceRangeV2: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        images: {
          edges: Array<{
            node: {
              url: string;
              altText: string;
            };
          }>;
        };
      };
    }>;
  };
}

export async function getProducts(cursor: string | null = null, limit = 10): Promise<ProductsResponse> {
  const query = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            totalInventory
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    first: limit,
    after: cursor,
  };

  return shopifyRequest<ProductsResponse>(query, variables);
}

interface CustomersResponse {
  customers: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Array<{
      node: {
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
      };
    }>;
  };
}

export async function getCustomers(cursor: string | null = null, limit = 10): Promise<CustomersResponse> {
  const query = `
    query getCustomers($first: Int!, $after: String) {
      customers(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            firstName
            lastName
            email
            createdAt
            orders(first: 1) {
              pageInfo {
                hasNextPage
              }
            }
            orders(first: 1) {
              edges {
                node {
                  totalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    first: limit,
    after: cursor,
  };

  const data = await shopifyRequest<CustomersResponse>(query, variables);

  return {
    customers: {
      ...data.customers,
      edges: data.customers.edges.map((edge) => ({
        node: {
          ...edge.node,
          ordersCount: edge.node.orders.pageInfo.hasNextPage ? '100+' : '1',
          totalSpent: edge.node.orders.edges[0]?.node.totalPriceSet.shopMoney.amount || '0',
        },
      })),
    },
  };
}