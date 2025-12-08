import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import Modal from '../../ui/Modal';
import { FaSearch, FaCheck, FaTimes, FaEye, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/pending');
            setOrders(response.data.data.orders);
        } catch (error) {
            toast.error('Failed to fetch pending orders');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order._id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    };

    const approveOrder = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/approve`);
            toast.success('Order approved successfully');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to approve order');
        }
    };

    const rejectOrder = async () => {
        try {
            await api.put(`/orders/${selectedOrder._id}/reject`);
            toast.success('Order rejected successfully');
            fetchOrders();
            setShowRejectModal(false);
            setSelectedOrder(null);
        } catch (error) {
            toast.error('Failed to reject order');
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <Helmet>
                <title>Pending Orders - Manager Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Pending Orders</h2>
                            <p className="text-gray-600">Review and approve customer orders</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                                <p className="text-sm text-yellow-600">Pending Orders</p>
                                <p className="text-2xl font-bold text-yellow-700">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by customer name, email, or order ID..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
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
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
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
                                                #{order._id.slice(-8).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.firstName} {order.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.email}
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
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{order.quantity}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                ${(order.unitPrice * order.quantity).toFixed(2)}
                                            </div>
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
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => approveOrder(order._id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Approve"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowRejectModal(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Reject"
                                                >
                                                    <FaTimes />
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
                                <FaClock className="mx-auto h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending orders</h3>
                            <p className="text-gray-500">
                                {searchTerm
                                    ? 'Try adjusting your search'
                                    : 'All orders have been processed'}
                            </p>
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
                                <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Name:</span> {selectedOrder.firstName} {selectedOrder.lastName}</p>
                                    <p><span className="text-gray-600">Email:</span> {selectedOrder.email}</p>
                                    <p><span className="text-gray-600">Contact:</span> {selectedOrder.contactNumber}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Order ID:</span> #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                                    <p><span className="text-gray-600">Date:</span> {format(new Date(selectedOrder.createdAt), 'PPpp')}</p>
                                    <p><span className="text-gray-600">Payment:</span> {selectedOrder.paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Delivery Address</h4>
                            <p className="text-gray-600">{selectedOrder.deliveryAddress}</p>
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
                                            <span className="font-bold">${(selectedOrder.unitPrice * selectedOrder.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedOrder.additionalNotes && (
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Additional Notes</h4>
                                <p className="text-gray-600">{selectedOrder.additionalNotes}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setShowRejectModal(true);
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => {
                                    approveOrder(selectedOrder._id);
                                    setShowDetailsModal(false);
                                }}
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reject Confirmation Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Reject Order"
                danger
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Are you sure you want to reject order <strong>#{selectedOrder._id.slice(-8).toUpperCase()}</strong>?
                            The product quantity will be restored.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={rejectOrder}
                            >
                                Reject Order
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default PendingOrders;