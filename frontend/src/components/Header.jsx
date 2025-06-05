// src/components/Header.jsx
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaSearch, FaRegHeart, FaRegComment, FaRegBell, FaRegUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserCircle,
  FaTachometerAlt,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { motion } from "framer-motion";
import CategoriesBar from "./CategoriesBar";

const Header = ({  isLoggedIn, user, setIsLoggedIn, setUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null); // Make sure `setUser` is passed as a prop to this component
    setDropdownOpen(false); // ✅ Correct the state name
    toast.success("Logged out successfully!", { autoClose: 2000 });
  };


  const handlefeatureClick = () => {
    toast.info("Feature coming soon!", { autoClose: 2000 });
  };
  
  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className="flex items-center justify-between px-4 py-2 shadow-md bg-white relative">
      {/* Logo */}
      <Link to="/">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      </Link>

      {/* Search Bar */}
      <div className="flex-grow max-w-lg mx-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Search anything..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button className="bg-black text-white px-4 rounded-r-md">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-5">
        {isLoggedIn ? (
          <>
          <Link
            to="/wishlist"
            className="text-lg text-gray-600 mr-3 font-medium hover:underline">

          <FaRegHeart className="text-2xl cursor-pointer" />
       </Link>
         

          <FaRegComment className="text-2xl cursor-pointer" onClick={handlefeatureClick}/>
          
          <FaRegBell className="text-2xl cursor-pointer" onClick={handlefeatureClick}/>
          
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-9 h-9 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-semibold cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-2xl" />
              )}
            </div>
            
{dropdownOpen && (
  <motion.div
    initial={{ opacity: 0, translateY: -8 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ duration: 0.2 }}
    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4"
  >
    {/* Profile Info */}
    <div className="flex items-center gap-3 mb-4">
     <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-3xl shadow-md">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <FaUserCircle  />
        )}  

      </div>
      <div>
        <p className="font-semibold text-base text-gray-800">
          {user?.name || "OLX User"}
        </p>
        <p className="text-gray-500 text-xs">{user?.email || "user@example.com"}</p>
      </div>
    </div>

    {/* Edit Profile */}
    <Link
  to="/profile"
  onClick={() => setDropdownOpen(false)}
  className="block w-full text-center bg-blue-600 text-white text-sm py-1.5 font-semibold rounded-md mb-4 hover:bg-blue-400 hover:text-blue-800 transition-all duration-200"
>
  View & Edit Profile
</Link>


    {/* Divider */}
    

    {/* Middle Section with border top and bottom */}
    <div className="py-2 border-y border-gray-300">
      <ul className="space-y-2 text-gray-700 text-sm font-medium">
        <li>
          <Link
            to="/dashboard"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 pl-3 text-gray-600 hover:text-blue-500 transition"
          >
            <FaTachometerAlt className="text-base" /> Dashboard
          </Link>
        </li>
          <hr className="my-2 border-gray-300" />     
        <li onClick={handlefeatureClick}>
          <Link
            to="#"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 pl-3 text-gray-600  hover:text-blue-500 transition"
          >
            <FaQuestionCircle className="text-base" /> Help
          </Link>
        </li>
        <hr className="my-2 border-gray-300" />
        <li onClick={handlefeatureClick}>
          <Link
            to="#"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 pl-3 text-gray-600  hover:text-blue-500 transition"
          >
            <FaCog className="text-base" /> Settings
          </Link>
        </li>
      </ul>
    </div>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="w-full mt-3 bg-red-400 text-red-50 py-1.5 text-sm rounded-md font-medium flex items-center justify-center gap-2"
    >
      <FaSignOutAlt className="text-sm" /> Logout
    </button>
  </motion.div>
)}
          </div>
        </>
        
        ) : (
          <Link
            to="/login"
            className="text-lg text-gray-600 mr-3 font-medium hover:underline"
          >
            Login
          </Link>
        )}
        <Link
          to="/sell"
          className="flex items-center px-4 py-1.5 border-[3px] border-yellow-600 rounded-full shadow-md text-blue-600 font-bold"
        >
          + SELL
        </Link>
      </div>
    </header>
      <CategoriesBar />
      <ToastContainer position="top-center" autoClose={2000} />
      </>

  );
};

export default Header;




