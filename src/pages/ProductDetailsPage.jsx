import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingCart, FaTruck, FaShieldAlt, FaStar, FaShare, FaHeart, FaBox, FaTag, FaStore } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isApproved } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchProductDetails();
        fetchRelatedProducts();
        checkFavoriteStatus();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data.data.product);
            setQuantity(response.data.data.product.minOrderQuantity || 1);
        } catch (error) {
            toast.error('Failed to fetch product details');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async () => {
        try {
            const response = await axios.get(`/api/products/related/${id}`);
            setRelatedProducts(response.data.data.products || []);
        } catch (error) {
            console.error('Failed to fetch related products:', error);
        }
    };

    const checkFavoriteStatus = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(id));
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

        // Add to cart logic
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.productId === id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId: id,
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                quantity: quantity,
                minOrder: product.minOrderQuantity,
                maxOrder: product.quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Product added to cart!');
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

        // Navigate to checkout with this product
        navigate('/checkout', {
            state: {
                products: [{
                    productId: id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0],
                    quantity: quantity
                }]
            }
        });
    };

    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        if (isFavorite) {
            const newFavorites = favorites.filter(favId => favId !== id);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            setIsFavorite(false);
            toast.success('Removed from favorites');
        } else {
            favorites.push(id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(true);
            toast.success('Added to favorites');
        }
    };

    const handleShareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Check out ${product.name} on LoomWare`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return <Spinner fullScreen />;
    }

    if (!product) {
        return null;
    }

    const totalPrice = (product.price * quantity).toFixed(2);
    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <>
            <Helmet>
                <title>{product.name} - LoomWare</title>
                <meta name="description" content={product.description.substring(0, 160)} />
                <meta property="og:title" content={product.name} />
                <meta property="og:description" content={product.description.substring(0, 160)} />
                <meta property="og:image" content={product.images?.[0]} />
            </Helmet>

            <div className="min-h-screen bg-gray-50 py-8">
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
                            <li>
                                <a href={`/products?category=${product.category}`} className="text-gray-500 hover:text-primary-600">
                                    {product.category}
                                </a>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-800 font-medium truncate max-w-xs">{product.name}</li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" data-aos="fade-up">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image Swiper */}
                            <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                                <Swiper
                                    spaceBetween={10}
                                    navigation={true}
                                    pagination={{ clickable: true }}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[Navigation, Thumbs, Pagination, Autoplay]}
                                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                                    className="h-96 md:h-[500px]"
                                >
                                    {product.images?.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="relative h-full flex items-center justify-center bg-gray-100">
                                                <img
                                                    src={img}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    className="w-full h-full object-contain p-4"
                                                />
                                                {index === 0 && discountPercentage > 0 && (
                                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                        -{discountPercentage}%
                                                    </div>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* Thumbnail Swiper */}
                            {product.images && product.images.length > 1 && (
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    spaceBetween={10}
                                    slidesPerView={4}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[Thumbs]}
                                    className="h-24"
                                >
                                    {product.images?.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="cursor-pointer border-2 border-transparent hover:border-primary-500 rounded-lg overflow-hidden bg-white shadow-sm">
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        {product.name}
                                    </h1>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleToggleFavorite}
                                            className={`p-2 rounded-full ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:text-red-500'}`}
                                        >
                                            <FaHeart className={isFavorite ? 'fill-current' : ''} />
                                        </button>
                                        <button
                                            onClick={handleShareProduct}
                                            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:text-primary-600"
                                        >
                                            <FaShare />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center mb-4 space-x-4">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`w-5 h-5 ${star <= (product.rating || 4)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-600">
                                            ({product.reviewCount || 24} reviews)
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                                        {product.category}
                                    </span>
                                </div>

                                {/* SKU & Brand */}
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FaTag className="mr-2" />
                                        <span>SKU: {product.sku || `LW-${id.slice(-8)}`}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaStore className="mr-2" />
                                        <span>Brand: {product.brand || 'LoomWare'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                                <div className="flex items-end justify-between">
                                    <div>
                                        {product.originalPrice && (
                                            <div className="flex items-center mb-2">
                                                <span className="text-2xl text-gray-400 line-through mr-3">
                                                    ${product.originalPrice}
                                                </span>
                                                {discountPercentage > 0 && (
                                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                                        Save {discountPercentage}%
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <span className="text-4xl font-bold text-primary-600">
                                            ${product.price}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-1">Price per unit</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-green-600 mb-2">
                                            <FaBox className="mr-2" />
                                            <span className="font-medium">{product.quantity} in stock</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Min order: {product.minOrderQuantity} units
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-lg font-medium text-gray-800">Quantity</label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border rounded-lg">
                                            <button
                                                className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                className="w-16 text-center border-x py-3 focus:outline-none"
                                            />
                                            <button
                                                className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleQuantityChange(quantity + 1)}
                                                disabled={quantity >= product.quantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-gray-600 text-sm">
                                            Max: {product.quantity}
                                        </span>
                                    </div>
                                </div>

                                {/* Total Price */}
                                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                                    <span className="text-lg font-medium">Total Price</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-primary-600">
                                            ${totalPrice}
                                        </span>
                                        <p className="text-sm text-gray-600">
                                            {quantity} units × ${product.price}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        className="flex-1 flex items-center justify-center py-4"
                                        onClick={handleAddToCart}
                                        disabled={product.quantity === 0}
                                    >
                                        <FaShoppingCart className="mr-3" />
                                        {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 flex items-center justify-center py-4"
                                        onClick={handleBuyNow}
                                        disabled={product.quantity === 0}
                                    >
                                        <FaTruck className="mr-3" />
                                        Buy Now
                                    </Button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                                    <FaTruck className="text-primary-500 text-2xl mr-4" />
                                    <div>
                                        <p className="font-medium">Free Shipping</p>
                                        <p className="text-sm text-gray-600">Orders over $100</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                                    <FaShieldAlt className="text-primary-500 text-2xl mr-4" />
                                    <div>
                                        <p className="font-medium">Secure Payment</p>
                                        <p className="text-sm text-gray-600">100% protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Tabs */}
                    <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden" data-aos="fade-up">
                        <div className="border-b">
                            <nav className="flex">
                                {['description', 'specifications', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`px-6 py-4 font-medium capitalize ${activeTab === tab
                                                ? 'border-b-2 border-primary-500 text-primary-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                    {product.features && (
                                        <ul className="mt-4 space-y-2">
                                            {product.features.map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-primary-500 mr-2">•</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-4">Product Details</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Material</span>
                                                <span className="font-medium">{product.material || 'Cotton'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Color</span>
                                                <span className="font-medium">{product.color || 'Various'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Size</span>
                                                <span className="font-medium">{product.size || 'One Size'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Weight</span>
                                                <span className="font-medium">{product.weight || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-4">Order Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Min Order</span>
                                                <span className="font-medium">{product.minOrderQuantity} units</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Lead Time</span>
                                                <span className="font-medium">7-14 days</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Payment Terms</span>
                                                <span className="font-medium">50% Advance</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Sample Available</span>
                                                <span className="font-medium text-green-600">Yes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                                        <Button className="mt-4">Write a Review</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12" data-aos="fade-up">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                                <a href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
                                    View All →
                                </a>
                            </div>
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={1}
                                breakpoints={{
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                }}
                                navigation
                                modules={[Navigation]}
                                className="pb-12"
                            >
                                {relatedProducts.map((relatedProduct) => (
                                    <SwiperSlide key={relatedProduct._id}>
                                        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={relatedProduct.images?.[0]}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-800 mb-2 truncate">
                                                    {relatedProduct.name}
                                                </h3>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-primary-600">
                                                        ${relatedProduct.price}
                                                    </span>
                                                    <Button size="sm" onClick={() => navigate(`/products/${relatedProduct._id}`)}>
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetailsPage;