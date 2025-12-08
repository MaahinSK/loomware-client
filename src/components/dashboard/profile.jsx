import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaEnvelope, FaShieldAlt, FaCalendar, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';

const schema = yup.object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    photoURL: yup.string().url('Invalid URL').optional(),
}).required();

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: user?.name || '',
            photoURL: user?.photoURL || '',
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

    const handleEditClick = () => {
        if (isEditing) {
            reset();
        }
        setIsEditing(!isEditing);
    };

    if (!user) {
        return <Spinner />;
    }

    return (
        <>
            <Helmet>
                <title>My Profile - LoomWare</title>
            </Helmet>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                        <p className="text-gray-600">Manage your account information</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleEditClick}
                        className="flex items-center"
                    >
                        <FaEdit className="mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture & Basic Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-primary rounded-xl p-8 text-center">
                            <div className="w-32 h-32 mx-auto rounded-full bg-white flex items-center justify-center mb-4 overflow-hidden">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-6xl text-primary-600" />
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{user.name}</h3>
                            <div className="inline-block px-4 py-1 bg-white bg-opacity-20 rounded-full text-white">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="mt-6 bg-gray-50 rounded-xl p-6">
                            <h4 className="font-bold text-gray-800 mb-4">Account Status</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Verification</span>
                                    <span className={`px-2 py-1 rounded text-xs ${user.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Member Since</span>
                                    <span className="text-gray-800">
                                        {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                        {isEditing ? (
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
                                            placeholder="Enter your name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            className="input-field bg-gray-50 cursor-not-allowed"
                                            disabled
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Profile Photo URL
                                        </label>
                                        <input
                                            type="url"
                                            {...register('photoURL')}
                                            className="input-field"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                        {errors.photoURL && (
                                            <p className="mt-1 text-sm text-red-600">{errors.photoURL.message}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Enter a valid image URL for your profile picture
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <Spinner size="sm" className="text-white" /> : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Read-only Info */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="font-bold text-gray-800 mb-4">Personal Information</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <FaUser className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-600">Full Name</p>
                                                <p className="font-medium text-gray-800">{user.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FaEnvelope className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email Address</p>
                                                <p className="font-medium text-gray-800">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FaShieldAlt className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-600">Account Role</p>
                                                <p className="font-medium text-gray-800 capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCalendar className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-600">Member Since</p>
                                                <p className="font-medium text-gray-800">
                                                    {user.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Suspension Info (if applicable) */}
                                {user.status === 'suspended' && user.suspendReason && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                        <h4 className="font-bold text-red-800 mb-2">Account Suspended</h4>
                                        <p className="text-red-700 mb-3">
                                            Your account has been suspended. Please contact support for more information.
                                        </p>
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="text-sm font-medium text-gray-800 mb-1">Suspension Reason:</p>
                                            <p className="text-gray-600">{user.suspendReason}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;