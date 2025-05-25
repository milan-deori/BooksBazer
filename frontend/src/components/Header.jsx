// src/components/Header.jsx
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaSearch, FaRegHeart, FaRegComment, FaRegBell, FaRegUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <FaRegHeart className="text-2xl cursor-pointer" />
          <FaRegComment className="text-2xl cursor-pointer" />
          <FaRegBell className="text-2xl cursor-pointer" />
          
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-9 h-9 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-semibold cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded shadow-lg z-10 p-4 text-sm">
                <p className="font-bold mb-1">Welcome, {user?.name || "User"}!</p>
                <p className="text-gray-600 mb-3">{user?.email || "user@example.com"}</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
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
  );
};

export default Header;




