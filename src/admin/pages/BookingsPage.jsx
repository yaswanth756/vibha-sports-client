import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import formatTimeRange from '../../../utils/timeConverter';
const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_API}/api/admin/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      toast.error('❌ Failed to fetch bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete booking
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_API}/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.bookingId !== id));
        toast.success('Booking deleted.');
      } else {
        toast.error('❌ Failed to delete booking.');
      }
    } catch (err) {
      toast.error('❌ Error deleting booking.');
    }
  };

  // Update paymentStatus or status
  const handleEdit = async (id, field, value) => {
    try {
      const res = await fetch(`${BACKEND_API}/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingId === id ? { ...b, [field]: value } : b
          )
        );
        toast.success(`${field} updated.`);
      } else {
        toast.error(`❌ Failed to update ${field}.`);
      }
    } catch (err) {
      toast.error(`❌ Error updating ${field}.`);
    }
  };

  // Bulk update
  const handleBulkUpdate = async () => {
    try {
      const res = await fetch(`${BACKEND_API}/api/admin/bulk-complete`, {
        method: 'PUT',
      });

      if (res.ok) {
        const updated = await res.json();
        setBookings(updated);
        toast.success('Past bookings marked as completed!');
      } else {
        toast.error('Bulk update failed.');
      }
    } catch (err) {
      toast.error('Error updating bookings.');
    }
  };

  // Filtering logic
  const filteredBookings = bookings.filter((booking) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      booking.bookingId.toLowerCase().includes(q) ||
      booking.userName.toLowerCase().includes(q) ||
      booking.userPhone.includes(q) ||
      booking.court.toLowerCase().includes(q) ||
      booking.slotTime?.toLowerCase().includes(q) ||
      booking.bookingDate.includes(q);

    const matchesPayment =
      !paymentStatusFilter || booking.paymentStatus === paymentStatusFilter;
    const matchesStatus = !statusFilter || booking.status === statusFilter;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 sm:px-4 lg:px-4 space-y-6">
      <ToastContainer position="top-right" autoClose={2000} />

      <h1 className="text-2xl font-medium text-spring-leaves-800 md:text-3xl">
        Bookings Management
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-spring-leaves-500" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-spring-leaves-300 rounded-md focus:ring-2 focus:ring-spring-leaves-500 outline-none"
          />
        </div>

        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-spring-leaves-300 rounded-md focus:ring-2 focus:ring-spring-leaves-500"
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-spring-leaves-300 rounded-md focus:ring-2 focus:ring-spring-leaves-500"
        >
          <option value="">All Status</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={handleBulkUpdate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-spring-leaves-600 text-white rounded-md hover:bg-spring-leaves-700"
        >
          <CheckCircle className="w-5 h-5" /> Mark Past as Completed
        </button>
      </div>

      {/* Responsive Table/Card Layout */}
      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-spring-leaves-100 bg-white">
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spring-leaves-600"></div>
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <table className="hidden md:table w-full text-sm text-gray-700">
              <thead className="bg-spring-leaves-100 text-spring-leaves-800 text-left">
                <tr>
                  <th className="p-3 font-medium">Booking ID</th>
                  <th className="p-3 font-medium">User</th>
                  <th className="p-3 font-medium">Court</th>
                  <th className="p-3 font-medium">Slot</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Price</th>
                  <th className="p-3 font-medium">Payment</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.bookingId} className="border-t hover:bg-spring-leaves-50">
                    <td className="p-3 text-sm">{b.bookingId}</td>
                    <td className="p-3 text-sm">
                      {b.userName}
                      <br />
                      <span className="text-xs text-gray-500">{b.userPhone}</span>
                    </td>
                    <td className="p-3">{b.court}</td>
                    <td className="p-3">
                      {b.slotStartTime && b.slotEndTime
                        ? formatTimeRange(b.slotStartTime, b.slotEndTime)
                        : 'N/A'}
                    </td>
                    <td className="p-3">{b.bookingDate}</td>
                    <td className="p-3">₹{b.price}</td>
                    <td className="p-3">
                      <select
                        value={b.paymentStatus}
                        onChange={(e) =>
                          handleEdit(b.bookingId, 'paymentStatus', e.target.value)
                        }
                        className="border rounded-md px-2 py-1 w-full"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleEdit(b.bookingId, 'status', e.target.value)
                        }
                        className="border rounded-md px-2 py-1 w-full"
                      >
                        <option value="booked">Booked</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <button
                          title="Mark as Completed"
                          onClick={() => handleEdit(b.bookingId, 'status', 'completed')}
                          className="text-spring-leaves-600 hover:text-spring-leaves-700"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(b.bookingId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Card layout for mobile screens */}
            <div className="md:hidden divide-y divide-spring-leaves-100">
              {filteredBookings.map((b) => (
                <div key={b.bookingId} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-spring-leaves-800">{b.bookingId}</p>
                      <p className="text-sm text-gray-500">{b.userName} ({b.userPhone})</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        title="Mark as Completed"
                        onClick={() => handleEdit(b.bookingId, 'status', 'completed')}
                        className="text-spring-leaves-600 hover:text-spring-leaves-700"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(b.bookingId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Court</p>
                      <p>{b.court}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Slot</p>
                      <p>
                        {b.slotStartTime && b.slotEndTime
                          ? formatTimeRange(b.slotStartTime, b.slotEndTime)
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p>{b.bookingDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p>₹{b.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment</p>
                      <select
                        value={b.paymentStatus}
                        onChange={(e) =>
                          handleEdit(b.bookingId, 'paymentStatus', e.target.value)
                        }
                        className="border rounded-md px-2 py-1 w-full"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleEdit(b.bookingId, 'status', e.target.value)
                        }
                        className="border rounded-md px-2 py-1 w-full"
                      >
                        <option value="booked">Booked</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {filteredBookings.length === 0 && (
                <div className="text-center p-6 text-gray-500">
                  No bookings found.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;