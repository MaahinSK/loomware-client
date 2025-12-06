import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingCart, FaTruck, FaShieldAlt, FaStar, FaShare, FaHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isApproved } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`/products/${id}`);
            setProduct(response.data.data.product);
            setQuantity(response.data.data.product.minOrderQuantity || 1);
        } catch (error) {
            toast.error('Failed to fetch product details');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (value) => {
        const newQuantity = parseInt(value);
        if (newQuantity < (product.minOrderQuantity || 1)) {
            toast.error(`Minimum order quantity is ${product.minOrderQuantity}`);
            return;
        }
        if (newQuantity > product.quantity) {
            toast.error(`Only ${product.quantity} items available`);
            return;
        }
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.info('Please login to place an order');
            navigate('/login');
            return;
        }

        if (!isApproved()) {
            toast.error('Your account is pending approval. You cannot place orders yet.');
            return;
        }

        // Navigate to order form
        navigate(`/order/${id}`, {
            state: {
                product,
                quantity
            }
        });
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.info('Please login to place an order');
            navigate('/login');
            return;
        }

        if (!isApproved()) {
            toast.error('Your account is pending approval. You cannot place orders yet.');
            return;
        }

        // Navigate to checkout
        navigate('/checkout', {
            state: {
                product,
                quantity,
                immediate: true
            }
        });
    };

    if (loading) {
        return <Spinner fullScreen />;
    }

    if (!product) {
        return null;
    }

    const totalPrice = (product.price * quantity).toFixed(2);

    return (
        <>
            <Helmet>
                <title>{product.name} - LoomWare</title>
                <meta name="description" content={product.description} />
            </Helmet>

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <a href="/" className="text-gray-500 hover:text-primary-600">
                                    Home
                                </a>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <a href="/products" className="text-gray-500 hover:text-primary-600">
                                    Products
                                </a>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-800 font-medium">{product.name}</li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-aos="fade-up">
                        {/* Product Images */}
                        <div>
                            {/* Main Image Swiper */}
                            <div className="mb-4 rounded-xl overflow-hidden">
                                <Swiper
                                    spaceBetween={10}
                                    navigation={true}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[Navigation, Thumbs, Zoom]}
                                    className="product-main-swiper"
                                >
                                    {product.images?.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="relative h-[400px] md:h-[500px]">
                                                <img
                                                    src={img}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* Thumbnail Swiper */}
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[Thumbs]}
                                className="product-thumbs-swiper"
                            >
                                {product.images?.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="cursor-pointer border-2 border-transparent hover:border-primary-500 rounded-lg overflow-hidden">
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-20 object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-6">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                    {product.name}
                                </h1>
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center mr-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`w-5 h-5 ${star <= (product.rating || 4)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-600">
                                            ({product.reviewCount || 24} reviews)
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-4xl font-bold text-primary-600">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="ml-3 text-xl text-gray-400 line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">In Stock</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {product.quantity} units available
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4">Description</h3>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Specifications */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Minimum Order</p>
                                        <p className="font-medium">{product.minOrderQuantity} units</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Material</p>
                                        <p className="font-medium">{product.material || 'Cotton'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Size</p>
                                        <p className="font-medium">{product.size || 'One Size'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Color</p>
                                        <p className="font-medium">{product.color || 'Various'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Section */}
                            <div className="border-t pt-8">
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-lg font-medium">Quantity</label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                                    onClick={() => handleQuantityChange(quantity - 1)}
                                                    disabled={quantity <= (product.minOrderQuantity || 1)}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min={product.minOrderQuantity || 1}
                                                    max={product.quantity}
                                                    value={quantity}
                                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                                    className="w-16 text-center border-x py-2"
                                                />
                                                <button
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                                    onClick={() => handleQuantityChange(quantity + 1)}
                                                    disabled={quantity >= product.quantity}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-gray-600">
                                                Min: {product.minOrderQuantity}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-lg font-medium">Total Price</span>
                                        <span className="text-3xl font-bold text-primary-600">
                                            ${totalPrice}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        className="flex-1 flex items-center justify-center py-4"
                                        onClick={handleAddToCart}
                                    >
                                        <FaShoppingCart className="mr-3" />
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 flex items-center justify-center py-4"
                                        onClick={handleBuyNow}
                                    >
                                        <FaTruck className="mr-3" />
                                        Buy Now
                                    </Button>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <FaTruck className="text-primary-500 mr-3" />
                                        <div>
                                            <p className="font-medium">Free Shipping</p>
                                            <p className="text-sm text-gray-600">On orders over $100</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FaShieldAlt className="text-primary-500 mr-3" />
                                        <div>
                                            <p className="font-medium">Secure Payment</p>
                                            <p className="text-sm text-gray-600">100% secure</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Share & Save */}
                                <div className="mt-6 flex items-center justify-between border-t pt-6">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center text-gray-600 hover:text-primary-600">
                                            <FaShare className="mr-2" />
                                            Share
                                        </button>
                                        <button className="flex items-center text-gray-600 hover:text-red-600">
                                            <FaHeart className="mr-2" />
                                            Save
                                        </button>
                                    </div>
                                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                                        Report this product
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Related product cards would go here */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailsPage;