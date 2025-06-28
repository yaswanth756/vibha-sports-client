import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {toast} from 'react-toastify';

const Protected = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Check if token is expired
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired || decoded.role !== 'admin') {
       
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      console.error("Invalid token", err);
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Checking credentials...
      </div>
    );
  }

  if (!isAuthorized) {

    toast.error('You are not authorized to access this page.');
    localStorage.removeItem('token'); // Clear invalid token
    
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default Protected;
