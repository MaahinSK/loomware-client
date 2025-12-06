import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { Helmet } from 'react-helmet-async';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = yup.object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Must contain at least one lowercase letter'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    role: yup.string().oneOf(['buyer', 'manager'], 'Invalid role').required('Role is required'),
    photoURL: yup.string().url('Invalid URL').optional(),
}).required();

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'buyer',
        },
    });

    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);
        const result = await registerUser(data);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <>
            <Helmet>
                <title>Register - LoomWare</title>
            </Helmet>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8" data-aos="fade-up">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">LW</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-600">Join LoomWare today</p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name')}
                                    className="input-field mt-1"
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="input-field mt-1"
                                    placeholder="you@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700">
                                    Profile Photo URL (Optional)
                                </label>
                                <input
                                    id="photoURL"
                                    type="url"
                                    {...register('photoURL')}
                                    className="input-field mt-1"
                                    placeholder="https://example.com/photo.jpg"
                                />
                                {errors.photoURL && (
                                    <p className="mt-1 text-sm text-red-600">{errors.photoURL.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    {...register('role')}
                                    className="input-field mt-1"
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="manager">Manager</option>
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className="input-field pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                                {password && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        <p>Password must contain:</p>
                                        <ul className="list-disc pl-5">
                                            <li className={password.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                                                At least 6 characters
                                            </li>
                                            <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                                                One uppercase letter
                                            </li>
                                            <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                                                One lowercase letter
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        className="input-field pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner size="sm" className="text-white" /> : 'Create Account'}
                                </Button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-primary-600 hover:text-primary-500"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;