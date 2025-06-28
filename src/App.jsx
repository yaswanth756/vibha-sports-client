import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Bookings from './pages/bookings';
import AdminLayout from './admin/components/AdminLayout';
import AdminBookingsPage from './admin/pages/BookingsPage';
import UsersPage from './admin/pages/UsersPage';
import AdminLogin from './admin/pages/Login';
import CourtsPage from './admin/pages/CourtsPage';
import AnalyticsPage from './admin/pages/AnalyticsPage';
import Protected from './admin/components/Protected';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <Protected>
                <AdminLayout />
              </Protected>
            }
          >
            <Route index element={<AdminBookingsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="courts" element={<CourtsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
