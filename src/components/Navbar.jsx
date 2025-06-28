import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Smile } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const NavLinks = [
  { name: "My Bookings", path: "/bookings" },
  { name: "About Us", path: "#about-us" },
  { name: "Contact Us", path: "#contact-us" },
];

const NavBar = ({ setModelOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
  const { user, loading, logout } = useAuth();

  const dropdownRefDesktop = useRef(null);
  const dropdownRefMobile = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleDropdownMobile = () => setDropdownOpenMobile((prev) => !prev);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefDesktop.current &&
        !dropdownRefDesktop.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        dropdownRefMobile.current &&
        !dropdownRefMobile.current.contains(event.target)
      ) {
        setDropdownOpenMobile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b sticky top-0 z-50 md:px-4 shadow-sm">
      <div className="flex justify-between items-center p-5">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-spring-leaves-700 flex items-center">
              VibhaSp
              <span className="bg-spring-leaves-100 rounded-full h-8 w-8 ml-1 flex items-center justify-center">
                <img
                  src="https://ik.imagekit.io/jezimf2jod/ChatGPT_Image_Jun_26__2025__09_46_02_AM-removebg-preview.png"
                  alt="Logo"
                  className="h-6 w-6 object-contain"
                />
              </span>
              rts
            </h1>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center">
          {NavLinks.map((link) =>
            link.name === "My Bookings" ? (
              user ? (
                <Link
                  to={link.path}
                  key={link.name}
                  className="group relative px-4 py-2 text-gray-800 hover:text-spring-leaves-600 transition-colors"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-spring-leaves-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => setModelOpen(true)}
                  className="group relative px-4 py-2 text-gray-800 hover:text-spring-leaves-600 transition-colors"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-spring-leaves-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              )
            ) : (
              <a
                href={link.path}
                key={link.name}
                className="group relative px-4 py-2 text-gray-800 hover:text-spring-leaves-600 transition-colors"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-spring-leaves-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            )
          )}

          {loading ? (
            <div className="px-4 py-2 rounded-xl bg-gray-100 animate-pulse flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="w-20 h-4 bg-gray-300 rounded" />
            </div>
          ) : user ? (
            <div className="relative flex items-center" ref={dropdownRefDesktop}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 text-base text-gray-700 px-4 py-2 rounded-xl bg-spring-leaves-100 hover:bg-spring-leaves-200 transition-colors"
              >
                <User size={20} className="text-gray-700" />
                <span className="font-medium">
                  Hi, {user.name?.split(" ")[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-44 bg-white border rounded-lg shadow-md z-10 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="flex items-center gap-2 text-base text-gray-700 px-4 py-2 rounded-xl hover:bg-spring-leaves-100 transition-colors"
              onClick={() => setModelOpen(true)}
            >
              <User size={20} className="text-gray-700" />
              <span>Login</span>
              <span className="text-gray-500">/</span>
              <span>Signup</span>
            </button>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center space-x-2">
          {user ? (
            <Link
              to="/bookings"
              className="text-gray-800 bg-spring-leaves-100 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              My Bookings
            </Link>
          ) : (
            <button
              onClick={() => setModelOpen(true)}
              className="text-gray-800 bg-spring-leaves-100 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              My Bookings
            </button>
          )}

          {loading ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <div className="relative flex items-center" ref={dropdownRefMobile}>
              <button
                onClick={toggleDropdownMobile}
                className="bg-gray-100 rounded-full p-2"
              >
                <User className="text-gray-700 h-5 w-5" />
              </button>

              {dropdownOpenMobile && (
                <div className="absolute right-0 top-10 w-44 bg-white border rounded-lg shadow-md z-10 py-2">
                  <div className="px-4 py-2 text-sm text-gray-700 flex items-center gap-2">
                    <Smile size={16} className="text-spring-leaves-600" />
                    Hi, {user.name?.split(" ")[0]}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setModelOpen(true)}>
              <User className="text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
