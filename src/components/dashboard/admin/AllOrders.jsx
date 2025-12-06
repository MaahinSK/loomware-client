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
    FaEye,
    FaCheck,
    FaTimes,
    FaPrint,
    FaDownload,
    FaCalendar,
    FaUser,
    FaBox
} from 'react-icons/fa';
import { format } from 'date-fns';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, statusFilter, dateRange]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders/admin');
            setOrders(response.data.data.orders);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Date range filter
        if (dateRange.start) {
            filtered = filtered.filter(order =>
                new Date(order.createdAt) >= new Date(dateRange.start)
            );
        }
        if (dateRange.end) {
            filtered = filtered.filter(order =>
                new Date(order.createdAt) <= new Date(dateRange.end)
            );
        }

        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status });
            toast.success(`Order ${status} successfully`);
            fetchOrders();
            setShowUpdateModal(false);
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentColor = (method) => {
        switch (method) {
            case 'stripe': return 'bg-blue-100 text-blue-800';
            case 'cash': return 'bg-green-100 text-green-800';
            case 'bank': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const exportOrders = () => {
        const csvData = filteredOrders.map(order => ({
            'Order ID': order.orderNumber,
            'Customer': order.customerName,
            'Email': order.customerEmail,
            'Product': order.product?.name,
            'Quantity': order.quantity,
            'Amount': order.totalAmount,
            'Status': order.status,
            'Payment': order.paymentMethod,
            'Date': format(new Date(order.createdAt), 'yyyy-MM-dd'),
        }));

        const csvHeaders = Object.keys(csvData[0]).join(',');
        const csvRows = csvData.map(row =>
            Object.values(row).map(value => `"${value}"`).join(',')
        );
        const csvContent = [csvHeaders, ...csvRows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <Helmet>
                <title>All Orders - Admin Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
                            <p className="text-gray-600">Manage and track all customer orders</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <Button
                                variant="outline"
                                className="flex items-center"
                                onClick={exportOrders}
                            >
                                <FaDownload className="mr-2" /> Export
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <FaFilter className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                placeholder="Start Date"
                            />
                            <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                placeholder="End Date"
                            />
                            <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-600">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-yellow-600">Pending</p>
                            <p className="text-2xl font-bold">
                                {orders.filter(o => o.status === 'pending').length}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-600">Completed</p>
                            <p className="text-2xl font-bold">
                                {orders.filter(o => ['delivered', 'shipped'].includes(o.status)).length}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-purple-600">Revenue</p>
                            <p className="text-2xl font-bold">
                                ${orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <FaUser className="text-primary-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.customerName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.customerEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                        src={order.product?.images?.[0] || 'https://via.placeholder.com/40'}
                                                        alt={order.product?.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {order.product?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Qty: {order.quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                ${order.totalAmount?.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentMethod)}`}>
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {format(new Date(order.createdAt), 'HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="text-primary-600 hover:text-primary-900"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>

                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowUpdateModal(true);
                                                            }}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Approve"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus(order._id, 'rejected')}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Reject"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    className="text-gray-600 hover:text-gray-900"
                                                    title="Print Invoice"
                                                >
                                                    <FaPrint />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaBox className="mx-auto h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end
                                    ? 'Try adjusting your filters'
                                    : 'No orders have been placed yet.'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredOrders.length > 0 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
                                <span className="font-medium">{orders.length}</span> orders
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="px-3 py-1 border rounded-lg bg-primary-500 text-white">
                                    1
                                </button>
                                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Order Details"
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Order ID:</span> #{selectedOrder.orderNumber}</p>
                                    <p><span className="text-gray-600">Date:</span> {format(new Date(selectedOrder.createdAt), 'PPpp')}</p>
                                    <p><span className="text-gray-600">Status:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                                <div className="space-y-2">
                                    <p>{selectedOrder.customerName}</p>
                                    <p>{selectedOrder.customerEmail}</p>
                                    <p>{selectedOrder.customerPhone}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                            <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Product Details</h4>
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center">
                                    <img
                                        src={selectedOrder.product?.images?.[0]}
                                        alt={selectedOrder.product?.name}
                                        className="w-16 h-16 rounded-lg object-cover mr-4"
                                    />
                                    <div className="flex-1">
                                        <h5 className="font-medium">{selectedOrder.product?.name}</h5>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-gray-600">Quantity: {selectedOrder.quantity}</span>
                                            <span className="font-bold">${selectedOrder.totalAmount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Update Status Modal */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Update Order Status"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <p className="text-gray-600">
                            Update status for order #{selectedOrder.orderNumber}
                        </p>

                        <div className="space-y-3">
                            {['pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => updateOrderStatus(selectedOrder._id, status)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border ${selectedOrder.status === status
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="capitalize">{status}</span>
                                        {selectedOrder.status === status && (
                                            <FaCheck className="text-green-500" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AllOrders;