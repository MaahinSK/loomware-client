import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import Card from '../ui/Card';
import ProductCard from './ProductCard';
import {
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaList,
    FaThLarge,
    FaStar,
    FaFire,
    FaTag
} from 'react-icons/fa';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        fetchProducts();
    }, [currentPage, sortBy, categoryFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products', {
                params: {
                    page: currentPage,
                    limit: productsPerPage,
                    sort: sortBy,
                    category: categoryFilter !== 'all' ? categoryFilter : undefined,
                    search: searchTerm || undefined,
                    minPrice: priceRange.min,
                    maxPrice: priceRange.max,
                },
            });

            setProducts(response.data.data.products);
            setTotalPages(response.data.data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        'all', 'Shirt', 'Pant', 'Jacket', 'Suits', 'Accessories',
        'Dress', 'T-Shirt', 'Jeans', 'Sweater', 'Coat', 'Shorts'
    ];

    const sortOptions = [
        { value: 'featured', label: 'Featured', icon: <FaStar /> },
        { value: 'popular', label: 'Popular', icon: <FaFire /> },
        { value: 'newest', label: 'Newest', icon: <FaTag /> },
        { value: 'price_low', label: 'Price: Low to High', icon: <FaSortAmountDown /> },
        { value: 'price_high', label: 'Price: High to Low', icon: <FaSortAmountDown /> },
        { value: 'name', label: 'Name A-Z', icon: <FaSortAmountDown /> },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handleCategoryChange = (category) => {
        setCategoryFilter(category);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePriceRangeChange = () => {
        setCurrentPage(1);
        fetchProducts();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('all');
        setSortBy('featured');
        setPriceRange({ min: 0, max: 1000 });
        setCurrentPage(1);
        fetchProducts();
    };

    if (loading && currentPage === 1) {
        return <Spinner fullScreen />;
    }

    return (
        <>
            <Helmet>
                <title>All Products - LoomWare</title>
                <meta name="description" content="Browse our complete collection of premium garments and accessories" />
            </Helmet>

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="text-center mb-8" data-aos="fade-up">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover premium garments crafted with precision and care
                        </p>
                    </div>

                    {/* Filters & Controls */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8" data-aos="fade-up">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            <div className="flex items-center space-x-4">
                                {/* View Toggle */}
                                <div className="flex border rounded-lg">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
                                    >
                                        <FaThLarge />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
                                    >
                                        <FaList />
                                    </button>
                                </div>

                                {/* Sort Options */}
                                <div className="relative">
                                    <select
                                        className="appearance-none pl-10 pr-8 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FaSortAmountDown className="absolute left-3 top-3.5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="mt-6">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Min Price: ${priceRange.min}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                                    onMouseUp={handlePriceRangeChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Price: ${priceRange.max}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                                    onMouseUp={handlePriceRangeChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Products Count & Info */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Showing {products.length} of {products.length * totalPages} products
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaFilter />
                            <span>{categoryFilter !== 'all' && `Category: ${categoryFilter}`}</span>
                            {priceRange.min > 0 || priceRange.max < 1000 ? (
                                <span> | Price: ${priceRange.min} - ${priceRange.max}</span>
                            ) : null}
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    {products.length > 0 ? (
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-6'
                        }>
                            {products.map((product) => (
                                viewMode === 'grid' ? (
                                    <ProductCard key={product._id} product={product} />
                                ) : (
                                    <Card key={product._id} className="hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="md:w-1/4">
                                                <img
                                                    src={product.images?.[0]}
                                                    alt={product.name}
                                                    className="w-full h-48 md:h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="md:w-3/4 p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                                                        <p className="text-gray-600 mt-1">{product.category}</p>
                                                    </div>
                                                    <span className="text-2xl font-bold text-primary-600">
                                                        ${product.price}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                                                                }`}></div>
                                                            <span className="text-sm text-gray-600">
                                                                {product.availableQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            Min order: {product.minOrderQuantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Link to={`/products/${product._id}`}>
                                                            <Button variant="outline">View Details</Button>
                                                        </Link>
                                                        <Button disabled={product.quantity === 0}>
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaSearch className="mx-auto h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-6">
                                Try adjusting your search or filter criteria
                            </p>
                            <Button onClick={clearFilters}>Clear All Filters</Button>
                        </Card>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12" data-aos="fade-up">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1;
                                    } else if (currentPage <= 3) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i;
                                    } else {
                                        page = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 border rounded-lg min-w-[40px] ${currentPage === page
                                                ? 'bg-primary-500 text-white border-primary-500'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {totalPages > 5 && (
                                    <span className="px-2 text-gray-500">...</span>
                                )}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}

                    {/* Featured Products Banner */}
                    {currentPage === 1 && (
                        <div className="mt-12 bg-gradient-primary rounded-xl p-8 text-white" data-aos="fade-up">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0 md:mr-8">
                                    <h3 className="text-2xl font-bold mb-2">Premium Collection</h3>
                                    <p className="opacity-90">
                                        Discover our exclusive range of premium garments with special discounts
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                                        Shop Now
                                    </Button>
                                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                                        View Offers
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllProducts;