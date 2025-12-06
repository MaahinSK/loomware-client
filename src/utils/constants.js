export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    BUYER: 'buyer',
};

export const ORDER_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

export const TRACKING_STATUS = {
    ORDER_PLACED: 'order_placed',
    PROCESSING: 'processing',
    CUTTING: 'cutting',
    SEWING: 'sewing',
    FINISHING: 'finishing',
    QUALITY_CHECK: 'quality_check',
    PACKED: 'packed',
    SHIPPED: 'shipped',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
};

export const PAYMENT_METHODS = {
    CASH: 'cash',
    STRIPE: 'stripe',
    BANK: 'bank',
};

export const CATEGORIES = [
    'Shirt',
    'Pant',
    'Jacket',
    'Suits',
    'Accessories',
    'Dress',
    'Skirt',
    'T-Shirt',
    'Jeans',
    'Sweater',
    'Coat',
    'Shorts',
];