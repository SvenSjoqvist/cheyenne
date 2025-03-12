export const customerQuery = `
  query customerQuery($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      displayName
      defaultAddress {
        id
        formatted
      }
    }
  }
`;
export const customerOrderQuery = `
  query GetCustomerOrder($customerAccessToken: String!, $orderNumber: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderNumber) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
            shippingAddress {
              address1
              address2
              city
              provinceCode
              zip
              country
            }
            statusUrl
          }
        }
      }
    }
  }
`;