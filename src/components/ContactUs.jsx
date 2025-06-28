import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <footer className="bg-spring-leaves-900 text-spring-leaves-50 py-12" id="contact-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-center mb-6">Contact Us</h3>

        <div className="flex items-center justify-center text-center gap-2 text-spring-leaves-200">
          <MapPin size={20} />
          <p>
            Madanapalli Rd, opposite MG Grand, Gurrappagari Palli, Rayachoty, Andhra Pradesh 516269
          </p>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-6 text-spring-leaves-200 text-sm">
          <a
            href="mailto:support@example.com"
            className="flex items-center gap-2 hover:text-spring-leaves-50"
          >
            <Mail size={18} /> support@example.com
          </a>
          <a
            href="tel:+911234567890"
            className="flex items-center gap-2 hover:text-spring-leaves-50"
          >
            <Phone size={18} /> +91 123-456-7890
          </a>
        </div>
      </div>
    </footer>
  );
};

export default ContactUs;
