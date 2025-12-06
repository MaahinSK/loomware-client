import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Helmet } from 'react-helmet-async';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import Card from '../../ui/Card';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaEdit,
    FaSave,
    FaTimes,
    FaKey,
    FaBell,
    FaCreditCard
} from 'react-icons/fa';
import { format } from 'date-fns';

const schema = yup.object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    phone: yup.string().optional(),
    address: yup.string().optional(),
    notifications: yup.boolean().default(true),
    newsletter: yup.boolean().default(false),
}).required();

const BuyerProfile = () => {
    const { user, updateProfile, loading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
            notifications: true,
            newsletter: false,
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        const result = await updateProfile(data);
        setLoading(false);

        if (result.success) {
            setIsEditing(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            reset();
        }
        setIsEditing(!isEditing);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUser /> },
        { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
        { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
        { id: 'billing', label: 'Billing', icon: <FaCreditCard /> },
    ];

    if (authLoading) {
        return <Spinner />;
    }

    return (
        <>
            <Helmet>
                <title>My Profile - Buyer Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                            <p className="text-gray-600">Manage your account settings</p>
                        </div>
                        <Button
                            variant={isEditing ? "danger" : "outline"}
                            onClick={handleEditToggle}
                            className="flex items-center"
                        >
                            {isEditing ? (
                                <>
                                    <FaTimes className="mr-2" /> Cancel
                                </>
                            ) : (
                                <>
                                    <FaEdit className="mr-2" /> Edit Profile
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b mb-6">
                        <nav className="flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`flex items-center py-3 px-1 border-b-2 font-medium ${activeTab === tab.id
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2">
                        <Card>
                            <Card.Header>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {activeTab === 'profile' && 'Personal Information'}
                                    {activeTab === 'security' && 'Security Settings'}
                                    {activeTab === 'notifications' && 'Notification Preferences'}
                                    {activeTab === 'billing' && 'Billing Information'}
                                </h3>
                            </Card.Header>
                            <Card.Body>
                                {activeTab === 'profile' ? (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('name')}
                                                    className="input-field"
                                                    disabled={!isEditing}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <div className="flex items-center input-field bg-gray-50">
                                                    <FaEnvelope className="text-gray-400 mr-3" />
                                                    <span className="text-gray-800">{user?.email}</span>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        {...register('phone')}
                                                        className="input-field pl-10"
                                                        disabled={!isEditing}
                                                        placeholder="+1 (555) 123-4567"
                                                    />
                                                    <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Account Status
                                                </label>
                                                <div className={`px-3 py-2 rounded-lg inline-flex items-center ${user?.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : user?.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    <FaShieldAlt className="mr-2" />
                                                    <span className="capitalize">{user?.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    {...register('address')}
                                                    rows="3"
                                                    className="input-field pl-10"
                                                    disabled={!isEditing}
                                                    placeholder="Enter your complete address"
                                                />
                                                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end pt-4">
                                                <Button type="submit" disabled={loading} className="flex items-center">
                                                    {loading ? (
                                                        <Spinner size="sm" className="text-white" />
                                                    ) : (
                                                        <>
                                                            <FaSave className="mr-2" /> Save Changes
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                ) : activeTab === 'security' ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-4">Change Password</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Current Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="input-field"
                                                        placeholder="Enter current password"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="input-field"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="input-field"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                                <Button className="flex items-center">
                                                    <FaKey className="mr-2" /> Update Password
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="border-t pt-6">
                                            <h4 className="font-bold text-gray-800 mb-4">Two-Factor Authentication</h4>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Two-factor authentication</p>
                                                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                                                </div>
                                                <Button variant="outline">Enable 2FA</Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeTab === 'notifications' ? (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Email Notifications</p>
                                                    <p className="text-sm text-gray-600">Receive email updates about your orders</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">SMS Notifications</p>
                                                    <p className="text-sm text-gray-600">Receive SMS updates about order status</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Marketing Emails</p>
                                                    <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-4">Payment Methods</h4>
                                            <div className="space-y-4">
                                                <div className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-6 bg-blue-500 rounded mr-3"></div>
                                                            <div>
                                                                <p className="font-medium">Visa ending in 4242</p>
                                                                <p className="text-sm text-gray-600">Expires 12/2025</p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="outline">Default</Button>
                                                    </div>
                                                </div>
                                                <Button className="w-full">Add Payment Method</Button>
                                            </div>
                                        </div>

                                        <div className="border-t pt-6">
                                            <h4 className="font-bold text-gray-800 mb-4">Billing History</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between py-3 border-b">
                                                    <div>
                                                        <p className="font-medium">Order #LW-12345</p>
                                                        <p className="text-sm text-gray-600">December 15, 2023</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">$249.99</p>
                                                        <Button size="sm" variant="outline">Download</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Right Column - Stats & Info */}
                    <div className="space-y-6">
                        {/* Profile Summary */}
                        <Card>
                            <Card.Body className="text-center">
                                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 overflow-hidden">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="text-4xl text-white" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{user?.name}</h3>
                                <p className="text-gray-600 mb-4">{user?.email}</p>
                                <div className="inline-block px-4 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                </div>

                                <div className="space-y-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Member Since</span>
                                        <span className="font-medium">
                                            {format(new Date(user?.createdAt), 'MMM yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Orders</span>
                                        <span className="font-medium">12</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Spent</span>
                                        <span className="font-medium">$1,249.99</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Account Status */}
                        {user?.status !== 'approved' && (
                            <Card variant="warning">
                                <Card.Body>
                                    <h4 className="font-bold text-yellow-800 mb-2">Account Pending Approval</h4>
                                    <p className="text-yellow-700 text-sm">
                                        Your account is currently under review. You can browse products but cannot place orders until approved.
                                    </p>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <Card.Header>
                                <h4 className="font-bold text-gray-800">Quick Actions</h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <FaUser className="mr-3" /> View Order History
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FaKey className="mr-3" /> Change Password
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FaBell className="mr-3" /> Notification Settings
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyerProfile;