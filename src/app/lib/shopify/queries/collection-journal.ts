export const getCollectionQuery = `
  query getCollection($handle: String!) {
    metaobject(handle: { handle: $handle, type: "collection_journal" }) {
      type
      fields {
        key
        value
      }
      main_content: field(key: "main_content") {
        key
        value
      }
      bottom_content: field(key: "bottom_content") {
        key
        value
      }
      layout: field(key: "layout") {
        key
        value
      }
    }
  }
`;