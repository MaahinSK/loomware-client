import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import Button from '../common/Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    showCloseButton = true,
    danger = false,
    className = '',
}) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (closeOnEsc && event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEsc, onClose]);

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleOverlayClick}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} ${className}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between p-6 border-b ${danger ? 'border-red-200' : 'border-gray-200'
                        }`}>
                        <div>
                            <h3
                                id="modal-title"
                                className={`text-xl font-bold ${danger ? 'text-red-600' : 'text-gray-800'
                                    }`}
                            >
                                {title}
                            </h3>
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className={`text-gray-400 hover:text-gray-600 transition-colors ${danger ? 'hover:text-red-600' : ''
                                    }`}
                                aria-label="Close modal"
                            >
                                <FaTimes size={20} />
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className={`p-6 border-t ${danger ? 'border-red-200' : 'border-gray-200'
                            }`}>
                            {footer}
                        </div>
                    )}

                    {/* Default Footer */}
                    {!footer && (
                        <div className={`p-6 border-t ${danger ? 'border-red-200' : 'border-gray-200'
                            } flex justify-end space-x-3`}>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            {danger && (
                                <Button variant="danger" onClick={onClose}>
                                    Confirm
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

// Modal Components
const ModalHeader = ({ children, className = '', ...props }) => (
    <div className={`mb-4 ${className}`} {...props}>
        {children}
    </div>
);

const ModalBody = ({ children, className = '', ...props }) => (
    <div className={`mb-6 ${className}`} {...props}>
        {children}
    </div>
);

const ModalFooter = ({ children, className = '', ...props }) => (
    <div className={`flex justify-end space-x-3 ${className}`} {...props}>
        {children}
    </div>
);

// Confirmation Modal
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
    loading = false,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            danger={danger}
            footer={
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={danger ? "danger" : "primary"}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            }
        >
            <p className="text-gray-600">{message}</p>
        </Modal>
    );
};

// Alert Modal
const AlertModal = ({
    isOpen,
    onClose,
    title = "Alert",
    message,
    type = "info",
    buttonText = "OK",
}) => {
    const types = {
        info: 'text-blue-600',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <Button onClick={onClose} className="w-full">
                    {buttonText}
                </Button>
            }
        >
            <div className="text-center">
                <div className={`text-4xl mb-4 ${types[type]}`}>
                    {type === 'info' && 'ℹ️'}
                    {type === 'success' && '✅'}
                    {type === 'warning' && '⚠️'}
                    {type === 'danger' && '❌'}
                </div>
                <p className="text-gray-600">{message}</p>
            </div>
        </Modal>
    );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Confirmation = ConfirmationModal;
Modal.Alert = AlertModal;

export default Modal;