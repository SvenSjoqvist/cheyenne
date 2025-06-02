import { productFragment } from "../fragments/product";

export const getMainPageProductsQuery = /* GraphQL */ `
  query getMainPageProducts {
    products(first: 20) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 9) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
      materialComposition: metafield(namespace: "custom", key: "material_composition") {
        value
      }
      care: metafield(namespace: "custom", key: "care") {
        value
      }
      sustainability: metafield(namespace: "custom", key: "sustainability") {
        value
      }
      shippingAndReturns: metafield(namespace: "custom", key: "shipping_and_returns") {
        value
      }
    }
  }
  ${productFragment}
`;

export const getProductsByTagQuery = /* GraphQL */ `
  query getProductsByTag($query: String!, $limit: Int!) {
    products(first: $limit, query: $query) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;