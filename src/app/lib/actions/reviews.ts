"use server";

import { prisma } from "@/app/lib/prisma";
import { FitRating } from "@prisma/client";

interface ReviewItem {
  name: string;
  variant: string;
  fitRating: string;
  height?: string;
  waistSize?: string;
  title: string;
  description: string;
  rating: number;
}

interface ReviewData {
  customerName: string;
}

export async function getExistingReviews(orderNumber: string, customerId: string) {
  try {
    // Validate inputs
    if (!orderNumber || !customerId) {
      throw new Error('Invalid request parameters');
    }

    const reviews = await prisma.reviewItem.findMany({
      where: {
        review: {
          orderNumber: parseInt(orderNumber),
          customerId: customerId
        }
      },
      select: {
        productName: true,
        variant: true,
        id: true
      },
      orderBy: {
        id: 'asc'
      },
      take: 50
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Don't expose database errors to client
    throw new Error('Failed to fetch existing reviews');
  }
}

export async function sendReview(
  orderNumber: number,
  items: ReviewItem[],
  customerEmail: string,
  customerId: string,
  reviewData: ReviewData
) {
  try {
    // Validate inputs
    if (!orderNumber || !customerEmail || !customerId || !reviewData?.customerName) {
      throw new Error('Missing required review information');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('No items provided for review');
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || !item.variant || !item.title || !item.description || !item.rating || !item.fitRating) {
        throw new Error('Invalid item data provided');
      }
      
      if (item.rating < 1 || item.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
    }
    
    // Check for existing reviews for these products by this customer
    const existingReviews = await prisma.reviewItem.findMany({
      where: {
        review: {
          customerId: customerId
        },
        OR: items.map(item => ({
          AND: [
            { productName: item.name },
            { variant: item.variant }
          ]
        }))
      },
      select: {
        productName: true,
        variant: true
      }
    });

    // Filter out items that have already been reviewed
    const reviewedProducts = new Set(
      existingReviews.map(item => `${item.productName}-${item.variant}`)
    );

    const newItems = items.filter(item => !reviewedProducts.has(`${item.name}-${item.variant}`));

    if (newItems.length === 0) {
      throw new Error('You have already reviewed all selected products');
    }

    const review = await prisma.review.create({
      data: {
        orderId: orderNumber.toString(),
        orderNumber,
        customerEmail,
        customerId,
        customerName: reviewData.customerName,
        items: {
          create: newItems.map(item => ({
            productName: item.name,
            variant: item.variant,
            fitRating: mapFitRating(item.fitRating),
            height: item.height || null,
            waistSize: item.waistSize || null,
            purchasedSize: item.variant.split('/')[0].trim(), // Extract size from variant (e.g., "M / Black" -> "M")
            title: item.title,
            description: item.description,
            rating: item.rating,
          })),
        },
      },
    });

    return {
      review: {
        id: review.id,
        orderNumber: review.orderNumber,
        createdAt: review.createdAt
      },
      skippedItems: items.length - newItems.length
    };
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Sanitize errors before sending to client
    if (error instanceof Error) {
      // Only allow specific error messages to be sent to client
      const allowedErrors = [
        'Missing required review information',
        'No items provided for review',
        'Invalid item data provided',
        'Rating must be between 1 and 5',
        'You have already reviewed all selected products'
      ];
      
      if (allowedErrors.includes(error.message)) {
        throw error;
      }
    }
    
    // Generic error for any other issues
    throw new Error('Failed to submit review. Please try again.');
  }
}

// Helper function to map string fit ratings to enum values
function mapFitRating(fitRating: string): FitRating {
  switch (fitRating) {
    case 'too_small':
    case 'slightly_small':
      return FitRating.RUNS_SMALL;
    case 'perfect':
      return FitRating.TRUE_TO_SIZE;
    case 'too_large':
    case 'slightly_large':
      return FitRating.RUNS_LARGE;
    default:
      return FitRating.TRUE_TO_SIZE;
  }
}

export async function getProductReviews(productName: string) {
  try {
    if (!productName) {
      throw new Error('Product name is required');
    }

    const reviews = await prisma.reviewItem.findMany({
      where: {
        productName: productName
      },
      select: {
        id: true,
        productName: true,
        variant: true,
        fitRating: true,
        height: true,
        waistSize: true,
        purchasedSize: true,
        title: true,
        description: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        review: {
          select: {
            customerName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform dates to strings for client-side consumption
    const transformedReviews = reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString()
    }));

    return { reviews: transformedReviews };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { error: 'Failed to fetch reviews' };
  }
} 