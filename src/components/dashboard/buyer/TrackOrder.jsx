import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    const [tracking, setTracking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const [orderRes, trackingRes] = await Promise.all([
                axios.get(`/orders/${orderId}`),
                axios.get(`/tracking/order/${orderId}`)
            ]);

            setOrder(orderRes.data.data.order);
            setTracking(trackingRes.data.data.tracking);
        } catch (error) {
            toast.error('Failed to fetch order details');
            navigate('/dashboard/my-orders');
        } finally {
            setLoading(false);
        }
    };

    const timelineSteps = [
        { status: 'order_placed', label: 'Order Placed', icon: <FaCheckCircle /> },
        { status: 'processing', label: 'Processing', icon: <FaClock /> },
        { status: 'cutting', label: 'Cutting', icon: <FaBoxOpen /> },
        { status: 'sewing', label: 'Sewing', icon: <FaBoxOpen /> },
        { status: 'finishing', label: 'Finishing', icon: <FaBoxOpen /> },
        { status: 'quality_check', label: 'Quality Check', icon: <FaCheckCircle /> },
        { status: 'packed', label: 'Packed', icon: <FaBoxOpen /> },
        { status: 'shipped', label: 'Shipped', icon: <FaShippingFast /> },
        { status: 'out_for_delivery', label: 'Out for Delivery', icon: <FaTruck /> },
        { status: 'delivered', label: 'Delivered', icon: <FaCheckCircle /> },
    ];

    const getStepIndex = (status) => {
        return timelineSteps.findIndex(step => step.status === status);
    };

    if (loading) {
        return <Spinner />;
    }

    if (!order) {
        return null;
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
                                Estimated Delivery: {format(new Date(order.estimatedDelivery), 'MMMM dd, yyyy')}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'shipped'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                                    <p className="text-sm text-gray-600">Price: ${order.totalAmount?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Delivery Address</h3>
                            <p className="text-gray-800">{order.shippingAddress?.street}</p>
                            <p className="text-gray-600">
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                            </p>
                            <p className="text-gray-600">{order.shippingAddress?.country}</p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                            <p className="text-gray-800">{order.customerName}</p>
                            <p className="text-gray-600">{order.customerEmail}</p>
                            <p className="text-gray-600">{order.customerPhone}</p>
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
                                const isCompleted = getStepIndex(order.status) >= index;
                                const isCurrent = order.status === step.status;

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