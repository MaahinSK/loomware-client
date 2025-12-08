import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { registerWithEmailPassword, loginWithEmailPassword, signInWithGoogle, signOut } from '../services/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Login with Firebase Client SDK first
            await loginWithEmailPassword(email, password);

            // Then Login with Backend
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.data.user);
            toast.success('Login successful!');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Login error:', error);
            const message = error.code ? error.code : (error.response?.data?.message || 'Login failed');
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            // Create user in Firebase Client SDK first
            const firebaseUser = await registerWithEmailPassword(userData.email, userData.password);

            // Then Register in Backend
            const response = await api.post('/auth/register', {
                ...userData,
                firebaseUid: firebaseUser.uid
            });

            localStorage.setItem('token', response.data.token);

            setUser(response.data.data.user);
            toast.success('Registration successful! Please wait for admin approval.');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.code ? error.code : (error.response?.data?.message || 'Registration failed');
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            // Logout from Firebase
            await signOut();
            // Logout from Backend
            await api.post('/auth/logout');
            localStorage.removeItem('token');
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/auth/update-profile', profileData);
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

    const googleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            localStorage.setItem('token', result.token);
            setUser(result.data.user);
            toast.success('Google Login successful!');
            return { success: true, data: result.data };
        } catch (error) {
            console.error('Google login error:', error);
            toast.error(error.message || 'Google login failed');
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        login,
        googleLogin,
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