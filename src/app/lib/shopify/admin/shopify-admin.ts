import { ShopifyCustomer, ShopifyOrder } from '../types';

const SHOPIFY_ADMIN_API_URL = `https://kilaeko-application.myshopify.com/admin/api/2024-01/graphql.json`;

console.log(process.env.SHOPIFY_ACCESS_TOKEN);

async function shopifyRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  try {
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': "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",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e: unknown) {
      console.error('Failed to parse JSON response:', e);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(`Shopify API error (${response.status}): ${JSON.stringify(data)}`);
    }

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    if (!data.data) {
      throw new Error('No data in response');
    }

    return data.data as T;
  } catch (error) {
    throw error;
  }
}

interface CustomersResponse {
  customers: {
    edges: Array<{
      node: ShopifyCustomer;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

interface OrdersResponse {
  orders: {
    edges: Array<{
      node: ShopifyOrder;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

export async function getCustomers(first: number = 10, after?: string, customerIds?: string[]): Promise<CustomersResponse> {
  const query = `
    query GetCustomers($first: Int!, $after: String, $query: String) {
      customers(first: $first, after: $after, query: $query) {
        edges {
          node {
            id
            firstName
            lastName
            email
            phone
            createdAt
            orders(first: 1) {
              pageInfo {
                hasNextPage
              }
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  // Create query string for specific customer IDs
  const queryString = customerIds?.length ? `id:${customerIds.join(' OR id:')}` : null;

  return shopifyRequest<CustomersResponse>(query, { 
    first,
    after: after || undefined,
    query: queryString
  });
}

export async function getOrders(first: number = 10, after?: string, customerId?: string): Promise<OrdersResponse> {
  const query = `
    query GetOrders($first: Int!, $after: String, $query: String) {
      orders(first: $first, after: $after, query: $query) {
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
              id
            }
            displayFulfillmentStatus
            displayFinancialStatus
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  // Format the query string properly for customer ID filtering
  const queryString = customerId ? `customer_id:${customerId}` : null;

  console.log('Fetching orders with params:', { first, after, query: queryString });

  const response = await shopifyRequest<OrdersResponse>(query, { 
    first, 
    after,
    query: queryString  // Changed from customerId to query
  });

  console.log('Raw Shopify API Response:', JSON.stringify(response, null, 2));
  
  // Log each order's customer data
  response.orders.edges.forEach(({ node }) => {
    console.log('Order customer data:', {
      orderId: node.id,
      customerId: node.customer?.id,
      customerData: node.customer
    });
  });

  return response;
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
        edges {
          node {
            id
          }
        }
      }
      products(first: 10) {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
          }
        }
      }
      customers(first: 250) {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
          }
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
      orders: { pageInfo: { hasNextPage: boolean }; edges: Array<{ node: { id: string } }> };
      products: { pageInfo: { hasNextPage: boolean }; edges: Array<{ node: { id: string } }> };
      customers: { pageInfo: { hasNextPage: boolean }; edges: Array<{ node: { id: string } }> };
    }>(countsQuery),
    shopifyRequest<RecentItemsResponse>(recentItemsQuery)
  ]);

  // Count actual items and add "+" if there are more
  const totalOrders = countsData.orders.edges.length + (countsData.orders.pageInfo.hasNextPage ? '+' : '');
  const totalProducts = countsData.products.edges.length + (countsData.products.pageInfo.hasNextPage ? '+' : '');
  const totalCustomers = countsData.customers.edges.length + (countsData.customers.pageInfo.hasNextPage ? '+' : '');

  return {
    shop: {
      name: countsData.shop.name,
      totalOrders: totalOrders.toString(),
      totalProducts: totalProducts.toString(),
      totalCustomers: totalCustomers.toString(),
    },
    orders: recentData.orders,
    products: recentData.products,
  };
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
  try {
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
              featuredImage {
                url
                altText
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

    return await shopifyRequest<ProductsResponse>(query, variables);
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: {
        pageInfo: {
          hasNextPage: false,
          endCursor: '',
        },
        edges: []
      }
    };
  }
}

export async function fetchAbandonedCarts() {
  try {
    const query = `
      query {
        orders(first: 100, query: "status:any financial_status:abandoned OR financial_status:voided") {
          edges {
            node {
              id
              name
              displayFinancialStatus
              displayFulfillmentStatus
              createdAt
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
    `;

    const data = await shopifyRequest<{
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            displayFinancialStatus: string;
            displayFulfillmentStatus: string;
            createdAt: string;
            totalPriceSet: {
              shopMoney: {
                amount: string;
                currencyCode: string;
              };
            };
          };
        }>;
      };
    }>(query);

    // Return the count of abandoned orders
    const count = data.orders.edges.length;
    console.log('Abandoned orders:', data.orders.edges.map(edge => ({
      id: edge.node.id,
      name: edge.node.name,
      status: edge.node.displayFinancialStatus,
      amount: edge.node.totalPriceSet.shopMoney.amount,
      currency: edge.node.totalPriceSet.shopMoney.currencyCode,
      createdAt: edge.node.createdAt
    })));
    return count;
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return 0;
  }
}

