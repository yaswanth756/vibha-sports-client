import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Users,
  MapPin,
  BarChart2,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Courts', path: '/admin/courts', icon: MapPin },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  ];

  return (
    <div className="flex min-h-screen bg-spring-leaves-50 text-gray-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-spring-leaves-100 
          flex flex-col transform transition-transform duration-200 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md hover:bg-spring-leaves-100 text-spring-leaves-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="text-xl lg:text-2xl font-semibold text-spring-leaves-700 mb-6 pt-2 lg:pt-7 pb-5 pl-5 border-b">
          <div className="flex items-center gap-2">
            <span className="bg-spring-leaves-200 rounded-full h-6 w-6 lg:h-8 lg:w-8 ml-1 flex items-center justify-center">
              <img
                src="https://ik.imagekit.io/jezimf2jod/ChatGPT_Image_Jun_26__2025__09_46_02_AM-removebg-preview.png"
                alt="Logo"
                className="h-4 w-4 lg:h-6 lg:w-6 object-contain"
              />
            </span>
            <span className="hidden sm:inline">Vibha Sports</span>
            <span className="sm:hidden">Vibha  Sports</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 lg:space-y-4 pl-4 pr-2 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 lg:py-3 rounded-md text-spring-leaves-800 transition-colors ${
                  isActive || location.pathname === item.path
                    ? 'bg-spring-leaves-100 font-semibold'
                    : 'hover:bg-spring-leaves-100'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm lg:text-base">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-spring-leaves-100 p-4 lg:p-6 flex justify-between items-center">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-spring-leaves-100 text-spring-leaves-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <h1 className="text-lg lg:text-xl font-semibold text-spring-leaves-700 pb-1">
              <span className="hidden sm:inline">Welcome to Admin Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
          </div>

          {/* Profile Dropdown */}
          <div className="relative dropdown-container">
            <div
              className="flex items-center gap-2 text-spring-leaves-800 font-medium cursor-pointer px-2 py-1 rounded-md hover:bg-spring-leaves-50"
              onClick={toggleDropdown}
            >
              <span className="text-sm lg:text-base">
                <span className="hidden sm:inline">Hi {user?.name || 'Admin'}</span>
                <span className="sm:hidden">{user?.name?.split(' ')[0] || 'Admin'}</span>
              </span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-spring-leaves-100 p-2 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="px-4 lg:px-6 py-4 lg:py-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;