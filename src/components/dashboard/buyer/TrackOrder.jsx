import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Spinner from '../../common/Spinner';
import { Helmet } from 'react-helmet-async';
import { FaTruck, FaCheckCircle, FaClock, FaBoxOpen, FaShippingFast, FaMapMarkerAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [myOrders, setMyOrders] = useState([]);
    const [tracking, setTracking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            fetchMyOrders();
        }
    }, [orderId]);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/my-orders');
            setMyOrders(response.data.data.orders);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async () => {
        try {
            const orderRes = await api.get(`/orders/${orderId}`);
            setOrder(orderRes.data.data.order);

            // Try to fetch tracking, but don't fail if it's not available
            try {
                const trackingRes = await api.get(`/tracking/order/${orderId}`);
                setTracking(trackingRes.data.data.tracking || []);
            } catch (trackingError) {
                console.log('No tracking data available yet');
                setTracking([]);
            }
        } catch (error) {
            toast.error('Failed to fetch order details');
            navigate('/dashboard/my-orders');
        } finally {
            setLoading(false);
        }
    };

    const timelineSteps = [
        { status: 'pending', label: 'Order Placed', icon: <FaCheckCircle /> },
        { status: 'approved', label: 'Approved', icon: <FaCheckCircle /> },
        { status: 'processing', label: 'Processing', icon: <FaClock /> },
        { status: 'in_production', label: 'In Production', icon: <FaBoxOpen /> },
        { status: 'shipped', label: 'Shipped', icon: <FaShippingFast /> },
        { status: 'completed', label: 'Delivered', icon: <FaCheckCircle /> },
    ];

    const getStepIndex = (status) => {
        // Map cancelled or rejected to 0 or hidden
        if (status === 'cancelled' || status === 'rejected') return -1;
        return timelineSteps.findIndex(step => step.status === status);
    };

    if (loading) {
        return <Spinner />;
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <Helmet>
                    <title>Track Order - LoomWare</title>
                </Helmet>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Select an Order to Track</h2>
                    <p className="text-gray-600 mb-6">Choose an order from the list below to view its tracking details.</p>

                    {myOrders.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                            <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <button
                                onClick={() => navigate('/products')}
                                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myOrders.map((myOrder) => (
                                <div
                                    key={myOrder._id}
                                    onClick={() => navigate(`/dashboard/track-order/${myOrder._id}`)}
                                    className="border rounded-xl p-4 cursor-pointer hover:border-primary-500 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                                <img
                                                    src={myOrder.product?.images?.[0] || 'https://via.placeholder.com/48'}
                                                    alt={myOrder.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 line-clamp-1">{myOrder.product?.name}</h4>
                                                <p className="text-xs text-gray-500">#{myOrder._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${myOrder.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                myOrder.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {myOrder.orderStatus.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            {format(new Date(myOrder.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                        <span className="text-primary-600 font-medium group-hover:underline">
                                            Track Order →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Track Order #{order._id.slice(-8)} - LoomWare</title>
            </Helmet>

            <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Tracking Order #{order._id.slice(-8).toUpperCase()}
                            </h2>
                            <p className="text-gray-600">
                                Estimated Delivery: {order.estimatedDelivery ? format(new Date(order.estimatedDelivery), 'MMMM dd, yyyy') : 'Calculating...'}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${order.orderStatus === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.orderStatus === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1).replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Product Details</h3>
                            <div className="flex items-center">
                                <img
                                    src={order.product?.images?.[0] || 'https://via.placeholder.com/60'}
                                    alt={order.product?.name}
                                    className="w-16 h-16 rounded-lg object-cover mr-4"
                                />
                                <div>
                                    <p className="font-medium">{order.product?.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                                    <p className="text-sm text-gray-600">Price: ${order.totalPrice?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Delivery Address</h3>
                            <p className="text-gray-800">{order.deliveryAddress}</p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                            <p className="text-gray-800">{order.firstName} {order.lastName}</p>
                            <p className="text-gray-600">{order.email}</p>
                            <p className="text-gray-600">{order.contactNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Order Progress</h3>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gray-200"></div>

                        <div className="space-y-8">
                            {timelineSteps.map((step, index) => {
                                const trackingUpdate = tracking.find(t => t.status === step.status);
                                const isCompleted = getStepIndex(order.orderStatus) >= index;
                                const isCurrent = order.orderStatus === step.status;

                                return (
                                    <div
                                        key={step.status}
                                        className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                            }`}
                                    >
                                        {/* Timeline node */}
                                        <div className={`absolute left-0 md:left-1/2 transform -translate-x-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full z-10 flex items-center justify-center ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isCurrent
                                                ? 'bg-blue-500 text-white animate-pulse'
                                                : 'bg-gray-300 text-gray-600'
                                            }`}>
                                            {isCompleted ? <FaCheckCircle /> : step.icon}
                                        </div>

                                        {/* Content */}
                                        <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                                            }`}>
                                            <div className={`p-4 rounded-lg border ${isCurrent ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                                                }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className={`font-medium ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'
                                                        }`}>
                                                        {step.label}
                                                    </h4>
                                                    {trackingUpdate && (
                                                        <span className="text-sm text-gray-500">
                                                            {format(new Date(trackingUpdate.timestamp), 'MMM dd, HH:mm')}
                                                        </span>
                                                    )}
                                                </div>

                                                {trackingUpdate?.notes && (
                                                    <p className="text-gray-600 text-sm">{trackingUpdate.notes}</p>
                                                )}

                                                {trackingUpdate?.location && (
                                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                                        <FaMapMarkerAlt className="mr-1" />
                                                        {trackingUpdate.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Map View */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Location</h3>
                    <div className="h-96 rounded-lg overflow-hidden">
                        <MapContainer
                            center={[23.8103, 90.4125]} // Dhaka coordinates
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[23.8103, 90.4125]}>
                                <Popup>
                                    Delivery Location <br /> Dhaka, Bangladesh
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrackOrder;