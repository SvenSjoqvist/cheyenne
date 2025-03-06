// app/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { customerCreate, customerAccessTokenCreate } from '@/app/lib/shopify';
import { redirect } from 'next/navigation';

// Signup action
export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const acceptsMarketing = formData.get('acceptsMarketing') === 'on';

  if (!email || !password) {
    return {
      error: 'Email and password are required'
    };
  }

  try {
    // Create customer
    const createResponse = await customerCreate({
      email,
      password,
      firstName,
      lastName,
      acceptsMarketing
    });

    if (createResponse.customerUserErrors.length > 0) {
      return {
        error: createResponse.customerUserErrors.map(e => e.message).join(', ')
      };
    }

    // Auto-login after signup
    const loginResponse = await customerAccessTokenCreate(email, password);
    
    if (loginResponse.customerUserErrors.length > 0) {
      return {
        error: loginResponse.customerUserErrors.map(e => e.message).join(', ')
      };
    }

    if (loginResponse.customerAccessToken) {
      // Store token in HTTP-only cookies
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'customerAccessToken',
        value: loginResponse.customerAccessToken.accessToken,
        httpOnly: true,
        path: '/',
        expires: new Date(loginResponse.customerAccessToken.expiresAt),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });

      return {
        success: true
      };
    } else {
      return {
        error: 'Account created but login failed'
      };
    }
  } catch (error: unknown) {
    console.error('Signup error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Login action (if you don't have this already)
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      error: 'Email and password are required'
    };
  }

  try {
    const response = await customerAccessTokenCreate(email, password);
    
    if (response.customerUserErrors.length > 0) {
      return {
        error: response.customerUserErrors.map(e => e.message).join(', ')
      };
    }

    if (response.customerAccessToken) {
      // Store token in HTTP-only cookies
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'customerAccessToken',
        value: response.customerAccessToken.accessToken,
        httpOnly: true,
        path: '/',
        expires: new Date(response.customerAccessToken.expiresAt),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });

      return {
        success: true
      };
    } else {
      return {
        error: 'Login failed'
      };
    }
  } catch (error: unknown) {
    console.error('Login error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Logout action
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('customerAccessToken');
  redirect('/');
}

// Check if user is authenticated
export async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get('customerAccessToken')?.value;
  return !!token;
}