'use server';

import { revalidateTag } from 'next/cache';
import { TAGS } from '../constants';

export async function revalidateProducts() {
  try {
    revalidateTag(TAGS.products);
  } catch (error) {
    console.error('Error revalidating products:', error);
  }
} 