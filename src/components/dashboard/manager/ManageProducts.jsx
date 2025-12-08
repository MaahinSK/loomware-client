import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
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
    FaPlus,
    FaBox,
} from 'react-icons/fa';
import { format } from 'date-fns';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const categories = ['all', 'Shirt', 'Pant', 'Jacket', 'Suits', 'Accessories', 'Dress', 'T-Shirt', 'Skirt'];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products/manager/my-products');
            setProducts(response.data.data.products);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        setFilteredProducts(filtered);
    };

    const deleteProduct = async () => {
        try {
            await api.delete(`/products/${selectedProduct._id}`);
            toast.success('Product deleted successfully');
            fetchProducts();
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const updateProduct = async (productData) => {
        try {
            await api.put(`/products/${selectedProduct._id}`, productData);
            toast.success('Product updated successfully');
            fetchProducts();
            setShowEditModal(false);
            setSelectedProduct(null);
        } catch (error) {
            toast.error('Failed to update product');
        }
    };

    if (loading) {
        return <Spinner />;
    }

    const inStockCount = products.filter(p => p.availableQuantity > 0).length;
    const outOfStockCount = products.filter(p => p.availableQuantity === 0).length;

    return (
        <>
            <Helmet>
                <title>Manage Products - Manager Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
                            <p className="text-gray-600">Manage your product inventory</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <Button
                                className="flex items-center"
                                onClick={() => window.location.href = '/dashboard/add-product'}
                            >
                                <FaPlus className="mr-2" /> Add Product
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-600">Total Products</p>
                            <p className="text-2xl font-bold">{products.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-600">In Stock</p>
                            <p className="text-2xl font-bold">{inStockCount}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm text-red-600">Out of Stock</p>
                            <p className="text-2xl font-bold">{outOfStockCount}</p>
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
                                            <div className={`text-sm font-medium ${product.availableQuantity === 0
                                                    ? 'text-red-600'
                                                    : product.availableQuantity <= 10
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                                }`}>
                                                {product.availableQuantity} units
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
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
                                {searchTerm || categoryFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Start by adding your first product'}
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
                                    id="edit-name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select className="input-field" defaultValue={selectedProduct.category} id="edit-category">
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
                                    id="edit-price"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Available Quantity
                                </label>
                                <input
                                    type="number"
                                    defaultValue={selectedProduct.availableQuantity}
                                    className="input-field"
                                    id="edit-quantity"
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
                                id="edit-description"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                const name = document.getElementById('edit-name').value;
                                const category = document.getElementById('edit-category').value;
                                const price = document.getElementById('edit-price').value;
                                const availableQuantity = document.getElementById('edit-quantity').value;
                                const description = document.getElementById('edit-description').value;
                                updateProduct({ name, category, price, availableQuantity, description });
                            }}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ManageProducts;