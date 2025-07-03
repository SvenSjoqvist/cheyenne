import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";

// Server-side session validation
export async function getSession() {
  return await getServerSession(authOptions);
}

// API route protection middleware
export async function protectApiRoute() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
}

// Server action protection wrapper
export async function protectServerAction() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized: Authentication required");
  }

  // Verify user still exists in database
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      throw new Error("Unauthorized: User not found");
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    throw new Error("Unauthorized: Authentication failed");
  }

  return session;
}

// CSRF protection utility
export function validateCSRFToken(token: string, sessionToken: string) {
  // In a real implementation, you'd validate against a stored token
  // For now, we'll use a simple check
  return token && sessionToken && token === sessionToken;
}

// Input validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 1000); // Limit length
}
