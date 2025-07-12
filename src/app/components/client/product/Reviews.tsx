'use client';

import { useState, useEffect } from 'react';
import { getProductReviews } from '@/app/lib/actions/reviews';

interface ReviewItem {
  id: string;
  productName: string;
  variant: string;
  fitRating: string;
  height: string | null;
  waistSize: string | null;
  purchasedSize: string;
  title: string;
  description: string;
  rating: number;
  createdAt: string;
  review: {
    customerName: string;
  };
}

interface ReviewsProps {
  productName: string;
}

export default function Reviews({ productName }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { reviews: fetchedReviews, error } = await getProductReviews(productName);
        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }
        setReviews(fetchedReviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productName]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-[bero] mb-6">Customer Reviews</h2>
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{review.title}</h3>
                <p className="text-sm text-gray-500 mt-1">by {review.review.customerName}</p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{review.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Fit:</span>{' '}
                {review.fitRating.replace(/_/g, ' ').toLowerCase()}
              </div>
              {review.height && (
                <div>
                  <span className="font-medium">Height:</span> {review.height}
                </div>
              )}
              {review.waistSize && (
                <div>
                  <span className="font-medium">Waist Size:</span> {review.waistSize}
                </div>
              )}
              <div>
                <span className="font-medium">Purchased Size:</span> {review.purchasedSize}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
