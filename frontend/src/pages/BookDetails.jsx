import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart } from "react-icons/fa";
import { GoShareAndroid } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const BookDetails = ({ user, isLoggedIn,  setWishlist, }) => {

   


    //
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [currentImg, setCurrentImg] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);


 const navigate = useNavigate();


 useEffect(() => {
  const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  setBookmarked(storedWishlist.includes(id));
}, [id]);


    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/books/${id}`);
                const data = await response.json();
                if (response.ok) setBook(data);
                else console.error('Failed to fetch book:', data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBook();
    }, [id]);



useEffect(() => {
  if (book && user && user.id) {
    fetch(`http://localhost:3000/api/books/${book._id}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: user.id })
    });
  }
}, [book, user]);








    if (!book) return <div className="p-6">Loading...</div>;


    const handlePrev = () => {
        setCurrentImg((prev) => (prev === 0 ? book.images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImg((prev) => (prev === book.images.length - 1 ? 0 : prev + 1));
    };


    //for booklist 
  





    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/books/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                if (response.ok) {
                    alert('Post deleted successfully');
                    window.location.href = '/'; // Redirect to home or another page
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting post: ${errorData.message}`);
                }
            } catch (err) {
                console.error('Error deleting post:', err);
                alert('Failed to delete post. Please try again later.');
            }
        }

    };


    const handleShare = () => {
        const url = window.location.href;
        const text = `Check out this book: ₹${book.price} - ${book.title} - ${url}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };


    const handlewpShare = () => {


        if (!isLoggedIn) {
            toast.warning("You have to login first!", {
                position: "top-center",
                autoClose: 2000,
            });
            setTimeout(() => {
                navigate("/login");
            }, 1000); // Wait 2 seconds before redirect
            return;
        }
        const url = window.location.href;
        const text = `hi, I am interested in this book:- ${url}`;
        const phone = book.phone;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };
 


   

 

const handleBookmark = async () => {
  if (!isLoggedIn) {
    toast.warning("You have to login first!");
    setTimeout(() => navigate("/login"), 1000);
    return;
  }

  try {
    if (bookmarked) {
      await axios.post("http://localhost:3000/api/wishlist/add", {
        userId: user.id,
        bookId: id,
      });
      setWishlist((prev) => prev.filter((item) => item !== id));
      toast.success("Added to wishlist");
    } else {
      await axios.post("http://localhost:3000/api/wishlist/remove", {
        userId: user.id,
        bookId: id,
      });
      setWishlist((prev) => [...prev, id]);
      toast.success("Removed from wishlist");
    }

    setBookmarked(!bookmarked);
  } catch (err) {
    console.error("Error updating wishlist", err);
    toast.error("Failed to update wishlist");
  }
};








    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Image Slider */}
                <div className="lg:col-span-2 relative">
                    {/* Main Image with slide buttons */}
                    <div className="bg-black h-[400px] flex items-center justify-center relative rounded">
                        <img
                            src={book.images[currentImg]}
                            alt="Current view"
                            className="w-full h-full object-contain"
                            style={{ maxHeight: '400px', maxWidth: '100%' }}
                        />

                        {/* Left Button */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100 transition"
                        >
                            <FaChevronLeft size={20} />
                        </button>

                        {/* Right Button */}
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100 transition"
                        >
                            <FaChevronRight size={20} />
                        </button>

                        {/* Counter */}
                        <div className="absolute bottom-2 right-2 text-white text-sm">
                            {currentImg + 1} / {book.images.length}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                        {book.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Thumbnail ${i}`}
                                className={`w-20 h-20 object-cover border ${currentImg === i ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
                                onClick={() => setCurrentImg(i)}
                            />
                        ))}
                    </div>

                    {/* Description */}
                    <div className="mt-6 bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Description</h2>
                        <p className="text-sm text-gray-700">{book.description}</p>
                    </div>
                </div>

                {/* Right Side Info */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded shadow space-y-2 relative">
                        {/* Top Right Icons */}
                        <div className="absolute top-3 right-3 flex space-x-3 text-gray-600 text-lg">
                            <button onClick={handleShare}>
                                <GoShareAndroid className="text-2xl font-bold hover:bg-cyan-200 rounded-3xl" />
                            </button>
                            <button onClick={handleBookmark}>
                                <FaHeart
                                    className={`text-2xl font-bold cursor-pointer transition-colors duration-300 ${!bookmarked ? "text-red-600" : "text-gray-400 hover:text-red-600"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Book Info */}
                        <h2 className="text-2xl font-bold text-black">₹ {book.price}</h2>
                        <p className="text-md text-gray-700">{book.title}</p>
                        <p className="text-sm text-gray-500">
                            {book.city}, {book.state}
                        </p>
                        <p className="text-xs text-gray-400">
                            Posted on {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <p className="font-semibold">
                            Posted by {(book.user.name || 'Unknown').toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">Member since Jun 2025</p>

                        {/* Check if current logged-in user is the owner */}
                        {user && book.user._id === user.id ? (
                            <>
                                {/* Owner Options */}
                                <div className="mt-3 flex flex-col gap-2">

                                    <div className="flex gap-2">
                                        <Link to={`/edit/${id}`} className="flex-1">
                                            <button className="w-full border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50 transition">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            className="flex-1 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Non-owner option */}

                                <button
                                    onClick={handlewpShare}
                                    className="mt-3 w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out"
                                >
                                    <FaWhatsapp className="text-xl" />
                                    <span className="font-medium">Chat with Seller</span>
                                </button>



                            </>
                        )}
                    </div>


                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold mb-1">Posted in</h3>
                        <p className="text-sm text-gray-600 mb-2">{book.city}, {book.state}, {book.pincode}</p>
                        <iframe
                            src={`https://www.google.com/maps?q=${book.city || 'Pune'}+${book.pincode || '411001'}&z=15&output=embed`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            width="100%"
                            height="200"
                            className="rounded"
                            allowFullScreen
                            loading="lazy"
                            title="Location map"
                        ></iframe>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;


