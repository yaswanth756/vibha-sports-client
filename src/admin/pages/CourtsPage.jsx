import React, { useEffect, useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const CourtsPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCourtId, setEditCourtId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_API}/api/courts`);
      const data = await res.json();
      setCourts(data);
    } catch (err) {
      toast.error('Failed to fetch courts');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceEdit = (court) => {
    setEditCourtId(court._id);
    setNewPrice(court.pricePerHour);
  };

  const cancelEdit = () => {
    setEditCourtId(null);
    setNewPrice('');
  };

  const saveNewPrice = async (id) => {
    try {
      const res = await fetch(`${BACKEND_API}/api/courts/${id}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pricePerHour: newPrice }),
      });

      if (res.ok) {
        toast.success('Price updated');
        fetchCourts();
        cancelEdit();
      } else {
        toast.error('Failed to update price');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-4  space-y-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-2xl md:text-3xl font-medium text-spring-leaves-800">Courts List</h1>

      {loading ? (
        <div className="w-full flex justify-center items-center py-20 bg-white rounded-lg shadow">
          <div className="h-10 w-10 border-4 border-spring-leaves-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg ring-1 ring-spring-leaves-100">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-spring-leaves-50 text-xs uppercase text-spring-leaves-700">
                <tr>
                  <th className="p-3 text-left">Court ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Price / Hour</th>
                  <th className="p-3 text-left">Created At</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      No courts available.
                    </td>
                  </tr>
                ) : (
                  courts.map((court) => (
                    <tr key={court._id} className="border-t hover:bg-spring-leaves-50">
                      <td className="p-3">{court._id.slice(0, 8)}...</td>
                      <td className="p-3 font-medium">{court.name}</td>
                      <td className="p-3">
                        {editCourtId === court._id ? (
                          <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="border p-1 w-20 rounded focus:ring-2 focus:ring-spring-leaves-400"
                          />
                        ) : (
                          `₹${court.pricePerHour}`
                        )}
                      </td>
                      <td className="p-3">
                        {new Date(court.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {editCourtId === court._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveNewPrice(court._id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePriceEdit(court)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card layout for mobile screens */}
          <div className="md:hidden divide-y divide-spring-leaves-100 bg-white rounded-lg shadow ring-1 ring-spring-leaves-100">
            {courts.map((court) => (
              <div key={court._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-spring-leaves-800">{court.name}</p>
                    <p className="text-sm text-gray-500">{court._id.slice(0, 8)}...</p>
                  </div>
                  <div className="flex gap-2">
                    {editCourtId === court._id ? (
                      <>
                        <button
                          onClick={() => saveNewPrice(court._id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePriceEdit(court)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Price / Hour</p>
                    {editCourtId === court._id ? (
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="border p-1 w-full rounded focus:ring-2 focus:ring-spring-leaves-400"
                      />
                    ) : (
                      <p>₹{court.pricePerHour}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-500">Created At</p>
                    <p>{new Date(court.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {courts.length === 0 && (
              <div className="text-center p-6 text-gray-500">
                No courts available.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CourtsPage;