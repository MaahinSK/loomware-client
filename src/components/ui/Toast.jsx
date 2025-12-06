import React, { useState, useEffect } from 'react';
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimes
} from 'react-icons/fa';

const Toast = ({
    message,
    type = 'info',
    duration = 5000,
    onClose,
    position = 'top-right',
    showIcon = true,
    showClose = true,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const positions = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    const types = {
        success: {
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-800',
            icon: <FaCheckCircle className="text-green-500" />,
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-800',
            icon: <FaExclamationCircle className="text-red-500" />,
        },
        warning: {
            bg: 'bg-yellow-50 border-yellow-200',
            text: 'text-yellow-800',
            icon: <FaExclamationTriangle className="text-yellow-500" />,
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            text: 'text-blue-800',
            icon: <FaInfoCircle className="text-blue-500" />,
        },
    };

    const currentType = types[type] || types.info;

    if (!isVisible) return null;

    return (
        <div
            className={`fixed ${positions[position]} z-50 animate-slide-in ${className}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div
                className={`flex items-center p-4 rounded-lg shadow-lg border ${currentType.bg} min-w-[300px] max-w-md transition-all duration-300`}
            >
                {showIcon && <div className="mr-3 text-xl">{currentType.icon}</div>}

                <div className="flex-1">
                    <p className={`font-medium ${currentType.text}`}>{message}</p>
                </div>

                {showClose && (
                    <button
                        onClick={handleClose}
                        className={`ml-4 ${currentType.text} hover:opacity-70 transition-opacity`}
                        aria-label="Close notification"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
        </div>
    );
};

// Toast Container
const ToastContainer = ({
    toasts = [],
    position = 'top-right',
    maxToasts = 3,
    className = ''
}) => {
    const positions = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    const displayedToasts = toasts.slice(0, maxToasts);

    return (
        <div className={`fixed ${positions[position]} z-50 space-y-3 ${className}`}>
            {displayedToasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    position={position}
                />
            ))}
        </div>
    );
};

// Toast Hook
const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, options = {}) => {
        const id = Date.now().toString();
        const newToast = { id, message, ...options };

        setToasts(prev => [...prev, newToast]);

        if (options.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, options.duration || 5000);
        }

        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (message, options = {}) => {
        return showToast(message, { ...options, type: 'success' });
    };

    const error = (message, options = {}) => {
        return showToast(message, { ...options, type: 'error' });
    };

    const warning = (message, options = {}) => {
        return showToast(message, { ...options, type: 'warning' });
    };

    const info = (message, options = {}) => {
        return showToast(message, { ...options, type: 'info' });
    };

    const clearAll = () => {
        setToasts([]);
    };

    return {
        toasts,
        success,
        error,
        warning,
        info,
        removeToast,
        clearAll,
        ToastContainer,
    };
};

// Inline Toast Component
const InlineToast = ({ message, type = 'info', onClose, className = '' }) => {
    const types = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const icons = {
        success: <FaCheckCircle className="text-green-500" />,
        error: <FaExclamationCircle className="text-red-500" />,
        warning: <FaExclamationTriangle className="text-yellow-500" />,
        info: <FaInfoCircle className="text-blue-500" />,
    };

    return (
        <div
            className={`flex items-center p-4 rounded-lg border ${types[type]} ${className}`}
            role="alert"
        >
            <div className="mr-3 text-xl">{icons[type]}</div>
            <div className="flex-1">
                <p className="font-medium">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
            )}
        </div>
    );
};

export { Toast, ToastContainer, useToast, InlineToast };
export default Toast;