export async function getAverageCartValue() {
  try {
    const query = `
      query {
        orders(first: 100, sortKey: CREATED_AT, reverse: true) {
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
    `;

    const data = await shopifyRequest<{
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
    }>(query);

    if (data.orders.edges.length === 0) {
      return { amount: 0, currency: 'USD' };
    }

    // Calculate average
    const total = data.orders.edges.reduce((sum, order) => {
      return sum + parseFloat(order.node.totalPriceSet.shopMoney.amount);
    }, 0);

    const average = total / data.orders.edges.length;
    const currency = data.orders.edges[0]?.node.totalPriceSet.shopMoney.currencyCode || 'USD';

    console.log('Average cart value:', average, currency);
    return { amount: Math.round(average), currency };
  } catch (error) {
    console.error('Error fetching average cart value:', error);
    return { amount: 0, currency: 'USD' };
  }
}

export async function getOrderStatusBreakdown() {
  try {
    const response = await shopifyRequest<{
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            displayFulfillmentStatus: string;
            displayFinancialStatus: string;
          }
        }>;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        }
      }
    }>(`
      query ($first: Int) {
        orders(first: $first) {
          edges {
            node {
              id
              name
              displayFulfillmentStatus
              displayFinancialStatus
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `, { first: 100 });
    
    // Process the results
    const orders = response.orders.edges.map(edge => edge.node);
    
    // Count by fulfillment status
    const fulfillmentStatusCounts: Record<string, number> = {};
    
    orders.forEach(order => {
      const fulfillmentStatus = order.displayFulfillmentStatus;
      fulfillmentStatusCounts[fulfillmentStatus] = (fulfillmentStatusCounts[fulfillmentStatus] || 0) + 1;
    });

    // Map Shopify fulfillment statuses to user-requested labels for the pie chart
    let chartData = [
      {
        label: "Orders to Ship", // Unfulfilled, Scheduled, On hold, Awaiting shipment
        value: (fulfillmentStatusCounts["Unfulfilled"] || 0)
          + (fulfillmentStatusCounts["Scheduled"] || 0)
          + (fulfillmentStatusCounts["On hold"] || 0)
          + (fulfillmentStatusCounts["Awaiting shipment"] || 0),
        color: "#666DAF"
      },
      {
        label: "Partially Delivered", // Partially fulfilled
        value: fulfillmentStatusCounts["Partially fulfilled"] || 0,
        color: "#F7B801"
      },
      {
        label: "Delivered", // Fulfilled, Complete
        value: (fulfillmentStatusCounts["Fulfilled"] || 0)
          + (fulfillmentStatusCounts["Complete"] || 0),
        color: "#43AA8B"
      },
    ].filter(item => item.value > 0); // Only include statuses that have orders

    // Special case: Only FULFILLED and UNFULFILLED present
    const keys = Object.keys(fulfillmentStatusCounts);
    if (
      keys.length === 2 &&
      ((keys.includes("Fulfilled") && keys.includes("Unfulfilled")) || (keys.includes("FULFILLED") && keys.includes("UNFULFILLED")))
    ) {
      chartData = [
        {
          label: "Orders to Ship",
          value: fulfillmentStatusCounts["Unfulfilled"] || fulfillmentStatusCounts["UNFULFILLED"] || 0,
          color: "#666DAF"
        },
        {
          label: "Delivered",
          value: fulfillmentStatusCounts["Fulfilled"] || fulfillmentStatusCounts["FULFILLED"] || 0,
          color: "#43AA8B"
        }
      ];
    }

    return { 
      chartData,
      fulfillmentStatusCounts,
      totalOrders: orders.length
    };
  } catch (error) {
    console.error('Error fetching order status breakdown:', error);
    throw new Error('Failed to fetch order status breakdown');
  }
}

