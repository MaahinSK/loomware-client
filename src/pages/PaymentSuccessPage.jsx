import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            toast.error('Invalid payment session');
            navigate('/');
            return;
        }

        verifyPaymentAndCreateOrder(sessionId);
    }, [searchParams]);

    const verifyPaymentAndCreateOrder = async (sessionId) => {
        try {
            // In a production app, you would verify the session with Stripe
            // and create the order on the backend via a webhook
            // For now, we'll show a success message

            setSuccess(true);
            toast.success('Payment successful! Your order has been placed.');
        } catch (error) {
            console.error('Payment verification error:', error);
            setSuccess(false);
            toast.error('Payment verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner fullScreen />;
    }

    return (
        <>
            <Helmet>
                <title>{success ? 'Payment Successful' : 'Payment Failed'} - LoomWare</title>
            </Helmet>

            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        {success ? (
                            <>
                                <div className="mb-6">
                                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <FaCheckCircle className="text-green-600 text-5xl" />
                                    </div>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    Payment Successful!
                                </h1>

                                <p className="text-gray-600 mb-8">
                                    Thank you for your payment. Your order has been received and is being processed.
                                </p>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-gray-600 mb-2">
                                        You will receive an email confirmation shortly with your order details.
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        You can track your order status in your dashboard.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => navigate('/dashboard/my-orders')}
                                        className="w-full"
                                    >
                                        View My Orders
                                    </Button>

                                    <Button
                                        onClick={() => navigate('/products')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                        <FaTimesCircle className="text-red-600 text-5xl" />
                                    </div>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    Payment Failed
                                </h1>

                                <p className="text-gray-600 mb-8">
                                    We couldn't process your payment. Please try again or contact support if the problem persists.
                                </p>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full"
                                    >
                                        Try Again
                                    </Button>

                                    <Button
                                        onClick={() => navigate('/products')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Back to Products
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccessPage;
