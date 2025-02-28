import { HIDDEN_PRODUCT_TAG, TAGS } from "../constants";
import { isShopifyError } from "../type-guard";
import { ensureStartWith } from "../utils";
import { getCollectionProductsQuery, getCollectionsQuery } from "./queries/collection";
import { getMenuQuery } from "./queries/Menu";
import { getProductQuery, getProductsByTagQuery, getProductsQuery } from "./queries/product";
import { Connection, Menu, ShopifyMenuOperation, ShopifyProduct, ShopifyProductsOperation, Image, Product, Collection, ShopifyCollectionsOperation, ShopifyCollection, ShopifyCollectionProductsOperation, ShopifyProductOperation, ShopifyCreateCartOperation, Cart, ShopifyCartOperation, ShopifyRemoveFromCartOperation, ShopifyUpdateCartOperation, ShopifyAddToCartOperation, ShopifyCart, ShopifyProductsByTagOperation } from "./types";
import { globalContent } from "./queries/globalContent";
import { getCollectionQuery } from "./queries/collection-journal";
import { addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation } from "./mutations/cart";
import { getCartQuery } from "./queries/cart";

const domain = ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN, "https://");
const endpoint = `${domain}/api/2025-01/graphql.json`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;


  export async function shopifyFetch<T>({
    cache = "force-cache",
    headers,
    query,
    tags,
    variables,
  }: {
    cache?: RequestCache;
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: ExtractVariables<T>;
  }): Promise<{ status: number; body: T } | never> {
    try {
      const result = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": key,
          ...headers,
        },
        body: JSON.stringify({
          ...(query && { query }),
          ...(variables && { variables }),
        }),
        cache,
        ...(tags && { next: { tags } }),
      });
  
      const body = await result.json();
  
      if (body.errors) {
        throw body.errors[0];
      }
  
      return {
        status: result.status,
        body,
      };
    } catch (error) {
      if (isShopifyError(error)) {
        throw {
          cause: error.cause?.toString() || "unknown",
          status: error.status || 500,
          message: error.message,
          query,
        };
      }
  
      throw {
        error,
        query,
      };
    }
  }

  function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
    return array.edges.map((edge) => edge?.node);
  }
  function reshapeImages(images: Connection<Image>, productTitle: string) {
    const flattend = removeEdgesAndNodes(images);
    return flattend.map((image) => {
        const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
        return {
            ...image,
            altText: image.altText || `${productTitle} - ${filename}`
        }
    })
  }
  function reshapeProduct(product: ShopifyProduct, filterHiddenProducts: boolean = true ) {
        if(!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
            return undefined;
        }
        const { images, variants, ...rest} = product;
        return {
            ...rest,
            images: reshapeImages(images, product.title),
            variants: removeEdgesAndNodes(variants),
        }
  }
  
  function reshapeProducts(products: ShopifyProduct[]) {
    const reshapedProducts = [];
  
    for (const product of products) {
      if (product) {
        const reshapedProduct = reshapeProduct(product);
  
        if (reshapedProduct) {
          reshapedProducts.push(reshapedProduct);
        }
      }
    }
  
    return reshapedProducts;
  }
  export async function getMenu(handle: string): Promise<Menu[]> {
    const res = await shopifyFetch<ShopifyMenuOperation>({
      query: getMenuQuery,
      tags: [TAGS.collections],
      variables: {
        handle,
      },
    });
  
    return (
      res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
        title: item.title,
        path: item.url
          .replace(domain, "")
          .replace("/collections", "/search")
          .replace("/pages", ""),
      })) || []
    );
  }

  export async function getProducts({ query, reverse, sortKey }: { query?: string; reverse?: boolean; sortKey?: string }): Promise<Product[]> {

    const res = await shopifyFetch<ShopifyProductsOperation>({
        query: getProductsQuery,
        tags: [TAGS.products],
        variables: { query, reverse, sortKey }
    });

    const processedData = removeEdgesAndNodes(res.body.data.products);

    const reshapedProducts = reshapeProducts(processedData);

    return reshapedProducts;
}


function reshapeCollection(collection: ShopifyCollection) : Collection | undefined {
    if(!collection) return undefined;

    return {
        ...collection,
        path: `/search/${collection.handle}`
    }
}

