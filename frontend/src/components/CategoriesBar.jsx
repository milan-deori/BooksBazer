import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const CategoriesBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) =>
        currentPath === path
            ? "border-b-2 border-blue-600 text-blue-600"
            : "border-b-2 border-transparent hover:border-blue-300";

    return (
        <div className="bg-white shadow-sm py-2 px-4 overflow-x-auto whitespace-nowrap border-b">
            <div className="max-w-7xl mx-auto flex justify-center space-x-6 text-sm font-semibold text-gray-700">
                <Link to="/" className={`flex items-center gap-1 ${isActive("/books")} pb-1`}>
                    All Categories <FaChevronDown  className="mt-1"/>
                </Link>
                <Link to="/books/study" className={`${isActive("/books/study")} pb-1`}>
                    Study Book
                </Link>
                <Link to="/books/story" className={`${isActive("/books/story")} pb-1`}>
                    Friction & Story
                </Link>
                <Link to="/books/biography" className={`${isActive("/books/biography")} pb-1`}>
                    Biography
                </Link>
                <Link to="/books/competitive" className={`${isActive("/books/competitive")} pb-1`}>
                    Competitive Edge
                </Link>
                
                
                <Link to="/books/regional" className={`${isActive("/books/regional")} pb-1`}>
                    Regional & Spiritual
                </Link>
                <Link to="/books/comics" className={`${isActive("/books/comics")} pb-1`}>
                    Comics
                </Link>

                <Link to="/books/self-help" className={`${isActive("/books/self-help")} pb-1`}>
                    Self Help
                </Link>
                <Link to="/books/notes" className={`${isActive("/books/notes")} pb-1`}>
                    Notes
                </Link>
                 <Link to="/books/ebooks" className={`${isActive("/books/e-book")} pb-1`}>
                    E-Book
                </Link>
                <Link to="/books/others" className={`${isActive("/books/others")} pb-1`}>
                    Others
                </Link>
            </div>
        </div>
    );
};

export default CategoriesBar;

