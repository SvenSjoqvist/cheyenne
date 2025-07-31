"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/components/client/account/AccountContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { sendReview, getExistingReviews } from "@/app/lib/actions/reviews";


export default function Reviews() {
  const { orderId } = useParams();
  const { orders, user, customer } = useUser();
  const router = useRouter();
  const order = orders.find((order) => order.orderNumber === Number(orderId));

  const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});
  const [fitRatings, setFitRatings] = useState<{[key: string]: string}>({});
  const [heights, setHeights] = useState<{[key: string]: string}>({});
  const [waistSizes, setWaistSizes] = useState<{[key: string]: string}>({});
  const [titles, setTitles] = useState<{[key: string]: string}>({});
  const [descriptions, setDescriptions] = useState<{[key: string]: string}>({});
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch existing reviews for this order
    const fetchExistingReviews = async () => {
      if (!order?.orderNumber || !user?.id) return;
      
      try {
        const reviews = await getExistingReviews(order.orderNumber.toString(), user.id);
        if (reviews && reviews.length > 0) {
          const reviewed = new Set<string>();
          reviews.forEach(review => {
            // Create the same identifier format used in the server
            const identifier = `${review.productName}-${review.variant}`;
            reviewed.add(identifier);
          });
          setReviewedProducts(reviewed);
        } else {
          setReviewedProducts(new Set());
        }
      } catch (error) {
        console.error('Error fetching existing reviews:', error);
        setError('Failed to load existing reviews');
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchExistingReviews();
  }, [order?.orderNumber, user?.id]);

  const refreshReviewedProducts = async () => {
    if (!order?.orderNumber || !user?.id) return;
    
    try {
      const reviews = await getExistingReviews(order.orderNumber.toString(), user.id);
      
      if (reviews && reviews.length > 0) {
        const reviewed = new Set<string>();
        reviews.forEach(review => {
          const identifier = `${review.productName}-${review.variant}`;
          reviewed.add(identifier);
        });
        setReviewedProducts(reviewed);
      }
    } catch (error) {
      console.error('Error refreshing reviewed products:', error);
    }
  };

  if (!order) {
    return (
      <div className="pt-20 bg-[#F7F7F7] min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-[40px] font-[bero] mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.</p>
            <button 
              onClick={() => router.push('/account')}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Back to Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingReviews) {
    return (
      <div className="pt-20 bg-[#F7F7F7] min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading review information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if all items have been reviewed
  const allItemsReviewed = order.lineItems.edges.every(({ node }) => {
    const productIdentifier = `${node.title}-${node.variant?.title}`;
    return reviewedProducts.has(productIdentifier);
  });

  const handleItemSelect = (itemId: string, selected: boolean) => {
    // Create the same identifier format used in the server
    const lineItem = order.lineItems.edges.find(edge => edge.node.title === itemId);
    const productIdentifier = `${itemId}-${lineItem?.node.variant?.title}`;
    
    if (reviewedProducts.has(productIdentifier)) {
      // Don't allow selection of already reviewed items
      return;
    }
    
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: selected
    }));
  };

  const handleFitRatingChange = (itemId: string, rating: string) => {
    setFitRatings(prev => ({
      ...prev,
      [itemId]: rating
    }));
  };

  const handleHeightChange = (itemId: string, height: string) => {
    setHeights(prev => ({
      ...prev,
      [itemId]: height
    }));
  };

  const handleWaistSizeChange = (itemId: string, size: string) => {
    setWaistSizes(prev => ({
      ...prev,
      [itemId]: size
    }));
  };

  const handleTitleChange = (itemId: string, title: string) => {
    setTitles(prev => ({
      ...prev,
      [itemId]: title
    }));
  };

  const handleDescriptionChange = (itemId: string, description: string) => {
    setDescriptions(prev => ({
      ...prev,
      [itemId]: description
    }));
  };

  const handleRatingChange = (itemId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const reviewItems = Object.entries(selectedItems)
      .filter(([, selected]) => selected)
      .map(([itemId]) => ({
        itemId,
        fitRating: fitRatings[itemId],
        height: heights[itemId],
        waistSize: waistSizes[itemId],
        title: titles[itemId],
        description: descriptions[itemId],
        rating: ratings[itemId]
      }));

    if (reviewItems.length === 0) {
      setError("Please select at least one item to review");
      setIsSubmitting(false);
      return;
    }

    // Check if all selected items are already reviewed
    const allReviewed = reviewItems.every(item => {
      const productIdentifier = `${item.itemId}-${order.lineItems.edges.find(edge => edge.node.title === item.itemId)?.node.variant?.title}`;
      const isReviewed = reviewedProducts.has(productIdentifier);
      return isReviewed;
    });

    if (allReviewed) {
      setError("All selected items have already been reviewed. Please select different items to review.");
      setIsSubmitting(false);
      return;
    }

    // Validate that all required fields are filled for selected items
    const invalidItems = reviewItems.filter(item => 
      !item.title || !item.description || !item.rating || !item.fitRating
    );

    if (invalidItems.length > 0) {
      setError("Please fill in all required fields for each selected product");
      setIsSubmitting(false);
      return;
    }

    try {
      const items = reviewItems.map(item => {
        const lineItem = order.lineItems.edges.find(
          edge => edge.node.title === item.itemId
        );
        if (!lineItem?.node.title || !lineItem?.node.variant?.title) {
          throw new Error("Invalid item data");
        }
        return {
          name: lineItem.node.title,
          variant: lineItem.node.variant.title,
          fitRating: item.fitRating,
          height: item.height,
          waistSize: item.waistSize,
          title: item.title,
          description: item.description,
          rating: item.rating
        };
      });

      // Final check: ensure no already-reviewed items are being submitted
      const alreadyReviewedItems = items.filter(item => 
        reviewedProducts.has(`${item.name}-${item.variant}`)
      );
      
      if (alreadyReviewedItems.length > 0) {
        setError(`Cannot submit review: ${alreadyReviewedItems.length} item(s) have already been reviewed. Please refresh the page and try again.`);
        setIsSubmitting(false);
        return;
      }

      const customerEmail = user?.email || order.customer?.email;
      if (!customerEmail) {
        throw new Error("Customer email not found");
      }

      const customerId = user?.id;
      if (!customerId) {
        throw new Error("Customer ID not found");
      }

      const customerName = customer?.firstName && customer?.lastName 
        ? `${customer.firstName} ${customer.lastName}`
        : customer?.email?.split('@')[0] || 'Anonymous';

      const result = await sendReview(
        order.orderNumber,
        items,
        customerEmail,
        customerId,
        { customerName }
      );

      if (result.skippedItems > 0) {
        setSuccessMessage(`Review submitted successfully! ${result.skippedItems} items were skipped as they were already reviewed.`);
      } else {
        setSuccessMessage("Review submitted successfully. Thank you for your feedback!");
      }
      
      // Refresh the reviewed products set to include newly submitted reviews
      await refreshReviewedProducts();
      
      // Reset form
      setSelectedItems({});
      setFitRatings({});
      setHeights({});
      setWaistSizes({});
      setTitles({});
      setDescriptions({});
      setRatings({});
      
      // Clear any previous errors
      setError(null);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to submit review. Please try again or contact customer support.");
      }
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-4 justify-center items-center mb-10">
          <h1 className="text-[40px] font-[bero]">Product Review</h1>
          <p className="font-[16px] font-darker-grotesque w-2/4 text-center">
            Help other customers by sharing your experience with these products. Your feedback is valuable to us and our community.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {allItemsReviewed ? (
            <div className="text-center py-12">
              <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                <h2 className="text-2xl font-medium text-green-800 mb-4">All Items Reviewed!</h2>
                <p className="text-green-700 mb-6">
                  You have already reviewed all items in this order. Thank you for your feedback!
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/account')}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Back to Account
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-[32px] font-darker-grotesque font-medium mb-6">Select Items to Review</h2>
                <div className="space-y-4">
                  {order.lineItems.edges.map(({ node }) => (
                    <div key={node.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-6">
                          {node.variant?.image && (
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <Image
                                src={node.variant.image.url}
                                alt={node.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{node.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{node.variant?.title}</p>
                                {reviewedProducts.has(`${node.title}-${node.variant?.title}`) && (
                                  <p className="text-sm text-red-600 mt-2">
                                    You have already reviewed this item
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={node.id}
                                  checked={selectedItems[node.title] || false}
                                  onChange={(e) => handleItemSelect(node.title, e.target.checked)}
                                  disabled={reviewedProducts.has(`${node.title}-${node.variant?.title}`)}
                                  className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <label 
                                  htmlFor={node.id} 
                                  className={`text-sm ${reviewedProducts.has(`${node.title}-${node.variant?.title}`) ? 'text-gray-400' : 'text-gray-600'}`}
                                >
                                  Review this item
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedItems[node.title] && (
                        <div className="p-6 bg-gray-50">
                          <div className="max-w-2xl space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={titles[node.title] || ''}
                                onChange={(e) => handleTitleChange(node.title, e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Give your review a title"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Rating
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() => handleRatingChange(node.title, rating)}
                                    className={`text-2xl transition-colors hover:scale-110 ${
                                      ratings[node.title] >= rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Description
                              </label>
                              <textarea
                                value={descriptions[node.title] || ''}
                                onChange={(e) => handleDescriptionChange(node.title, e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent min-h-[120px]"
                                placeholder="Share your experience with this product..."
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                  How did it fit?
                                </label>
                                <select
                                  value={fitRatings[node.title] || ''}
                                  onChange={(e) => handleFitRatingChange(node.title, e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  required
                                >
                                  <option value="">Select fit</option>
                                  <option value="too_small">Too Small</option>
                                  <option value="slightly_small">Slightly Small</option>
                                  <option value="perfect">Perfect</option>
                                  <option value="slightly_large">Slightly Large</option>
                                  <option value="too_large">Too Large</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                  Your Height
                                </label>
                                <input
                                  type="text"
                                  value={heights[node.title] || ''}
                                  onChange={(e) => handleHeightChange(node.title, e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  placeholder="e.g., 5'9"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                  Your Waist Size
                                </label>
                                <input
                                  type="text"
                                  value={waistSizes[node.title] || ''}
                                  onChange={(e) => handleWaistSizeChange(node.title, e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  placeholder="e.g., 32"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-10"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}