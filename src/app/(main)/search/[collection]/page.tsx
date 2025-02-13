import Grid from "@/app/components/grid";
import ProductGridItems from "@/app/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/app/lib/constants";
import { getCollectionProducts } from "@/app/lib/shopify";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the params and searchParams promises to resolve
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Extract the sort parameter from searchParams
  const { sort } = resolvedSearchParams as { [key: string]: string };

  // Determine the sortKey and reverse values based on the sort parameter
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Fetch products for the collection
  const products = await getCollectionProducts({
    collection: resolvedParams.collection,
    sortKey,
    reverse,
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}