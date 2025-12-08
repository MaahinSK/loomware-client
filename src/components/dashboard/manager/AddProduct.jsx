import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import { Helmet } from 'react-helmet-async';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

const schema = yup.object({
    name: yup.string().required('Product name is required'),
    description: yup.string().required('Description is required'),
    category: yup.string().required('Category is required'),
    price: yup.number().positive('Price must be positive').required('Price is required'),
    quantity: yup.number().integer().min(0, 'Quantity cannot be negative').required('Quantity is required'),
    minOrderQuantity: yup.number().integer().min(1, 'Minimum order must be at least 1').required('Minimum order is required'),
    paymentOptions: yup.array().min(1, 'Select at least one payment option').required(),
    showOnHome: yup.boolean().default(false),
}).required();

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            paymentOptions: ['Cash on Delivery'],
            showOnHome: false,
        },
    });

    const categories = ['Shirt', 'Pant', 'Jacket', 'Suits', 'Accessories', 'Dress', 'Skirt', 'T-Shirt'];
    const paymentOptions = [
        { value: 'Cash on Delivery', label: 'Cash on Delivery' },
        { value: 'Stripe', label: 'Stripe' },
    ];

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        setImages([...images, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...imagePreviews];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            // Map frontend field names to backend expected names
            const fieldMapping = {
                name: data.name,
                description: data.description,
                category: data.category,
                price: data.price,
                availableQuantity: data.quantity,
                minimumOrderQuantity: data.minOrderQuantity,
                paymentOptions: JSON.stringify(data.paymentOptions),
                showOnHome: data.showOnHome
            };

            // Append product data with correct field names
            Object.keys(fieldMapping).forEach(key => {
                formData.append(key, fieldMapping[key]);
            });

            // Append images
            images.forEach((image) => {
                formData.append('images', image);
            });

            await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Product added successfully!');
            reset();
            setImages([]);
            setImagePreviews([]);
        } catch (error) {
            toast.error('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Add Product - Manager Dashboard</title>
            </Helmet>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                    <p className="text-gray-600">Add a new product to your catalog</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className="input-field"
                                placeholder="Enter product name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select {...register('category')} className="input-field">
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price')}
                                className="input-field"
                                placeholder="0.00"
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                            )}
                        </div>

                        {/* Available Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Quantity *
                            </label>
                            <input
                                type="number"
                                {...register('quantity')}
                                className="input-field"
                                placeholder="0"
                            />
                            {errors.quantity && (
                                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                            )}
                        </div>

                        {/* Minimum Order Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Order Quantity *
                            </label>
                            <input
                                type="number"
                                {...register('minOrderQuantity')}
                                className="input-field"
                                placeholder="1"
                            />
                            {errors.minOrderQuantity && (
                                <p className="mt-1 text-sm text-red-600">{errors.minOrderQuantity.message}</p>
                            )}
                        </div>

                        {/* Payment Options */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Options *
                            </label>
                            <div className="space-y-2">
                                {paymentOptions.map((option) => (
                                    <label key={option.value} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={option.value}
                                            {...register('paymentOptions')}
                                            className="rounded text-primary-600"
                                        />
                                        <span className="ml-2 text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.paymentOptions && (
                                <p className="mt-1 text-sm text-red-600">{errors.paymentOptions.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            {...register('description')}
                            rows="4"
                            className="input-field"
                            placeholder="Enter product description..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-3" />
                                <p className="text-gray-600">Click to upload images</p>
                                <p className="text-sm text-gray-500 mt-1">Maximum 5 images, PNG, JPG, JPEG</p>
                            </label>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Show on Home Page */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showOnHome"
                            {...register('showOnHome')}
                            className="h-4 w-4 text-primary-600 rounded"
                        />
                        <label htmlFor="showOnHome" className="ml-2 text-gray-700">
                            Show this product on home page
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                            {loading ? <Spinner size="sm" className="text-white" /> : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;