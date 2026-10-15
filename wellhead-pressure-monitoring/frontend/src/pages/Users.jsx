import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users as UsersIcon, Shield, User as UserIcon } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users');
                setUsers(response.data);
            } catch (e) {
                console.error("Error fetching users", e);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center text-gray-500">Loading system users...</div>;
    }

    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Users Management</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage system operators, engineers, and access privileges</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold shadow hover:bg-blue-600 transition-colors">
                    + Add New User
                </button>
            </div>

            <div className="bg-card border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#121212] text-gray-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Role</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Username</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">System UI</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Auth Log</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <UsersIcon size={48} className="mx-auto mb-4 opacity-50" />
                                        No users found.
                                    </td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${user.role.toUpperCase() === 'ADMIN' ? 'text-primary bg-primary/10 border-primary/30' : 'text-gray-300 bg-gray-500/10 border-gray-500/30'}`}>
                                            {user.role.toUpperCase() === 'ADMIN' ? <Shield size={14} /> : <UserIcon size={14} />}
                                            {user.role.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-bold text-white group-hover:text-primary transition-colors">{user.username}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                        UID-{user.id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-xs">
                                        Valid JWT Status
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="text-gray-500 hover:text-white transition-colors text-xs uppercase font-bold pr-2">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
