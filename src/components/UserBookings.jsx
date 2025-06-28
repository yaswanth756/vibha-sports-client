import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Calendar, Clock, MapPin, IndianRupee, XCircle,Trash2 } from 'lucide-react';
import formatTimeRange from '../../utils/timeConverter';
const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
        const response = await fetch(`${BACKEND_API}/api/bookings/user/${userId}`,{
          headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchBookings();
  }, [userId]);

  const filteredBookings = activeTab === 'All'
    ? bookings
    : bookings.filter((booking) => booking.status === activeTab.toLowerCase());

  const tabs = ['All', 'Booked', 'Completed', 'Cancelled'];

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse h-64 w-full max-w-sm mx-auto"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
  

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-spring-leaves-900 text-center mb-10 tracking-tight">
          Your Bookings
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-6 bg-red-50 p-4 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex justify-center mb-10 space-x-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-spring-leaves-600 text-white shadow-lg'
                  : 'bg-white text-spring-leaves-800 border border-spring-leaves-300 hover:bg-spring-leaves-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <p className="text-xl text-gray-600 font-medium">
              No bookings found for this category.
            </p>
            <p className="text-gray-500 mt-2">
              Book a court now to get started!
            </p>
          </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {filteredBookings.map((booking) => (
                <div
                    key={booking.bookingId}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 w-full max-w-sm flex flex-col justify-between"
                >
                    {/* Top: Court Name */}
                    <h3 className="text-xl font-semibold text-spring-leaves-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-spring-leaves-500" />
                    {booking.court}
                    </h3>
            
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Date:</span>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
            
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Time:</span>
                        {formatTimeRange(booking.startTime, booking.endTime)}
                    </div>
            
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Type:</span>
                        {booking.type}
                    </div>
            
                    <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Price:</span>
                        {booking.price}
                    </div>
            
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            booking.status === 'booked'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        >
                        {booking.status}
                        </span>
                    </div>
            
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Payment:</span>
                        <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            booking.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                        >
                        {booking.paymentStatus}
                        </span>
                    </div>
                    </div>
            
                    {/* Cancel Button */}
                    {booking.status === 'booked' && (
                        <div className=" flex justify-start">
                            <button
                            onClick={() => {
                                setSelectedBooking(booking);
                                setShowModal(true);
                            }}
                            className=" text-red-500 py-2 rounded-lg  flex items-center gap-2 transition-colors duration-200"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}  

                </div>
                ))}
            </div>
          
          
        )}
      </div>

      {/* Enhanced Cancel Confirmation Modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden  bg-white p-8 shadow-2xl transition-all border border-gray-100">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold text-gray-900 mb-6"
                  >
                    Cancel Booking
                  </Dialog.Title>
                  <div className="space-y-4 text-gray-700">
                    {selectedBooking && (
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <p><strong className="text-gray-900">Court:</strong> {selectedBooking.court}</p>
                        <p><strong className="text-gray-900">Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                        <p><strong className="text-gray-900">Time:</strong> {formatTimeRange(selectedBooking.startTime, selectedBooking.endTime)}</p>
                        <p><strong className="text-gray-900">Price:</strong> ₹{selectedBooking.price}</p>
                      </div>
                    )}
                    <p className="text-red-600 font-medium mt-4">
                      Are you sure you want to cancel this booking?
                    </p>
                    {modalError && (
                      <p className="text-red-500 font-semibold bg-red-50 p-3 rounded-lg">
                        {modalError}
                      </p>
                    )}
                    {modalSuccess && (
                      <p className="text-green-600 font-semibold bg-green-50 p-3 rounded-lg">
                        {modalSuccess}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                    >
                      Keep Booking
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                      onClick={async () => {
                        setLoading(true);
                        setModalError('');
                        setModalSuccess('');

                        const now = new Date();
                        const slotDateTime = new Date(`${selectedBooking.bookingDate} ${selectedBooking.startTime}`);
                        const isToday = now.toDateString() === slotDateTime.toDateString();
                        const hoursDiff = (slotDateTime - now) / (1000 * 60 * 60);

                        if (isToday && hoursDiff < 2) {
                          setModalError("Cancel at least 2 hours before start time. Need help? Contact our team.");
                          setLoading(false);
                          return;
                        }

                        try {
                          const response = await fetch(`${BACKEND_API}/api/bookings/${selectedBooking.bookingId}`, {
                            method: 'DELETE',
                            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
                          });

                          if (!response.ok) throw new Error();

                          setBookings(bookings.filter((b) => b.bookingId !== selectedBooking.bookingId));
                          setModalSuccess('Booking cancelled successfully!');
                          setTimeout(() => {
                            setShowModal(false);
                            setSelectedBooking(null);
                            setModalSuccess('');
                          }, 1500);
                        } catch (err) {
                          setModalError('Failed to cancel booking. Please try again.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          Cancelling...
                        </span>
                      ) : (
                        'Cancel Booking'
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default UserBookings;