function reshapeCollections(collections: ShopifyCollection[]) {
    const reshapedCollections = [];
  
    for (const collection of collections) {
      if (collection) {
        const reshapedCollection = reshapeCollection(collection);
  
        if (reshapedCollection) {
          reshapedCollections.push(reshapedCollection);
        }
      }
    }
  
    return reshapedCollections;
  }

  export async function getCollections(): Promise<Collection[]> {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
      tags: [TAGS.collections],
    });
  
    const shopifyCollections = removeEdgesAndNodes(res?.body?.data?.collections);
    const collections = [
      {
        handle: "",
        title: "All",
        description: "All products",
        seo: {
          title: "All",
          description: "All products",
        },
        path: "/search",
        updatedAt: new Date().toISOString(),
      },
      // Filter out the hidden products
      ...reshapeCollections(shopifyCollections).filter(
        (collection) => !collection.handle.startsWith("hidden")
      ),
    ];
  
    return collections;
  }

export async function getCollectionProducts({
    collection,
    reverse,
    sortKey,
  }: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getCollectionProductsQuery,
      tags: [TAGS.collections, TAGS.products],
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
      },
    });
  
    if (!res.body.data.collection) {
      console.log(`No collection found for \`${collection}\``);
      return [];
    }
  
    return reshapeProducts(
      removeEdgesAndNodes(res.body.data.collection.products)
    );
  }


  export async function getProduct(handle: string): Promise<Product | undefined> {
    const res = await shopifyFetch<ShopifyProductOperation>({
      query: getProductQuery,
      tags: [TAGS.products],
      variables: {
        handle,
      },
    });
    return reshapeProduct(res.body.data.product, false);
  }



  // First, let's create a type for the response
type GlobalContentField = {
  key: string;
  value: string;
}

type ShopifyGlobalContentOperation = {
  data: {
    metaobjects: {
      edges: Array<{
        node: {
          fields: GlobalContentField[];
        };
      }>;
    };
  };
}

type GlobalContent = {
  fields: GlobalContentField[];
}

export async function getGlobalContent(): Promise<GlobalContent[]> {
  const res = await shopifyFetch<ShopifyGlobalContentOperation>({
    query: globalContent,
    tags: ['global_content'],
    cache: 'force-cache'
  });

  // Add error checking and logging
  if (!res.body?.data?.metaobjects?.edges) {
    console.error('Invalid response structure:', res);
    return [];
  }

  // Use the removeEdgesAndNodes helper function you already have
  const content = removeEdgesAndNodes(res.body.data.metaobjects).map(node => ({
    fields: node.fields
  }));
  return content;
}


interface MetaobjectField {
  key: string;
  value: string;
}

interface Metaobject {
  type: string;
  fields: MetaobjectField[];
  main_content: MetaobjectField;
  bottom_content: MetaobjectField;
  layout: MetaobjectField;
}

export interface ShopifyCollectionOperation {
  data: {
    metaobject: Metaobject;
  };
  variables: {
    handle: string;
  };
}

export async function getCollectionJournal(handle: string) {
  try {
    const res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      variables: { handle }, // Pass the handle as a variable
      tags: [`collection_${handle}`], // Dynamic tag based on handle
      cache: 'force-cache'
    });

    if (!res.body?.data?.metaobject) {
      console.error(`No collection found for handle: ${handle}`);
      return undefined;
    }

    return res.body.data.metaobject;
  } catch (error) {
    console.error(`Error fetching collection for handle ${handle}:`, error);
    return undefined;
  }
}

function reshapeCart(cart: ShopifyCart): Cart {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: "USD",
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function getCart(
  cartId: string | undefined
): Promise<Cart | undefined> {
  if (!cartId) return undefined;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
  });

  // old carts becomes 'null' when you checkout
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-cache",
  });

  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function getProductsByTag(
  tag: string,
  productId: string,
  limit = 5
): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsByTagOperation>({
    query: getProductsByTagQuery,
    tags: [TAGS.products],
    variables: {
      query: `tag:${tag}`,
      limit,
      productId
    },
  });

  // Filter out the current product from results
  const products = reshapeProducts(
    res.body.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
  );
  
  return products.filter(product => product.id !== productId);
}