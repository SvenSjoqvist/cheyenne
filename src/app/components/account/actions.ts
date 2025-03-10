"use server";
import { cookies } from "next/headers";
import {
  customerCreate,
  customerAccessTokenCreate,
  customerActivateByUrl,
  updateCustomer,
  getCustomer,
  getCustomerOrders,
} from "@/app/lib/shopify";
import { redirect } from "next/navigation";

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

export async function customerUpdate(formData: FormData) {
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;

  const response = await updateCustomer({
    email,
    firstName,
    lastName,
    phone,
  });
  return response;
}

export async function Customer() {
  const response = await getCustomer();
  console.log(response);

  return response;
}

export async function getCustomerOrder() {
  const response = await getCustomerOrders();
  return response;
}
