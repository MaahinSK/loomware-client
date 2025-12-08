import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const updateUserRole = async (userId, role) => {
        try {
            await api.put(`/users/${userId}`, { role });
            toast.success('User role updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const updateUserStatus = async (userId, status, reason = '') => {
        try {
            await api.put(`/users/${userId}`, { status, suspendReason: reason });
            toast.success('User status updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <Helmet>
                <title>Manage Users - Admin Dashboard</title>
            </Helmet>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
                        <p className="text-gray-600">Manage user roles and permissions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <select
                            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={user.photoURL || 'https://via.placeholder.com/40'}
                                                    alt={user.name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="border rounded px-2 py-1 text-sm"
                                            value={user.role}
                                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                                        >
                                            <option value="buyer">Buyer</option>
                                            <option value="manager">Manager</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : user.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {user.status === 'pending' && (
                                                <button
                                                    onClick={() => updateUserStatus(user._id, 'approved')}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    <FaCheck />
                                                </button>
                                            )}
                                            {user.status !== 'suspended' && (
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt('Enter suspend reason:');
                                                        if (reason) updateUserStatus(user._id, 'suspended', reason);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                            {user.status === 'suspended' && (
                                                <button
                                                    onClick={() => updateUserStatus(user._id, 'approved')}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Restore
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No users found</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageUsers;