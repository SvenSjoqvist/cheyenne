"use server";
import { cookies } from "next/headers";
import {
  customerCreate,
  customerAccessTokenCreate,
  customerActivateByUrl,
  getCustomer,
  getCustomerOrders,
  customerRecover,
} from "@/app/lib/shopify";
import { redirect } from "next/navigation";
import { addSubscriber } from "@/app/lib/prisma";

interface ShopifyError {
  code?: string;
  message: string;
  fields?: string[];
}

export async function getCookies({ cookieName }: { cookieName: string }) {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName);
}

// Signup action
export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const acceptsMarketing = formData.get("acceptsMarketing") === "on";

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  try {
    // Create customer
    const createResponse = await customerCreate({
      email,
      password,
      firstName,
      lastName,
      acceptsMarketing,
    });

    if (createResponse.customerUserErrors.length > 0) {
      return {
        error: createResponse.customerUserErrors
          .map((e) => e.message)
          .join(", "),
      };
    }

    // Add to subscribers list if marketing is accepted
    if (acceptsMarketing) {
      try {
        await addSubscriber(email);
      } catch (error) {
        // If subscription fails, we still want to continue with account creation
        console.error("Failed to add to subscriber list:", error);
      }
    }

    // Auto-login after signup
    const loginResponse = await customerAccessTokenCreate(email, password);

    if (loginResponse.customerUserErrors.length > 0) {
      return {
        error: loginResponse.customerUserErrors
          .map((e) => e.message)
          .join(", "),
      };
    }

    if (loginResponse.customerAccessToken) {
      // Store token in HTTP-only cookies
      const cookieStore = await cookies();
      cookieStore.set({
        name: "customerAccessToken",
        value: loginResponse.customerAccessToken.accessToken,
        httpOnly: true,
        path: "/",
        expires: new Date(loginResponse.customerAccessToken.expiresAt),
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return {
        success: true,
      };
    } else {
      return {
        error: "Account created but login failed",
      };
    }
  } catch (error: unknown) {
    console.error("Signup error:", error);
    // Check if it's a Shopify error with code and message
    if (typeof error === "object" && error !== null && "code" in error) {
      const shopifyError = error as ShopifyError;
      if (shopifyError.code === "TAKEN") {
        return {
          error:
            "This email address is already registered. Please try logging in instead.",
        };
      }
      return { error: shopifyError.message };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  try {
    const response = await customerAccessTokenCreate(email, password);

    if (response.customerUserErrors.length > 0) {
      return {
        error: response.customerUserErrors.map((e) => e.message).join(", "),
      };
    }

    if (response.customerAccessToken) {
      // Store token in HTTP-only cookies
      const cookieStore = await cookies();
      cookieStore.set({
        name: "customerAccessToken",
        value: response.customerAccessToken.accessToken,
        httpOnly: true,
        path: "/",
        expires: new Date(response.customerAccessToken.expiresAt),
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return {
        success: true,
      };
    } else {
      return {
        error: "Login failed",
      };
    }
  } catch (error: unknown) {
    console.error("Login error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Logout action
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("customerAccessToken");
  redirect("/");
}

// Check if user is authenticated
export async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;
  return !!token;
}

export async function activateAccount(activationUrl: string, password: string) {
  const response = await customerActivateByUrl(activationUrl, password);
  return response;
}

export async function setCustomerAccessToken(token: string, expiresAt: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "customerAccessToken",
    value: token,
    httpOnly: true,
    path: "/",
    expires: new Date(expiresAt),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true };
}

export async function Customer() {
  const response = await getCustomer();
  return response;
}

export async function getCustomerOrder() {
  const response = await getCustomerOrders();
  return response;
}

export async function lostPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const response = await customerRecover(email);
  return response;
}
