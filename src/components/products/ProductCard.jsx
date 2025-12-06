import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
            data-aos="fade-up"
        >
            {/* Product Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {product.featured && (
                    <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <FaStar className="text-yellow-400" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">
                        ${product.price}
                    </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="flex items-center mr-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            Min: {product.minOrderQuantity}
                        </span>
                    </div>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`w-4 h-4 ${star <= (product.rating || 4)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Link to={`/products/${product._id}`} className="flex-1">
                        <Button variant="outline" className="w-full flex items-center justify-center">
                            <FaEye className="mr-2" /> Details
                        </Button>
                    </Link>
                    <Button className="flex-1 flex items-center justify-center">
                        <FaShoppingCart className="mr-2" /> Order
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;