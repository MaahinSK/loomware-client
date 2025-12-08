import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from '../components/common/PrivateRoute';
import Spinner from '../components/common/Spinner';
import { Helmet } from 'react-helmet-async';
import {
    FaTachometerAlt,
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaPlus,
    FaClipboardList,
    FaCheckCircle,
    FaUserCircle,
    FaBell,
    FaCog,
    FaSpinner
} from 'react-icons/fa';
import api from '../services/api';

// Dashboard Components
import ManageUsers from '../components/dashboard/admin/ManageUsers';
import AllProducts from '../components/dashboard/admin/AllProducts';
import AllOrders from '../components/dashboard/admin/AllOrders';
import AddProduct from '../components/dashboard/manager/AddProduct';
import ManageProducts from '../components/dashboard/manager/ManageProducts';
import PendingOrders from '../components/dashboard/manager/PendingOrders';
import ApprovedOrders from '../components/dashboard/manager/ApprovedOrders';
import MyOrders from '../components/dashboard/buyer/MyOrders';
import TrackOrder from '../components/dashboard/buyer/TrackOrder';
import Profile from '../components/dashboard/Profile';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const adminLinks = [
        { path: '/dashboard/users', label: 'Manage Users', icon: <FaUsers /> },
        { path: '/dashboard/all-products', label: 'All Products', icon: <FaBox /> },
        { path: '/dashboard/all-orders', label: 'All Orders', icon: <FaShoppingCart /> },
    ];

    const managerLinks = [
        { path: '/dashboard/add-product', label: 'Add Product', icon: <FaPlus /> },
        { path: '/dashboard/manage-products', label: 'Manage Products', icon: <FaBox /> },
        { path: '/dashboard/pending-orders', label: 'Pending Orders', icon: <FaClipboardList /> },
        { path: '/dashboard/approved-orders', label: 'Approved Orders', icon: <FaCheckCircle /> },
    ];

    const buyerLinks = [
        { path: '/dashboard/my-orders', label: 'My Orders', icon: <FaShoppingCart /> },
        { path: '/dashboard/track-order', label: 'Track Order', icon: <FaClipboardList /> },
    ];

    const getSidebarLinks = () => {
        if (user?.role === 'admin') return adminLinks;
        if (user?.role === 'manager') return managerLinks;
        return buyerLinks;
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Dashboard - LoomWare</title>
            </Helmet>

            {/* Top Bar */}
            <header className="bg-white shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaTachometerAlt className="text-primary-600 mr-3" size={24} />
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-primary-600">
                                <FaBell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <FaUserCircle size={24} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-80px)]">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === '/dashboard'
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaTachometerAlt className="mr-3" />
                                    Overview
                                </Link>
                            </li>
                            {getSidebarLinks().map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === link.path
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="mr-3">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-4 mt-4 border-t">
                                <Link
                                    to="/dashboard/profile"
                                    className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === '/dashboard/profile'
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaUserCircle className="mr-3" />
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={logout}
                                    className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                                >
                                    <FaCog className="mr-3" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

const Dashboard = () => {
    // Safelist dynamic classes so Tailwind includes them
    const safelist = [
        'bg-orange-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-green-600',
        'bg-gradient-primary',
        'bg-gradient-secondary',
        'bg-gradient-dark'
    ];

    const { user, loading } = useAuth();
    const [stats, setStats] = React.useState([]);
    const [statsLoading, setStatsLoading] = React.useState(true);

    React.useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/stats');
            setStats(response.data.data.stats);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        } finally {
            setStatsLoading(false);
        }
    };

    if (loading) {
        return <Spinner fullScreen />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <DashboardLayout>
            <Routes>
                {/* Admin Routes */}
                <Route
                    path="users"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <ManageUsers />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="all-products"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AllProducts />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="all-orders"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AllOrders />
                        </PrivateRoute>
                    }
                />

                {/* Manager Routes */}
                <Route
                    path="add-product"
                    element={
                        <PrivateRoute roles={['manager']}>
                            <AddProduct />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="manage-products"
                    element={
                        <PrivateRoute roles={['manager']}>
                            <ManageProducts />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="pending-orders"
                    element={
                        <PrivateRoute roles={['manager']}>
                            <PendingOrders />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="approved-orders"
                    element={
                        <PrivateRoute roles={['manager']}>
                            <ApprovedOrders />
                        </PrivateRoute>
                    }
                />

                {/* Buyer Routes */}
                <Route
                    path="my-orders"
                    element={
                        <PrivateRoute roles={['buyer']}>
                            <MyOrders />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="track-order"
                    element={
                        <PrivateRoute roles={['buyer']}>
                            <TrackOrder />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="track-order/:orderId"
                    element={
                        <PrivateRoute roles={['buyer']}>
                            <TrackOrder />
                        </PrivateRoute>
                    }
                />

                {/* Shared Routes */}
                <Route path="profile" element={<Profile />} />

                {/* Default Dashboard */}
                <Route
                    index
                    element={
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Welcome back, {user?.name}!</h2>

                            {statsLoading ? (
                                <div className="flex justify-center py-12">
                                    <FaSpinner className="animate-spin text-4xl text-primary-500" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {stats.length > 0 ? (
                                        stats.map((stat, index) => (
                                            <div key={index} className={`${stat.color} text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200`}>
                                                <h3 className="text-xl font-bold mb-2 opacity-90">{stat.label}</h3>
                                                <p className="text-3xl font-extrabold">{stat.value}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
                                            <p className="text-gray-500 text-lg">No stats available for your role ({user?.role})</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    }
                />
            </Routes>
        </DashboardLayout>
    );
};

export default Dashboard;