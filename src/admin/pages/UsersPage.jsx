import React, { useState, useEffect } from 'react';
import { Search, Trash2, Pencil, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('User deleted');
        fetchUsers();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting user');
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, phone: user.phone, role: user.role });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${editUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('User updated');
        setEditUser(null);
        fetchUsers();
      } else {
        toast.error('Failed to update');
      }
    } catch (err) {
      toast.error('Error updating user');
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-4 space-y-6">
      <ToastContainer position="top-right" autoClose={2000} />

      <h1 className="text-2xl md:text-3xl font-medium text-spring-leaves-800">
        Users Management
      </h1>

      {/* Search Input */}
      <div className="relative w-full sm:max-w-sm">
        <input
          type="text"
          placeholder="Search by ID, name, email, phone, role"
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-spring-leaves-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Users Table/Card Layout */}
      {loading ? (
        <div className="w-full flex justify-center items-center py-20 bg-white rounded-lg shadow">
          <div className="h-10 w-10 border-4 border-spring-leaves-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow ring-1 ring-spring-leaves-100 bg-white">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-spring-leaves-50 text-left text-xs uppercase font-medium text-spring-leaves-700">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Total Bookings</th>
                  <th className="p-3">Completed</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-t hover:bg-spring-leaves-50">
                      <td className="p-3">{user._id.slice(0, 8)}...</td>
                      <td className="p-3 font-medium">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">{user.totalBookings || 0}</td>
                      <td className="p-3">{user.completedBookings || 0}</td>
                      <td className="p-3 flex justify-center gap-3">
                        <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-800">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card layout for mobile screens */}
          <div className="md:hidden divide-y divide-spring-leaves-100 bg-white rounded-lg shadow ring-1 ring-spring-leaves-100">
            {filteredUsers.map((user) => (
              <div key={user._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-spring-leaves-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user._id.slice(0, 8)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p>{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Role</p>
                    <p className="capitalize">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Joined</p>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Bookings</p>
                    <p>{user.totalBookings || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Completed</p>
                    <p>{user.completedBookings || 0}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center p-6 text-gray-500">
                No users found.
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative space-y-4">
            <button
              onClick={() => setEditUser(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-spring-leaves-700">Edit User</h3>
            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-spring-leaves-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-spring-leaves-400"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <select
              className="w-full border rounded p-2 focus:ring-2 focus:ring-spring-leaves-400"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="w-full bg-spring-leaves-600 text-white px-4 py-2 rounded hover:bg-spring-leaves-700"
              onClick={handleUpdate}
            >
              Update User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;