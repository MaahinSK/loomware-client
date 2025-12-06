import api from './api';

const productsService = {
    // Get all products with pagination and filters
    getAllProducts: async (params = {}) => {
        try {
            const response = await api.get('/products', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get single product by ID
    getProductById: async (productId) => {
        try {
            const response = await api.get(`/products/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get featured products
    getFeaturedProducts: async (limit = 6) => {
        try {
            const response = await api.get('/products/featured', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get related products
    getRelatedProducts: async (productId, limit = 4) => {
        try {
            const response = await api.get(`/products/related/${productId}`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Search products
    searchProducts: async (query, params = {}) => {
        try {
            const response = await api.get('/products/search', {
                params: { query, ...params }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get products by category
    getProductsByCategory: async (category, params = {}) => {
        try {
            const response = await api.get(`/products/category/${category}`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create new product (Manager only)
    createProduct: async (productData) => {
        try {
            const formData = new FormData();

            // Append product data
            Object.keys(productData).forEach(key => {
                if (key === 'images' && Array.isArray(productData[key])) {
                    productData[key].forEach((image, index) => {
                        formData.append('images', image);
                    });
                } else if (key === 'paymentOptions' && Array.isArray(productData[key])) {
                    formData.append(key, JSON.stringify(productData[key]));
                } else {
                    formData.append(key, productData[key]);
                }
            });

            const response = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update product
    updateProduct: async (productId, productData) => {
        try {
            const response = await api.put(`/products/${productId}`, productData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete product
    deleteProduct: async (productId) => {
        try {
            const response = await api.delete(`/products/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Toggle product feature
    toggleProductFeature: async (productId, featured) => {
        try {
            const response = await api.put(`/products/${productId}/feature`, { featured });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Upload product images
    uploadProductImages: async (productId, images) => {
        try {
            const formData = new FormData();
            images.forEach(image => {
                formData.append('images', image);
            });

            const response = await api.post(`/products/${productId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get product statistics
    getProductStats: async () => {
        try {
            const response = await api.get('/products/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get trending products
    getTrendingProducts: async (limit = 8) => {
        try {
            const response = await api.get('/products/trending', { params: { limit } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Add product review
    addProductReview: async (productId, reviewData) => {
        try {
            const response = await api.post(`/products/${productId}/reviews`, reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get product reviews
    getProductReviews: async (productId, params = {}) => {
        try {
            const response = await api.get(`/products/${productId}/reviews`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update inventory
    updateInventory: async (productId, quantity) => {
        try {
            const response = await api.put(`/products/${productId}/inventory`, { quantity });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get low stock products
    getLowStockProducts: async (threshold = 10) => {
        try {
            const response = await api.get('/products/low-stock', { params: { threshold } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default productsService;