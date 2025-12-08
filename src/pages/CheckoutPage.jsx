import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { FaShoppingCart, FaTruck, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isApproved } = useAuth();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        customerName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        contactNumber: '',
        paymentMethod: 'Cash on Delivery',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!user) {
            toast.info('Please login to checkout');
            navigate('/login');
            return;
        }

        if (!isApproved()) {
            toast.error('Your account is pending approval');
            navigate('/');
            return;
        }

        // Get products from location state
        const stateProducts = location.state?.products || [];
        if (stateProducts.length === 0) {
            toast.error('No products in checkout');
            navigate('/products');
            return;
        }

        setProducts(stateProducts);

        // Set default customer name from user profile
        if (user?.displayName) {
            setFormData(prev => ({
                ...prev,
                customerName: user.displayName
            }));
        }
    }, [user, navigate, location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
        if (!formData.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotal = () => {
        return products.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            // Note: Backend currently only supports single product orders
            const product = products[0];

            // Split customer name into first and last name
            const nameParts = formData.customerName.trim().split(' ');
            const firstName = nameParts[0] || 'Customer';
            const lastName = nameParts.slice(1).join(' ') || 'User';

            const orderData = {
                productId: product.productId,
                quantity: product.quantity,
                firstName,
                lastName,
                contactNumber: formData.contactNumber,
                deliveryAddress: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
                additionalNotes: formData.notes,
                paymentMethod: formData.paymentMethod
            };

            // If Stripe payment, redirect to Stripe Checkout
            if (formData.paymentMethod === 'Stripe') {
                console.log('Creating Stripe checkout session...');
                const response = await api.post('/payments/create-checkout-session', { orderData });

                if (response.data.data.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = response.data.data.url;
                } else {
                    toast.error('Failed to create payment session');
                    setLoading(false);
                }
            } else {
                // Cash on Delivery - create order directly
                console.log('Sending order data:', orderData);
                await api.post('/orders', orderData);
                toast.success('Order placed successfully!');
                navigate('/dashboard/my-orders');
                setLoading(false);
            }
        } catch (error) {
            console.error('Order error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    if (products.length === 0) {
        return <Spinner fullScreen />;
    }

    return (
        <>
            <Helmet>
                <title>Checkout - LoomWare</title>
            </Helmet>

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery Address */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <FaTruck className="text-primary-600 mr-2" />
                                    <h2 className="text-xl font-bold">Shipping Info</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Customer Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.customerName ? 'border-red-500' : ''}`}
                                            placeholder="John Doe"
                                        />
                                        {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.contactNumber ? 'border-red-500' : ''}`}
                                            placeholder="+1 234 567 8900"
                                        />
                                        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.street ? 'border-red-500' : ''}`}
                                            placeholder="123 Main Street"
                                        />
                                        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                                            placeholder="New York"
                                        />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                                            placeholder="NY"
                                        />
                                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.zipCode ? 'border-red-500' : ''}`}
                                            placeholder="10001"
                                        />
                                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.country ? 'border-red-500' : ''}`}
                                            placeholder="United States"
                                        />
                                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <FaMoneyBillWave className="text-primary-600 mr-2" />
                                    <h2 className="text-xl font-bold">Payment Method</h2>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Cash on Delivery"
                                            checked={formData.paymentMethod === 'Cash on Delivery'}
                                            onChange={handleInputChange}
                                            className="mr-3"
                                        />
                                        <FaMoneyBillWave className="text-green-600 mr-2" />
                                        <span className="font-medium">Cash on Delivery</span>
                                    </label>

                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Stripe"
                                            checked={formData.paymentMethod === 'Stripe'}
                                            onChange={handleInputChange}
                                            className="mr-3"
                                        />
                                        <FaCreditCard className="text-blue-600 mr-2" />
                                        <span className="font-medium">Stripe (Online Payment)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    rows="3"
                                    placeholder="Any special instructions for your order..."
                                />
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                                <div className="flex items-center mb-4">
                                    <FaShoppingCart className="text-primary-600 mr-2" />
                                    <h2 className="text-xl font-bold">Order Summary</h2>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {products.map((item, index) => (
                                        <div key={index} className="flex items-start space-x-3 pb-4 border-b">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/80'}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm">{item.name}</h3>
                                                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                                <p className="text-primary-600 font-bold text-sm">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full mt-6"
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </Button>

                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full mt-3 text-gray-600 hover:text-gray-800"
                                >
                                    ← Back to Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
