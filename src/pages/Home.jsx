import NavBar from "../components/Navbar";
import LoginSignupModel from "../components/LoginSignUpModel";
import BookingForm from "../components/BookingForm";
import HeroSection from "../components/HeroSection";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import { useState } from "react";

const Home = () => {
  const [isModelOpen, setModelOpen] = useState(false);

  return (
    <>
      <NavBar setModelOpen={setModelOpen} />
      <HeroSection setModelOpen={setModelOpen} />
      <BookingForm setModelOpen={setModelOpen} />
      <AboutUs />
      <ContactUs />
      <LoginSignupModel isModelOpen={isModelOpen} setModelOpen={setModelOpen} />
    </>
  );
};

export default Home;
