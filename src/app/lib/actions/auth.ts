'use server';

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma/client";

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    // Verify credentials directly
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return { error: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: 'Invalid credentials' };
    }

    // If credentials are valid, redirect to dashboard
    // The session will be created by NextAuth middleware
    redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An error occurred during login' };
  }
}

export async function logoutAction() {
  await signOut({ redirect: true, callbackUrl: '/admin/login' });
}

export async function createAdminUser(email: string, password: string, name?: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      }
    });

    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { error: 'Failed to create admin user' };
  }
} 