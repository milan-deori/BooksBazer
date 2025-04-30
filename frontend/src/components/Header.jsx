// src/components/Header.jsx
import { Link } from "react-router-dom";
import { FaSearch,FaRegHeart, FaRegComment,FaRegBell, FaRegUserCircle } from "react-icons/fa";



const Header = ({ isLoggedIn }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 shadow-md bg-white">
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
            <FaRegHeart className="text-2xl cursor-pointer mr-1" />
            <FaRegComment className="text-2xl cursor-pointer mr-1" />
            <FaRegBell className="text-2xl cursor-pointer mr-1" />
            <FaRegUserCircle className="text-3xl cursor-pointer mr-2" />
          </>
        ) : (
          <Link to="/login" className="text-lg  text-gray-600 mr-3 font-medium hover:underline">
            Login
          </Link>
        )}
        <Link
          to="/sell"
          className="flex items-center px-4 py-1.5  border-[3px] border-yellow-600 rounded-full shadow-md text-blue-600 font-bold "
        >
          + SELL
        </Link>
      </div>
    </header>
  );
};

export default Header;


