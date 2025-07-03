"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProductServerAction } from "@/app/lib/actions/products";

interface DeleteProductButtonProps {
  productId: string;
}

export default function DeleteProductButton({
  productId,
}: DeleteProductButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const result = await deleteProductServerAction(productId);
      if (result.success) {
        router.push("/dashboard/inventory");
        router.refresh();
      } else {
        setError(result.error || "Failed to delete product");
        setIsDeleting(false);
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete product"
      );
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-20 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowConfirmDialog(true)}
          className="px-6 py-2.5 bg-[#212121] text-white font-semibold rounded-lg transition-colors hover:bg-gray-800 font-darker-grotesque text-lg"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-darker-grotesque font-semibold mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[#212121] text-white font-semibold rounded-lg transition-colors hover:bg-gray-800"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
