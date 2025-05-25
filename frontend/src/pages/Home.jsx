import React, { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/books');
        const data = await response.json();
        if (response.ok) setBooks(data);
        else console.error('Failed to fetch books:', data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Featured Ads</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {books.map((book) => (
          <Link to={`/book/${book._id}`} key={book._id}>
          <div key={book._id} className="relative bg-white rounded-md shadow hover:shadow-lg transition duration-200">
            {/* Heart Icon */}
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
              <FaRegHeart size={20} />
            </button>

            {/* Image */}
            <div className="w-full h-60 bg-gray-200 overflow-hidden rounded-t-md ">
              <img
                src={book.images[0]} // 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-1">
              <h2 className="text-lg font-semibold text-black">₹ {book.price}</h2>
              <p className="text-sm font-medium text-gray-700 truncate">{book.title}</p>
              <p className="text-xs text-gray-500">{book.city}, {book.state}</p>
              <p className="text-xs text-gray-400">{formatDate(book.createdAt)}</p>
            </div>
          </div>
          </Link>
        
        ))}
      </div>
    </div>
  );
};

export default Home;


