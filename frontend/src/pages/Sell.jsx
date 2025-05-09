import { useState, useRef } from 'react';
import axios from 'axios';
import { TbCameraUp } from "react-icons/tb";
import { useEffect } from 'react';

const Sell = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState([]);
  const [showError, setShowError] = useState(false);
  const fileInputRef = useRef(null);
  

  // Assuming user name is passed from context/auth (replace 'Alex' accordingly)
  const userName = user?.name || 'Guest'; // fallback to 'Guest' if not logged in
  const userInitial = userName.split(' ')
    .slice(0, 2) // take first and last name
    .map(name => name.charAt(0).toUpperCase())
    .join('');




  // Handle photo upload
  // Handle photo upload

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && images.length < 3) {
      setImages([...images, file]);
      setShowError(false);
    }
  };


//user location detection
  //user location detection
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.address.city || data.display_name);
          } catch (error) {
            console.error("Failed to fetch location details:", error);
          }
        },
        (error) => {
          console.error("Location detection failed:", error.message);
        }
      );
    }
  }, []);
  




  // Handle form submission
  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('phone', phone);
    images.forEach((img) => formData.append('images', img));

    try {
      await axios.post('/books', formData);
      alert('Book ad posted!');
    } catch (err) {
      console.error(err);
      alert('Error posting book');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
  <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Post Your Ad</h2>

  <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-0">

    {/* Title & Description */}
    <div className="bg-white border-2 shadow border-gray-400 rounded-t-md p-5">
      <h3 className="font-semibold text-lg text-gray-700 mb-4">Include Some Details</h3>

      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
        Ad Title*
      </label>
      <input
        id="title"
        type="text"
        placeholder="Enter ad title"
        value={title}
        maxLength={20}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded"
      />
      <div className="w-full text-right">
        <span className='text-gray-500 text-xs mr-7'>Mention the key features of your item (e.g. brand, model, age, type)</span>
        <span className="text-gray-500 text-xs">({title.length}/20)</span>
      </div>

      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
        Description
      </label>
      <textarea
        id="description"
        placeholder="Describe what you're selling"
        value={description}
        maxLength={500}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded resize-none"
        rows={4}
      />
      <div className="w-full text-right">
        <span className='text-gray-500 text-xs mr-7'>Include condition, features and reason for selling</span>
        <span className="text-gray-500 text-xs">({description.length}/500)</span>
      </div>
    </div>

    {/* Price */}
    <div className="bg-white border-2 shadow border-gray-400  p-5">
      <h3 className="font-semibold text-lg text-gray-700 mb-4">Set A Price</h3>
      <label htmlFor='price' className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
      <input
        type="number"
        id='price'
        placeholder="₹ Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-3/5 p-3 border border-gray-300 rounded"
      />
    </div>

    {/* Upload Photos */}
    <div className="bg-white border-2 shadow border-gray-400 p-5">
      <h3 className="font-bold text-lg text-gray-800 mb-4">UPLOAD UP TO 3 PHOTOS</h3>
      <div className="grid grid-cols-3 gap-4 mb-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`w-full h-32 border-2 ${index === 0 ? 'border-black' : 'border-gray-300'
              } rounded flex items-center justify-center text-gray-500 cursor-pointer relative`}
            onClick={() => index === 0 && fileInputRef.current.click()}
          >
            {images[index] ? (
              <img
                src={URL.createObjectURL(images[index])}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="flex flex-col items-center text-sm">
                <TbCameraUp className="w-6 h-6 mb-1" />
                {index === 0 && <span>Add Photo</span>}
              </div>
            )}
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
        disabled={images.length >= 3}
      />
      <div className="w-full text-left mt-1"><samp className="text-sm text-red-500 ml-5 mt-3">This field is mandatory</samp></div>
    </div>

    {/* Location */}
    <div className="bg-white border-2 shadow border-gray-400 p-5">
      <h3 className="font-semibold text-lg text-gray-700 mb-4">Confirm Your Location</h3>
      <input
        type="text"
        placeholder="Enter city or area"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded"
      />
      <div className="w-full text-left"><samp className="text-sm text-red-500 ml-5 mt-3">This field is mandatory</samp></div>
      
    </div>

    {/* Review Your Details */}
    <div className="bg-white border-2 shadow border-gray-400 p-5">
      <h3 className="font-bold text-lg text-gray-800 mb-4">REVIEW YOUR DETAILS</h3>

      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
          <span className="text-xl font-semibold text-gray-600">
            {userInitial}
          </span>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={user?.name || ''}
            readOnly
            className="w-32 mt-1 p-2 border border-gray-300 rounded"
            maxLength={30}
          />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-700 mb-1">Let's verify your account</h4>
        <p className="text-sm text-gray-600">We will send you a confirmation code by SMS on the next step.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone Number *</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 rounded-l-md text-sm">
            +91
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-r-md"
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <div className="text-center pt-4">
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded shadow"
      >
        Post Now
      </button>
    </div>
  </form>
</div>

  );
};

export default Sell;


