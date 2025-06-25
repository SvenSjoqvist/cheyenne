'use server';

import { revalidateTag } from 'next/cache';
import { TAGS } from '../constants';
import { protectServerAction } from '@/app/lib/auth-utils';

export async function revalidateProducts() {
  // Protect admin function
  await protectServerAction();
  
  try {
    revalidateTag(TAGS.products);
  } catch (error) {
    console.error('Error revalidating products:', error);
  }
} 