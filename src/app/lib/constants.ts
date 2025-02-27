export const TAGS = {
    collections: 'collections',
    products: 'products',
    cart: 'cart',
}

export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2025-01/graphql.json"

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export type sortFilterItem = {
    title: string
    slug: string | null
    sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE'
    reverse: boolean
}
export const defaultSort: sortFilterItem = {
    title: "Relevance",
    slug: null,
    sortKey: "RELEVANCE",
    reverse: false,
}
export const sorting: sortFilterItem[] = [
    defaultSort, 
    {
        title: "Trending",
        slug: "trending-desc",
        sortKey: "BEST_SELLING",
        reverse: true,
    },
    {
        title: "Latest arrivals",
        slug: "latest-desc",
        sortKey: "CREATED_AT",
        reverse: false,
    },
    {
        title: "Price, low to high",
        slug: "price-asc",
        sortKey: "PRICE",
        reverse: false,
    },
    {
        title: "Price, high to low",
        slug: "price-desc",
        sortKey: "PRICE",
        reverse: true,
    },
]