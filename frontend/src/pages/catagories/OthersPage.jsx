import React, { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OthersPage = () => {
 const [books, setBooks] = useState([]);
   
     useEffect(() => {
       const fetchStoryBooks = async () => {
         try {
           const response = await fetch('http://localhost:3000/api/books');
           const data = await response.json();
           if (response.ok) {
             // Filter by category and sort by newest
             const filtered = data.filter(book => book.category === 'Others').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
             setBooks(filtered);
           } else {
             console.error('Failed to fetch books:', data);
           }
         } catch (error) {
           console.error('Error fetching books:', error);
         }
       };
   
       fetchStoryBooks();
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
         <h1 className="text-3xl font-bold mb-6">Biography Books</h1>
   
         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
           {books.map((book) => (
             <Link to={`/book/${book._id}`} key={book._id}>
               <div className="relative bg-white rounded-md shadow hover:shadow-lg transition duration-200">
                 <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                   <FaRegHeart size={20} />
                 </button>
   
                 <div className="w-full h-60 bg-gray-200 overflow-hidden rounded-t-md">
                   <img
                     src={book.images[0]}
                     alt={book.title}
                     className="w-full h-full object-cover"
                   />
                 </div>
   
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

export default OthersPage