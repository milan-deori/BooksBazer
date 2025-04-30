import React, { useEffect, useState } from 'react';


const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
      // Adjust if your backend is hosted separately
      
  }, []);

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Books</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map(book => (
          <div key={book._id} className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition">
            <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover rounded-md mb-3" />
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <p className="text-md font-bold mt-2">₹{book.price}</p>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
