import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Card = ({
    children,
    className = '',
    variant = 'default',
    shadow = 'md',
    rounded = 'xl',
    hoverable = false,
    ...props
}) => {
    const baseStyles = 'bg-white';

    const variants = {
        default: 'border border-gray-200',
        primary: 'bg-gradient-primary text-white',
        secondary: 'bg-gradient-secondary text-white',
        warning: 'bg-yellow-50 border border-yellow-200',
        danger: 'bg-red-50 border border-red-200',
        success: 'bg-green-50 border border-green-200',
        info: 'bg-blue-50 border border-blue-200',
        dark: 'bg-gray-800 text-white',
    };

    const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
    };

    const roundedStyles = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
    };

    const hoverStyles = hoverable ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${shadows[shadow]} ${roundedStyles[rounded]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({
    children,
    className = '',
    title,
    subtitle,
    action,
    onClose,
    ...props
}) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
            <div className="flex items-center justify-between">
                <div>
                    {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                    {children}
                </div>
                <div className="flex items-center space-x-2">
                    {action}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const CardBody = ({ children, className = '', padding = true, ...props }) => {
    return (
        <div
            className={`${padding ? 'px-6 py-4' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`px-6 py-4 border-t border-gray-200 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardImage = ({ src, alt, className = '', overlay = false, ...props }) => {
    return (
        <div className="relative">
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${className}`}
                {...props}
            />
            {overlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            )}
        </div>
    );
};

const CardTitle = ({ children, className = '', size = 'lg', ...props }) => {
    const sizes = {
        sm: 'text-sm font-medium',
        md: 'text-base font-semibold',
        lg: 'text-lg font-bold',
        xl: 'text-xl font-bold',
    };

    return (
        <h3 className={`text-gray-800 ${sizes[size]} ${className}`} {...props}>
            {children}
        </h3>
    );
};

const CardText = ({ children, className = '', muted = false, ...props }) => {
    return (
        <p className={`${muted ? 'text-gray-600' : 'text-gray-700'} ${className}`} {...props}>
            {children}
        </p>
    );
};

const CardAction = ({ children, className = '', ...props }) => {
    return (
        <div className={`mt-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Title = CardTitle;
Card.Text = CardText;
Card.Action = CardAction;

export default Card;