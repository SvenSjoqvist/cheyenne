import Grid from "@/app/components/grid";
import ProductGridItems from "@/app/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/app/lib/constants";
import { getProducts } from "@/app/lib/shopify";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams promise to resolve
  const resolvedSearchParams = await (searchParams || Promise.resolve({}));

  // Extract the sort and search query (q) parameters
  const { sort, q: searchValue } = resolvedSearchParams as { [key: string]: string };

  // Determine the sortKey and reverse values based on the sort parameter
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Fetch products based on the search query and sort parameters
  const products = await getProducts({ sortKey, reverse, query: searchValue });

  // Determine the results text based on the number of products
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match"
            : `Showing ${products.length} ${resultsText} for `}
          <span>&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid>
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}