import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // API base URL from environment
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Initialize axios with credentials
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = API_URL;

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/auth/me');
            setUser(response.data.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', { email, password });
            setUser(response.data.data.user);
            toast.success('Login successful!');
            return { success: true, data: response.data };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/auth/register', userData);
            setUser(response.data.data.user);
            toast.success('Registration successful! Please wait for admin approval.');
            return { success: true, data: response.data };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await axios.put('/auth/update-profile', profileData);
            setUser(response.data.data.user);
            toast.success('Profile updated successfully!');
            return { success: true, data: response.data };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            return { success: false, error: error.response?.data };
        }
    };

    const isAdmin = () => user?.role === 'admin';
    const isManager = () => user?.role === 'manager';
    const isBuyer = () => user?.role === 'buyer';
    const isApproved = () => user?.status === 'approved';

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isManager,
        isBuyer,
        isApproved,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};