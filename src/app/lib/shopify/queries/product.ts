import { productFragment } from "../fragments/product";

export const getMainPageProductsQuery = /* GraphQL */ `
  query getMainPageProducts {
    products(first: 20) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          options {
            id
            name
            values
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          tags
          seo {
            title
            description
          }
          updatedAt
        }
      }
    }
  }
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
          id
          handle
          title
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          tags
        }
      }
    }
  }
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      availableForSale
      options {
        id
        name
        values
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      seo {
        title
        description
      }
      tags
      updatedAt
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