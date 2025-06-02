"use server";

import { TAGS } from "@/app/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/app/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: unknown,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      const cart = await createCart();
      if (!cart?.id) {
        return "Error creating cart";
      }
      cartId = cart.id;
      cookieStore.set("cartId", cartId, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }

    const result = await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);

    if (!result) {
      return "Error adding item to cart";
    }

    revalidateTag(TAGS.cart);
    return null;
  } catch (error) {
    console.error("Error in addItem:", error);
    return "Error adding item to cart";
  }
}

export async function updateItemQuantity(
  prevState: unknown,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  
  if (!cartId) {
    return "Missing cart ID";
  }

  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
    return null;
  } catch (error) {
    console.error("Error in updateItemQuantity:", error);
    return "Error updating item quantity";
  }
}

export async function removeItem(prevState: unknown, merchandiseId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
      return null;
    } else {
      return "Item not found in cart";
    }
  } catch (error) {
    console.error("Error in removeItem:", error);
    return "Error removing item from cart";
  }
}
  
export async function redirectToCheckout() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    throw new Error("Missing cart ID");
  }

  const cart = await getCart(cartId);

  if (!cart) {
    throw new Error("Error fetching cart");
  }

  redirect(cart.checkoutUrl);
}

export async function createCartAndSetCookie() {
  try {
    const cart = await createCart();
    if (!cart?.id) {
      throw new Error("Failed to create cart");
    }
    
    const cookieStore = await cookies();
    cookieStore.set("cartId", cart.id, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    return cart;
  } catch (error) {
    console.error("Error in createCartAndSetCookie:", error);
    throw error;
  }
}