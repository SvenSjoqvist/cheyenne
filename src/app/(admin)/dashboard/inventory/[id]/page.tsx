import { getProductById } from "@/app/lib/shopify/admin/shopify-admin";
import CustomerDetailsCard from "@/app/components/admin/CustomerDetailsCard";
import DataTable from "@/app/components/admin/DataTable";
import { notFound } from "next/navigation";
import MetricCard from "@/app/components/admin/MetricCard";
import { ProductDetailData } from "@/app/components/admin/types";
import DeleteProductButton from "@/app/components/admin/DeleteProductButton";

// Helper to convert numeric ID to Shopify global ID
function toShopifyGID(type: string, id: string) {
  return `gid://shopify/${type}/${id}`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InventoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const globalId = toShopifyGID("Product", resolvedParams.id);

  try {
    const productData = await getProductById(globalId);
    const product = productData.product;

    // Extract color description from product description or use a default
    const colorDescription = product.description
      ? product.description.split(" ")[0]
      : "No color description available";

    // Process variants to get size quantities
    const sizeQuantities = {
      totalQuantity: product.totalInventory,
      xsQuantity: 0,
      sQuantity: 0,
      mQuantity: 0,
      lQuantity: 0,
      xlQuantity: 0,
    };

    // Parse variants to extract size quantities
    product.variants.edges.forEach(({ node: variant }) => {
      const sizeOption = variant.selectedOptions.find(
        (option) =>
          option.name.toLowerCase() === "size" ||
          option.name.toLowerCase() === "title"
      );

      if (sizeOption) {
        const size = sizeOption.value.toLowerCase();
        const quantity = variant.inventoryQuantity || 0;

        switch (size) {
          case "xs":
          case "extra small":
            sizeQuantities.xsQuantity += quantity;
            break;
          case "s":
          case "small":
            sizeQuantities.sQuantity += quantity;
            break;
          case "m":
          case "medium":
            sizeQuantities.mQuantity += quantity;
            break;
          case "l":
          case "large":
            sizeQuantities.lQuantity += quantity;
            break;
          case "xl":
          case "extra large":
            sizeQuantities.xlQuantity += quantity;
            break;
        }
      }
    });

    // Check for low inventory sizes
    const lowInventorySizes = [];
    if (sizeQuantities.xsQuantity <= 5) lowInventorySizes.push("XS");
    if (sizeQuantities.sQuantity <= 5) lowInventorySizes.push("S");
    if (sizeQuantities.mQuantity <= 5) lowInventorySizes.push("M");
    if (sizeQuantities.lQuantity <= 5) lowInventorySizes.push("L");
    if (sizeQuantities.xlQuantity <= 5) lowInventorySizes.push("XL");

    const hasLowInventory = lowInventorySizes.length > 0;
    const lowInventoryMessage = hasLowInventory
      ? `${lowInventorySizes.join(", ")} Low Stock`
      : "Full stock";

    // Prepare data for the product information card
    const productInfoData = [
      {
        label: "SKU",
        value: product.variants.edges[0]?.node.sku || "N/A",
      },
      {
        label: "Name",
        value: product.title,
      },
      {
        label: "Color Description",
        value:
          colorDescription.length > 50
            ? `${colorDescription.substring(0, 50)}...`
            : colorDescription,
      },
      {
        label: "Category",
        value: product.category?.name || "Uncategorized",
      },
    ];

    // Prepare data for the quantity information card
    const quantityInfoData = [
      {
        label: "Total Quantity",
        value: sizeQuantities.totalQuantity,
      },
      {
        label: "XS",
        value: sizeQuantities.xsQuantity,
      },
      {
        label: "S",
        value: sizeQuantities.sQuantity,
      },
      {
        label: "M",
        value: sizeQuantities.mQuantity,
      },
      {
        label: "L",
        value: sizeQuantities.lQuantity,
      },
      {
        label: "XL",
        value: sizeQuantities.xlQuantity,
      },
    ];

    // Prepare data for the detailed information table
    const detailedInfoData: Array<{ node: ProductDetailData }> = [
      {
        node: {
          id: product.id,
          images: product.images || { edges: [] },
          description: product.description || "No description available",
          productInfo:
            "Material: Placeholder - Material info\nComposition: Placeholder - Composition info\nCare: Placeholder - Care instructions",
        },
      },
    ];

    return (
      <div className="pt-16 bg-[#F7F7F7] px-4 h-full">
        <div className="max-w-7xl mx-auto mb-20">
          <div className="flex flex-col gap-4 justify-center items-center mb-7">
            <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">
              Inventory
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Information Card */}
            <div className="w-full flex items-center flex-col gap-8">
              <CustomerDetailsCard
                title="Product Information"
                data={productInfoData}
                bgColor="white"
              />
              <MetricCard
                title=""
                value={lowInventoryMessage}
                variant="black"
                valueSize="text-[40px]"
              />
            </div>

            {/* Quantity Information Card */}
            <div className="w-full h-full">
              <CustomerDetailsCard
                title="Quantity Information"
                data={quantityInfoData}
                bgColor="white"
              />
            </div>
          </div>

          {/* Detailed Information Table */}
          <div className="mt-8">
            <DataTable<ProductDetailData>
              data={detailedInfoData}
              hasNextPage={false}
              endCursor=""
              baseUrl="/dashboard/inventory"
              type="product-detail"
              hideActions={true}
            />
          </div>

          {/* Delete Product Button */}
          <DeleteProductButton productId={globalId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}