export async function getOrdersByCountry() {
  try {
    const query = `
      query getOrdersByCountry {
        orders(first: 250) {
          edges {
            node {
              id
              name
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              shippingAddress {
                country
                countryCodeV2
              }
              billingAddress {
                country
                countryCodeV2
              }
            }
          }
        }
      }
    `;

    const data = await shopifyRequest<{
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            totalPriceSet: {
              shopMoney: {
                amount: string;
                currencyCode: string;
              };
            };
            shippingAddress: {
              country: string;
              countryCodeV2: string;
            } | null;
            billingAddress: {
              country: string;
              countryCodeV2: string;
            } | null;
          };
        }>;
      };
    }>(query);

    const orders = data.orders.edges.map(edge => edge.node);
    
    // Count orders by country
    const countryCount: { [key: string]: number } = {};
    
    orders.forEach((order) => {
      // Use shipping address first, fallback to billing address
      const country = order.shippingAddress?.country || order.billingAddress?.country;
      const countryCode = order.shippingAddress?.countryCodeV2 || order.billingAddress?.countryCodeV2;
      
      if (country && countryCode) {
        if (!countryCount[countryCode]) {
          countryCount[countryCode] = 0;
        }
        countryCount[countryCode]++;
      }
    });

    // Convert to array and sort by order count
    const countryData = Object.entries(countryCount)
      .map(([countryCode, orderCount]) => ({
        countryCode,
        orderCount,
      }))
      .sort((a, b) => b.orderCount - a.orderCount);

    return {
      countries: countryData,
      totalOrders: orders.length,
    };
  } catch (error) {
    console.error('Error fetching orders by country:', error);
    throw error;
  }
}

interface CancelledOrderResponse {
  orders: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        createdAt: string;
        cancelledAt: string;
        cancelReason: string | null;
        totalPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
        customer: {
          id: string;
          email: string;
        } | null;
        displayFulfillmentStatus: string;
      };
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

interface CancelledOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  createdAt: Date;
  cancelledAt: Date;
  reason: string;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
}

interface CancelledOrdersResult {
  orders: CancelledOrder[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

interface OrderUpdateResponse {
  orderUpdate: {
    order: {
      id: string;
      displayFulfillmentStatus: string;
    };
    userErrors: Array<{
      field: string;
      message: string;
    }>;
  };
}

export async function getCancelledOrders(first: number = 10, after?: string): Promise<CancelledOrdersResult> {
  const query = `
    query getCancelledOrders($first: Int!, $after: String) {
      orders(first: $first, after: $after, query: "status:cancelled") {
        edges {
          node {
            id
            name
            createdAt
            cancelledAt
            cancelReason
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              id
              email
            }
            displayFulfillmentStatus
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const variables = {
    first,
    after
  };

  try {
    const response = await shopifyRequest<CancelledOrderResponse>(query, variables);
    
    return {
      orders: response.orders.edges.map(({ node }) => ({
        id: node.id,
        orderNumber: node.name.replace('#', ''),
        customerId: node.customer?.id || '',
        customerEmail: node.customer?.email || '',
        createdAt: new Date(node.createdAt),
        cancelledAt: new Date(node.cancelledAt),
        reason: node.cancelReason || 'No reason provided',
        totalAmount: parseFloat(node.totalPriceSet.shopMoney.amount),
        currency: node.totalPriceSet.shopMoney.currencyCode,
        status: node.displayFulfillmentStatus === 'UNFULFILLED' ? 'PENDING' : 'COMPLETED'
      })),
      pageInfo: response.orders.pageInfo
    };
  } catch (error) {
    console.error('Error fetching cancelled orders:', error);
    throw error;
  }
}

export async function updateCancellationStatus(orderId: string, status: string): Promise<{ id: string; displayFulfillmentStatus: string }> {
  const mutation = `
    mutation orderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          displayFulfillmentStatus
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: orderId,
      displayFulfillmentStatus: status
    }
  };

  try {
    const response = await shopifyRequest<OrderUpdateResponse>(mutation, variables);
    
    if (response.orderUpdate.userErrors.length > 0) {
      throw new Error(response.orderUpdate.userErrors[0].message);
    }

    return response.orderUpdate.order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

interface OrderResponse {
  order: ShopifyOrder;
}

export async function getOrder(id: string): Promise<ShopifyOrder | null> {
  const query = `
    query getOrder($id: ID!) {
      order(id: $id) {
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
          id
          firstName
          lastName
          email
          phone
        }
        displayFulfillmentStatus
        displayFinancialStatus
        shippingAddress {
          address1
          address2
          city
          province
          zip
          country
        }
        billingAddress {
          address1
          address2
          city
          province
          zip
          country
        }
      }
    }
  `;

  try {
    const response = await shopifyRequest<OrderResponse>(query, { id });
    return response.order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
} 