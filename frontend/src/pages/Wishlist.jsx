import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// assuming you use a reusable card

const Wishlist = ({ user}) => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
 

  /*useEffect(() => {
    const fetchWishlistBooks = async () => {
      try {
        const { data } = await axios.post("http://localhost:3000/api/wishlist", { ids: wishlist });
        setWishlistBooks(data); // Ensure your backend sends an array
      } catch (error) {
        console.error("Error fetching wishlist books:", error);
        setWishlistBooks([]); // fallback to empty array on error
      }
    };

    if (wishlist && wishlist.length > 0) {
      fetchWishlistBooks();
    } else {
      setWishlistBooks([]); // explicitly set empty array if no wishlist
    }
  }, [wishlist]);*/
  // Wishlist.jsx
useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/wishlist/${user.id}`);
      setWishlistBooks(res.data); // fixed the typo here
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setWishlistBooks([]); // fallback
    }
  };

  if (user?.id) fetchWishlist();
}, [user]);



  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistBooks.length === 0 ? (
          <p className="text-gray-600">No books in your wishlist.</p>
        ) : (
          wishlistBooks.map((book) => (
            <Link to={`/book/${book._id}`} key={book._id}>
              <div key={book._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200">
              <img src={book.images[0]} alt={book.title} className="w-full h-48 object-cover rounded-t-md mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
              <p className="text-gray-600">₹ {book.price}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(book.createdAt).toLocaleDateString()}</p>
            </div>
            </Link>
            
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;

// Wishlist.jsx
// Wishlist.jsx 
