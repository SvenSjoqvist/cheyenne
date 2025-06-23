'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { createProduct } from '@/app/lib/actions/products';

interface AddProductFormProps {
  onProductAdded?: () => void;
}

interface ProductFormData {
  name: string;
  colorDescription: string;
  price: string;
  quantityXS: number;
  quantityS: number;
  quantityM: number;
  quantityL: number;
  quantityXL: number;
  category: string;
  description: string;
  images: File[];
}

export default function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    colorDescription: '',
    price: '',
    quantityXS: 0,
    quantityS: 0,
    quantityM: 0,
    quantityL: 0,
    quantityXL: 0,
    category: '',
    description: '',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('quantity') ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files before adding them
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach((file) => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported image type. Please use JPEG, PNG, WebP, or GIF.`);
        return;
      }
      
      validFiles.push(file);
    });
    
    // Show errors if any
    if (errors.length > 0) {
      setMessage({ type: 'error', text: errors.join('\n') });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: validFiles
    }));

    // Create preview URLs
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
  
    try {
      // Create FormData object
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('colorDescription', formData.colorDescription);
      formDataToSubmit.append('price', formData.price);
      
      // Add each size quantity separately
      formDataToSubmit.append('quantityXS', formData.quantityXS.toString());
      formDataToSubmit.append('quantityS', formData.quantityS.toString());
      formDataToSubmit.append('quantityM', formData.quantityM.toString());
      formDataToSubmit.append('quantityL', formData.quantityL.toString());
      formDataToSubmit.append('quantityXL', formData.quantityXL.toString());
      
      // Add sizes as a separate field - this is the key addition
      formDataToSubmit.append('sizes', JSON.stringify(['XS', 'S', 'M', 'L', 'XL']));
      
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('description', formData.description);
      
      // Append images
      formData.images.forEach((image) => {
        formDataToSubmit.append('images', image);
      });
  
      // Call server action
      const result = await createProduct(formDataToSubmit);

      if (result.success) {
        setMessage({ type: 'success', text: 'Product created successfully!' });
        
        // Reset form
        setFormData({
          name: '',
          colorDescription: '',
          price: '',
          quantityXS: 0,
          quantityS: 0,
          quantityM: 0,
          quantityL: 0,
          quantityXL: 0,
          category: '',
          description: '',
          images: []
        });
        setPreviewImages([]);
        
        // Clear file input
        const fileInput = document.getElementById('product-images') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        onProductAdded?.();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create product' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-[#DADEE0]">
      <h2 className="text-2xl font-bold font-darker-grotesque mb-6">Add New Product</h2>
      
      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        {/* Color Description */}
        <div>
          <label htmlFor="colorDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Color Variant *
          </label>
          <input
            type="text"
            id="colorDescription"
            name="colorDescription"
            value={formData.colorDescription}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Navy Blue, Forest Green, Black"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {/* Quantity Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity by Size *
          </label>
          <div className="grid grid-cols-5 gap-4">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <div key={size}>
                <label htmlFor={`quantity${size}`} className="block text-xs text-gray-600 mb-1">
                  {size}
                </label>
                <input
                  type="number"
                  id={`quantity${size}`}
                  name={`quantity${size}`}
                  value={formData[`quantity${size}` as keyof ProductFormData] as number}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="dresses">Dresses</option>
            <option value="outerwear">Outerwear</option>
            <option value="accessories">Accessories</option>
            <option value="shoes">Shoes</option>
            <option value="bags">Bags</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="product-images" className="block text-sm font-medium text-gray-700 mb-2">
            Product Images *
          </label>
          <input
            type="file"
            id="product-images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Image Previews */}
          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product description..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-darker-grotesque"
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
} 