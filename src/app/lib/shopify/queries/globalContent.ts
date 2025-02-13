export const globalContent = `
  query getProductSections {
    metaobjects(type: "productinformation", first: 10) {
      edges {
        node {
          fields {
            key
            value
          }
        }
      }
    }
  }
`;