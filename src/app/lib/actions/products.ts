'use server';

import { protectServerAction, sanitizeInput } from '@/app/lib/auth-utils';

// Simple product creation using Shopify client
export async function createProduct(formData: FormData): Promise<{ success: boolean; productId?: string; error?: string }> {
  console.log(`[CREATE_PRODUCT] Starting simple product creation`);
  
  try {
    // Protect admin function
    console.log(`[CREATE_PRODUCT] Authenticating user...`);
    await protectServerAction();
    console.log(`[CREATE_PRODUCT] User authenticated successfully`);

    // Extract form data
    console.log(`[CREATE_PRODUCT] Extracting form data...`);
    const name = sanitizeInput(formData.get('name') as string);
    const description = sanitizeInput(formData.get('description') as string);
    const category = sanitizeInput(formData.get('category') as string);
    const colorDescription = sanitizeInput(formData.get('colorDescription') as string);
    const price = sanitizeInput(formData.get('price') as string);

    // Validate required fields
    console.log(`[CREATE_PRODUCT] Validating required fields...`);
    if (!name || !description || !category || !colorDescription || !price) {
      console.error(`[CREATE_PRODUCT] Missing required fields:`, {
        name: !!name,
        description: !!description,
        category: !!category,
        colorDescription: !!colorDescription,
        price: !!price
      });
      return { success: false, error: 'Missing required fields' };
    }
    console.log(`[CREATE_PRODUCT] All required fields present`);

    // Create Shopify client
    const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN || 'kilaeko-application.myshopify.com';
    const SHOPIFY_ADMIN_API_URL = `https://${shopDomain}/admin/api/2025-04/graphql.json`;
    
    console.log(`[CREATE_PRODUCT] Using Shopify API URL: ${SHOPIFY_ADMIN_API_URL}`);
    
    // Step 1: Create base product (no options/variants)
    console.log(`[CREATE_PRODUCT] Creating base product...`);
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {
          productCreate(
            input: {
              title: "${name}",
              descriptionHtml: "<p>${description}</p>",
              productType: "${category}",
              vendor: "Cheyenne"
            }
          ) {
            product {
              id
              title
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }`
      }),
    });

    if (!response.ok) {
      console.error(`[CREATE_PRODUCT] HTTP error: ${response.status} ${response.statusText}`);
      return { success: false, error: `HTTP error: ${response.status}` };
    }

    const data = await response.json();
    console.log(`[CREATE_PRODUCT] Base product response:`, JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error(`[CREATE_PRODUCT] GraphQL errors:`, JSON.stringify(data.errors, null, 2));
      return { success: false, error: `GraphQL errors: ${JSON.stringify(data.errors)}` };
    }

    if (data.data?.productCreate?.userErrors?.length > 0) {
      const errorMessage = data.data.productCreate.userErrors
        .map((error: { message: string }) => error.message)
        .join(', ');
      console.error(`[CREATE_PRODUCT] Product creation failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }

    const productId = data.data?.productCreate?.product?.id;
    console.log(`[CREATE_PRODUCT] Base product created successfully with ID: ${productId}`);

    // Step 2: Add variants using productVariantCreate
    console.log(`[CREATE_PRODUCT] Adding variants...`);
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const variants = [];

    for (const size of sizes) {
      console.log(`[CREATE_PRODUCT] Creating variant for size: ${size}`);
      
      const variantResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
            productVariantCreate(
              input: {
                productId: "${productId}",
                price: "${price}",
                sku: "${category.toUpperCase()}-${colorDescription.toUpperCase()}-${size}",
                option1: "${colorDescription}",
                option2: "${size}"
              }
            ) {
              productVariant {
                id
                title
                sku
                selectedOptions {
                  name
                  value
                }
              }
              userErrors {
                field
                message
              }
            }
          }`
        }),
      });

      const variantData = await variantResponse.json();
      
      if (variantData.errors) {
        console.error(`[CREATE_PRODUCT] GraphQL errors for variant ${size}:`, JSON.stringify(variantData.errors, null, 2));
        continue;
      }
      
      if (variantData.data?.productVariantCreate?.userErrors?.length > 0) {
        console.error(`[CREATE_PRODUCT] Failed to create variant for ${size}:`, 
          variantData.data.productVariantCreate.userErrors);
      } else {
        const variant = variantData.data?.productVariantCreate?.productVariant;
        if (variant) {
          variants.push(variant);
          console.log(`[CREATE_PRODUCT] Successfully created variant: ${variant.title}`);
        } else {
          console.error(`[CREATE_PRODUCT] No variant returned for size: ${size}`);
        }
      }
    }

    console.log(`[CREATE_PRODUCT] Created ${variants.length} variants`);
    
    // Get the updated product with all variants for inventory setup
    console.log(`[CREATE_PRODUCT] Getting updated product with all variants...`);
    const updatedProductResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          product(id: "${productId}") {
            variants(first: 10) {
              nodes {
                id
                title
                sku
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }`
      }),
    });

    const updatedProductData = await updatedProductResponse.json();
    const allVariants = updatedProductData.data?.product?.variants?.nodes || [];
    console.log(`[CREATE_PRODUCT] Found ${allVariants.length} total variants for inventory setup`);
    
    // Set inventory quantities for each variant
    console.log(`[CREATE_PRODUCT] Setting inventory quantities...`);
    const quantities = [10, 20, 30, 40, 50]; // XS, S, M, L, XL quantities
    
    // Get location ID first
    const locationResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          locations(first: 1) {
            nodes {
              id
              name
            }
          }
        }`
      }),
    });

    const locationData = await locationResponse.json();
    const locationId = locationData.data?.locations?.nodes?.[0]?.id;
    
    if (!locationId) {
      console.error(`[CREATE_PRODUCT] No location found for inventory`);
      return { success: false, error: 'No location found for inventory' };
    }
    
    console.log(`[CREATE_PRODUCT] Using location: ${locationId}`);
    
    // Set inventory for each variant
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      
      // Find the size from the variant's selected options
      const sizeOption = variant.selectedOptions?.find((option: { name: string }) => option.name === 'Size');
      const size = sizeOption?.value || 'XS';
      const sizeIndex = ['XS', 'S', 'M', 'L', 'XL'].indexOf(size);
      const quantity = sizeIndex >= 0 ? quantities[sizeIndex] : 10;
      
      console.log(`[CREATE_PRODUCT] Setting inventory for variant ${variant.title} (${size}) to ${quantity}`);
      
      // Get inventory item ID for this variant
      const inventoryItemResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query {
            productVariant(id: "${variant.id}") {
              inventoryItem {
                id
                tracked
              }
            }
          }`
        }),
      });

      const inventoryItemData = await inventoryItemResponse.json();
      const inventoryItemId = inventoryItemData.data?.productVariant?.inventoryItem?.id;
      const isTracked = inventoryItemData.data?.productVariant?.inventoryItem?.tracked;
      
      if (!inventoryItemId) {
        console.error(`[CREATE_PRODUCT] No inventory item found for variant ${variant.title}`);
        continue;
      }
      
      console.log(`[CREATE_PRODUCT] Inventory item ${inventoryItemId} tracked: ${isTracked}`);
      
      // Enable inventory tracking if not already tracked
      if (!isTracked) {
        console.log(`[CREATE_PRODUCT] Enabling inventory tracking for ${variant.title}`);
        const enableTrackingResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `mutation {
              inventoryItemUpdate(
                id: "${inventoryItemId}",
                input: {
                  tracked: true
                }
              ) {
                inventoryItem {
                  id
                  tracked
                }
                userErrors {
                  field
                  message
                }
              }
            }`
          }),
        });

        const enableTrackingData = await enableTrackingResponse.json();
        if (enableTrackingData.data?.inventoryItemUpdate?.userErrors?.length > 0) {
          console.error(`[CREATE_PRODUCT] Failed to enable tracking for ${variant.title}:`, 
            enableTrackingData.data.inventoryItemUpdate.userErrors);
        } else {
          console.log(`[CREATE_PRODUCT] Successfully enabled tracking for ${variant.title}`);
        }
      }
      
      // Set inventory quantity
      const setInventoryResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
            inventorySetOnHandQuantities(
              input: {
                reason: "correction",
                setQuantities: [
                  {
                    inventoryItemId: "${inventoryItemId}",
                    locationId: "${locationId}",
                    quantity: ${quantity}
                  }
                ]
              }
            ) {
              inventoryLevels {
                id
                available
              }
              userErrors {
                field
                message
              }
            }
          }`
        }),
      });

      const setInventoryData = await setInventoryResponse.json();
      
      if (setInventoryData.data?.inventorySetOnHandQuantities?.userErrors?.length > 0) {
        console.error(`[CREATE_PRODUCT] Failed to set inventory for ${variant.title}:`, 
          setInventoryData.data.inventorySetOnHandQuantities.userErrors);
      } else {
        console.log(`[CREATE_PRODUCT] Successfully set inventory for ${variant.title} to ${quantity}`);
      }
    }
    
    console.log(`[CREATE_PRODUCT] Inventory setup completed`);
    
    return { success: true, productId };

  } catch (error) {
    console.error('[CREATE_PRODUCT] Unexpected error during product creation:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}