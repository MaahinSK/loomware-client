import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Spinner = ({ size = 'md', className = '', fullScreen = false }) => {
    const sizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                <div className="text-center">
                    <FaSpinner className={`animate-spin ${sizes[size]} text-primary-500 mx-auto`} />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <FaSpinner className={`animate-spin ${sizes[size]} text-primary-500`} />
            {className.includes('text') || <span className="ml-2 text-gray-600">Loading...</span>}
        </div>
    );
};

export default Spinner;