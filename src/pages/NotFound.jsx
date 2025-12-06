import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>404 - Page Not Found | LoomWare</title>
            </Helmet>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center" data-aos="fade-up">
                    <div className="mb-8">
                        <div className="text-9xl font-bold text-primary-500">404</div>
                        <div className="text-4xl font-bold text-gray-800 mt-4">Page Not Found</div>
                        <p className="text-gray-600 mt-2 max-w-md mx-auto">
                            The page you are looking for might have been removed, had its name changed,
                            or is temporarily unavailable.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/">
                            <Button className="flex items-center">
                                <FaHome className="mr-2" /> Back to Home
                            </Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="secondary" className="flex items-center">
                                <FaSearch className="mr-2" /> Browse Products
                            </Button>
                        </Link>
                    </div>

                    {/* Decorative elements */}
                    <div className="mt-12 relative">
                        <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary-300 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
                        <div className="relative z-10">
                            <div className="inline-block p-8 bg-white rounded-2xl shadow-xl">
                                <svg
                                    className="w-32 h-32 text-primary-400 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;