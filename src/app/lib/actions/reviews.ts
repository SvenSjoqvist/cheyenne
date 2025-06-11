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

export async function getExistingReviews(orderId: string, customerId: string) {
  try {
    const reviews = await prisma.reviewItem.findMany({
      where: {
        review: {
          orderId: orderId,
          customerId: customerId
        }
      },
      include: {
        review: {
          select: {
            customerName: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      },
      take: 50
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
}

export async function sendReview(
  orderNumber: number,
  orderId: string,
  items: ReviewItem[],
  customerEmail: string,
  customerId: string,
  reviewData: ReviewData
) {
  try {
    console.log('Received reviewData:', reviewData); // Debug log
    
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
      include: {
        review: true
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

    console.log('Creating review with data:', { // Debug log
      orderId,
      orderNumber,
      customerEmail,
      customerId,
      reviewData
    });

    const review = await prisma.review.create({
      data: {
        orderId,
        orderNumber,
        customerEmail,
        customerId,
        customerName: reviewData.customerName,
        items: {
          create: newItems.map(item => ({
            productName: item.name,
            variant: item.variant,
            fitRating: mapFitRating(item.fitRating),
            height: item.height,
            waistSize: item.waistSize,
            purchasedSize: item.variant.split('/')[0].trim(), // Extract size from variant (e.g., "M / Black" -> "M")
            title: item.title,
            description: item.description,
            rating: item.rating,
          })),
        },
      },
    });

    return {
      review,
      skippedItems: items.length - newItems.length
    };
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
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
    const reviews = await prisma.reviewItem.findMany({
      where: {
        productName: productName
      },
      include: {
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