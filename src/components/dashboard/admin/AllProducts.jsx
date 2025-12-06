import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import Modal from '../../ui/Modal';
import {
    FaSearch,
    FaFilter,
    FaEdit,
    FaTrash,
    FaEye,
    FaToggleOn,
    FaToggleOff,
    FaBox,
    FaChartLine,
    FaSortAmountDown
} from 'react-icons/fa';
import { format } from 'date-fns';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter, statusFilter, sortBy]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products/admin');
            setProducts(response.data.data.products);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'in_stock') {
                filtered = filtered.filter(product => product.quantity > 0);
            } else if (statusFilter === 'out_of_stock') {
                filtered = filtered.filter(product => product.quantity === 0);
            } else if (statusFilter === 'featured') {
                filtered = filtered.filter(product => product.featured);
            }
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price_low':
                    return a.price - b.price;
                case 'price_high':
                    return b.price - a.price;
                case 'quantity':
                    return b.quantity - a.quantity;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    };

    const deleteProduct = async () => {
        try {
            await axios.delete(`/api/products/${selectedProduct._id}`);
            toast.success('Product deleted successfully');
            fetchProducts();
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const toggleFeatured = async (productId, featured) => {
        try {
            await axios.put(`/api/products/${productId}/feature`, { featured: !featured });
            toast.success(featured ? 'Product unfeatured' : 'Product featured');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to update product');
        }
    };

    const toggleShowOnHome = async (productId, showOnHome) => {
        try {
            await axios.put(`/api/products/${productId}/visibility`, { showOnHome: !showOnHome });
            toast.success(showOnHome ? 'Removed from homepage' : 'Added to homepage');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to update product visibility');
        }
    };

    const updateProduct = async (productData) => {
        try {
            await axios.put(`/api/products/${selectedProduct._id}`, productData);
            toast.success('Product updated successfully');
            fetchProducts();
            setShowEditModal(false);
            setSelectedProduct(null);
        } catch (error) {
            toast.error('Failed to update product');
        }
    };

    const categories = ['all', 'Shirt', 'Pant', 'Jacket', 'Suits', 'Accessories', 'Dress', 'T-Shirt', 'Jeans'];

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <Helmet>
                <title>All Products - Admin Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
                            <p className="text-gray-600">Manage all products in the system</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <Button className="flex items-center">
                                <FaBox className="mr-2" /> Add Product
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>
                            <FaFilter className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="featured">Featured</option>
                            </select>
                            <FaFilter className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">Name A-Z</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="quantity">Quantity</option>
                            </select>
                            <FaSortAmountDown className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-600">Total Products</p>
                            <p className="text-2xl font-bold">{products.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-600">In Stock</p>
                            <p className="text-2xl font-bold">
                                {products.filter(p => p.quantity > 0).length}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-purple-600">Featured</p>
                            <p className="text-2xl font-bold">
                                {products.filter(p => p.featured).length}
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-yellow-600">Low Stock</p>
                            <p className="text-2xl font-bold">
                                {products.filter(p => p.quantity > 0 && p.quantity <= 10).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Homepage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                        src={product.images?.[0] || 'https://via.placeholder.com/40'}
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        By: {product.createdBy?.name || 'System'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                ${product.price}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${product.quantity === 0
                                                    ? 'text-red-600'
                                                    : product.quantity <= 10
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                                }`}>
                                                {product.quantity} units
                                            </div>
                                            {product.quantity <= 10 && product.quantity > 0 && (
                                                <div className="text-xs text-yellow-600">Low stock</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleFeatured(product._id, product.featured)}
                                                className={`p-2 rounded-full ${product.featured
                                                        ? 'text-green-600 bg-green-50'
                                                        : 'text-gray-400 bg-gray-50'
                                                    }`}
                                            >
                                                {product.featured ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleShowOnHome(product._id, product.showOnHome)}
                                                className={`p-2 rounded-full ${product.showOnHome
                                                        ? 'text-blue-600 bg-blue-50'
                                                        : 'text-gray-400 bg-gray-50'
                                                    }`}
                                            >
                                                {product.showOnHome ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => window.open(`/products/${product._id}`, '_blank')}
                                                    className="text-primary-600 hover:text-primary-900"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaBox className="mx-auto h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500">
                                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'No products available.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Product"
                danger
            >
                {selectedProduct && (
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Are you sure you want to delete <strong>{selectedProduct.name}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={deleteProduct}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Product"
                size="lg"
            >
                {selectedProduct && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={selectedProduct.name}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select className="input-field" defaultValue={selectedProduct.category}>
                                    {categories.slice(1).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    defaultValue={selectedProduct.price}
                                    className="input-field"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    defaultValue={selectedProduct.quantity}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                defaultValue={selectedProduct.description}
                                rows="4"
                                className="input-field"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => updateProduct({})}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AllProducts;