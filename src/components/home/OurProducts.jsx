import React, { useState, useEffect } from 'react';
import axios from '../../services/api'; // Using the configured api service which now points to prod
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import { FaEye, FaShoppingCart, FaArrowRight, FaUserPlus } from 'react-icons/fa';

const OurProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Using the axios instance from services/api ensures baseURL is used
            const response = await axios.get('/products?limit=3&featured=true');
            // Check if response data structure matches expected format
            // API might return { data: { products: [...] } } or just { products: [...] } or array
            // Adjusting based on common patterns, assuming response.data.data.products from previous code
            // But let's be safe and check
            const productsList = response.data.data?.products || response.data.products || [];
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback mock data if API fails (just so UI isn't empty during dev/testing if API is down)
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="py-20 flex justify-center"><Spinner /></div>;
    }

    return (
        <section className="py-24 bg-gray-50 relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-5">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16" data-aos="fade-up">
                    <span className="text-secondary-600 font-semibold tracking-wider uppercase mb-2 block">Premium Collection</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Featured Products</h2>
                    <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6 rounded-full"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Discover our top-rated garment production solutions, crafted for efficiency, durability, and style.
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {products.map((product, index) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                                    <img
                                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&w=400&q=80'} // Better fallback
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm uppercase tracking-wide">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <Link to={`/products/${product._id}`}>
                                            <Button variant="primary" className="w-full shadow-lg">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                        <span className="text-xl font-bold text-primary-600">${product.price}</span>
                                    </div>
                                    <p className="text-gray-500 mb-4 line-clamp-2 text-sm">{product.description}</p>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <span className={`text-sm font-medium ${product.availableQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {product.availableQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                        <button className="text-gray-400 hover:text-primary-600 transition-colors">
                                            <FaShoppingCart size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm mb-12">
                        <p className="text-gray-500">No featured products available at the moment.</p>
                    </div>
                )}

                {/* Call to Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6" data-aos="fade-up" data-aos-delay="200">
                    <Link to="/products">
                        <Button variant="outline" size="lg" className="min-w-[200px] border-2">
                            View All Products
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary" size="lg" className="min-w-[200px] shadow-lg shadow-primary-500/30 flex items-center justify-center">
                            <FaUserPlus className="mr-2" /> Join Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OurProducts;