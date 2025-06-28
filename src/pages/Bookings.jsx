import React from 'react';
import NavBar from '../components/Navbar';
import ContactUs from '../components/ContactUs';
import AboutUs from '../components/AboutUs';
import UserBookings from '../components/UserBookings';
import { useAuth } from '../context/AuthContext';

const AdminBookings = () => {
  const { user } = useAuth(); 

  return (
    <>
      <NavBar />
      <UserBookings userId={user?.id}  />
      <AboutUs />
      <ContactUs />
    </>
  );
};

export default AdminBookings;