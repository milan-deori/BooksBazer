import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [currentImg, setCurrentImg] = useState(0);

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

    if (!book) return <div className="p-6">Loading...</div>;

    const handlePrev = () => {
        setCurrentImg((prev) => (prev === 0 ? book.images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImg((prev) => (prev === book.images.length - 1 ? 0 : prev + 1));
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
                    <div className="bg-white p-4 rounded shadow space-y-2">
                        <h2 className="text-2xl font-bold text-black">₹ {book.price}</h2>
                        <p className="text-md text-gray-700">{book.title}</p>
                        <p className="text-sm text-gray-500">{book.city}, {book.state} </p>
                        <p className="text-xs text-gray-400">Posted on {new Date(book.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <p className="font-semibold">Posted by {(book.user.name || 'Unknown').toUpperCase()}</p>
                        <p className="text-sm text-gray-500">Member since Jun 2024</p>
                        <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                            Chat with seller
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold mb-1">Posted in</h3>
                        <p className="text-sm text-gray-600 mb-2">{book.city}, {book.state}, {book.pincode}</p>
                        <iframe
                            src={`https://www.google.com/maps?q=${book.latitude || 18.548},${book.longitude || 73.935}&z=15&output=embed`}
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


