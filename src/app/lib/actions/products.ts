"use server";

import {
  getDetailedProducts,
  deleteProduct,
} from "../shopify/admin/shopify-admin";
import { protectServerAction } from "../auth-utils";

export async function getProductsServerAction(
  first: number = 10,
  after?: string
) {
  // Protect admin function
  await protectServerAction();

  try {
    const response = await getDetailedProducts(first, after);
    return {
      products: response.products.edges.map((edge) => {
        const inventory = edge.node.totalInventory;
        let stock: "in_stock" | "low_stock" | "out_of_stock";

        if (inventory <= 0) {
          stock = "out_of_stock";
        } else if (inventory <= 5) {
          stock = "low_stock";
        } else {
          stock = "in_stock";
        }

        return {
          id: edge.node.id,
          title: edge.node.title,
          description: edge.node.description,
          totalInventory: edge.node.totalInventory,
          sku: edge.node.variants.edges[0]?.node.sku || "N/A",
          category: edge.node.category?.name || "Uncategorized",
          stock,
        };
      }),
      hasNextPage: response.products.pageInfo.hasNextPage,
      endCursor: response.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function deleteProductServerAction(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  // Protect admin function
  await protectServerAction();

  try {
    return await deleteProduct(productId);
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
