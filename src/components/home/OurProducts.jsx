import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

const OurProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products?limit=6&featured=true');
            setProducts(response.data.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-4xl font-bold mb-4">Our Featured Products</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover our premium collection of garments, crafted with precision and care
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                            data-aos="fade-up"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                                    <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                                        {product.category}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        Stock: {product.quantity}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/products/${product._id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            <FaEye className="mr-2" /> View Details
                                        </Button>
                                    </Link>
                                    <Button className="flex-1">
                                        <FaShoppingCart className="mr-2" /> Order Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12" data-aos="fade-up">
                    <Link to="/products">
                        <Button size="lg">View All Products</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OurProducts;