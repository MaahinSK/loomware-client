import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import ProductCard from '../components/products/ProductCard';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 9;

    useEffect(() => {
        fetchProducts();
    }, [currentPage, sortBy]);

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
        'all', 'Shirt', 'Pant', 'Jacket', 'Suits', 'Accessories', 'Dress', 'T-Shirt', 'Jeans'
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'name', label: 'Name A-Z' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handleCategoryChange = (category) => {
        setCategoryFilter(category);
        setCurrentPage(1);
        fetchProducts();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && currentPage === 1) {
        return <Spinner fullScreen />;
    }

    return (
        <>
            <Helmet>
                <title>All Products - LoomWare</title>
                <meta name="description" content="Browse our complete collection of garments and accessories" />
            </Helmet>

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="text-center mb-12" data-aos="fade-up">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our complete collection of premium garments and accessories
                        </p>
                    </div>

                    {/* Filters & Search */}
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
                                    <FaSearch className="absolute left-4 top-4 text-gray-400" />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            <div className="flex items-center space-x-4">
                                {/* Category Filter */}
                                <div className="relative">
                                    <select
                                        className="appearance-none pl-10 pr-8 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        value={categoryFilter}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat === 'all' ? 'All Categories' : cat}
                                            </option>
                                        ))}
                                    </select>
                                    <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
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
                                    <FaSort className="absolute left-3 top-3.5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Category Chips */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {categories.slice(1).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="mb-12">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center" data-aos="fade-up">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 border rounded-lg ${currentPage === page
                                            ? 'bg-primary-500 text-white border-primary-500'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllProductsPage;