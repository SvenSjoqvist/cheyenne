'use server';

import { prisma } from '@/app/lib/prisma/client';
import { protectServerAction, sanitizeInput, validateEmail, validatePassword } from '@/app/lib/auth-utils';
import bcrypt from 'bcryptjs';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

interface SanitizedUserUpdates {
  name?: string;
  email?: string;
}

// Create a new user
export async function createUser(userData: CreateUserData) {
  try {
    // Protect admin function
    await protectServerAction();
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(userData.name),
      email: sanitizeInput(userData.email).toLowerCase(),
      password: userData.password
    };
    
    // Validate inputs
    if (!validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format');
    }
    
    const passwordValidation = validatePassword(sanitizedData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedData.email }
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(sanitizedData.password, 12);
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        emailVerified: true
      }
    });
    
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create user');
  }
}

// Update user
export async function updateUser(userId: string, updates: UpdateUserData) {
  try {
    // Protect admin function
    await protectServerAction();
    
    // Sanitize inputs
    const sanitizedUpdates: SanitizedUserUpdates = {};
    if (updates.name) {
      sanitizedUpdates.name = sanitizeInput(updates.name);
    }
    if (updates.email) {
      const sanitizedEmail = sanitizeInput(updates.email).toLowerCase();
      if (!validateEmail(sanitizedEmail)) {
        throw new Error('Invalid email format');
      }
      sanitizedUpdates.email = sanitizedEmail;
    }
    
    // Check if email is already taken by another user
    if (sanitizedUpdates.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: sanitizedUpdates.email,
          id: { not: userId }
        }
      });
      
      if (existingUser) {
        throw new Error('Email is already taken by another user');
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: sanitizedUpdates,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        emailVerified: true
      }
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update user');
  }
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    // Protect admin function
    await protectServerAction();
    
    // Sanitize input
    const sanitizedUserId = sanitizeInput(userId);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: sanitizedUserId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Prevent deleting the last admin user (you might want to add role-based logic here)
    const totalUsers = await prisma.user.count();
    if (totalUsers <= 1) {
      throw new Error('Cannot delete the last user');
    }
    
    // Delete user (this will cascade delete related records like sessions)
    await prisma.user.delete({
      where: { id: sanitizedUserId }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user');
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    // Protect admin function
    await protectServerAction();
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        emailVerified: true
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    console.error('Failed to get user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get user');
  }
}

// Get all users (for admin dashboard)
export async function getAllUsers() {
  try {
    // Protect admin function
    await protectServerAction();
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        emailVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return users;
  } catch (error) {
    console.error('Failed to get users:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get users');
  }
} 