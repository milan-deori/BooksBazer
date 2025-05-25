import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TbCameraUp } from 'react-icons/tb';
import { useEffect } from 'react';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

const Sell = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [images, setImages] = useState([null, null, null]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const userName = user?.name || 'Guest';
  const userInitial = userName
    .split(' ')
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join('');

  const handlePhotoUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  //user location detection
 useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          console.log("Location details:", data);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please log in to post an ad.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('phone', phone);
      formData.append('state', state);
      formData.append('city', city);
      formData.append('pincode', pincode);
      formData.append('userId', user._id);
      formData.append('userName', user.name);
      formData.append('userEmail', user.email);

       if (latitude && longitude) {
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
    }

      images.forEach((img) => {
        if (img) formData.append('images', img);
      });

      await axios.post('http://localhost:3000/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Book ad posted successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to post the ad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Post Your Ad</h2>

      <form onSubmit={handleSubmit} className="space-y-0">
        {/* Title & Description */}
        <div className="bg-white border-2 shadow border-gray-400 rounded-t-md p-5">
          <h3 className="font-semibold text-lg text-gray-700 mb-4">Include Some Details</h3>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title*</label>
          <input
            type="text"
            placeholder="Enter ad title"
            value={title}
            maxLength={30}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          <div className="w-full text-right">
            <span className="text-gray-500 text-xs mr-7">Mention the key features</span>
            <span className="text-gray-500 text-xs">({title.length}/30)</span>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Description</label>
          <textarea
            placeholder="Describe what you're selling"
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded resize-none"
            rows={4}
          />
          <div className="w-full text-right">
            <span className="text-gray-500 text-xs mr-7">Include condition and reason for selling</span>
            <span className="text-gray-500 text-xs">({description.length}/500)</span>
          </div>
        </div>

        {/* Upload Photos */}
        <div className="bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">UPLOAD UP TO 3 PHOTOS</h3>
          <div className="grid grid-cols-3 gap-4 mb-2">
            {[0, 1, 2].map((index) => {
              const isDisabled = index > 0 && !images[index - 1];
              const hasImage = !!images[index];
              return (
                <div
                  key={index}
                  className={`w-48 h-32 border-2 rounded flex items-center justify-center text-gray-500 relative 
                    ${hasImage ? 'border-gray-800' : 'border-gray-300'} 
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <label htmlFor={`photo-${index}`} className="absolute inset-0 flex items-center justify-center cursor-pointer">
                    {!isDisabled && (
                      <input
                        id={`photo-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, index)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    )}
                    {hasImage ? (
                      <img
                        src={URL.createObjectURL(images[index])}
                        alt={`Uploaded ${index + 1}`}
                        className="absolute inset-0 w-48 h-full object-fill rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-sm z-10">
                        <TbCameraUp className="w-6 h-6 mb-1" />
                        <span>{index === 0 || !isDisabled ? 'Add Photo' : 'Upload Previous First'}</span>
                      </div>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
          <div className="w-full text-left">
            <span className="text-sm text-red-500 ml-3">This field is mandatory</span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-semibold text-lg text-gray-700 mb-4">Set A Price</h3>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            placeholder="₹ Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-3/5 p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Location Details */}
        <div className="bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Location Details</h3>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <input
            type="text"
            placeholder="Enter State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Pincode *</label>
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength={6}
            pattern="[1-9]{1}[0-9]{5}"
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Review Details */}
        <div className="bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">REVIEW YOUR DETAILS</h3>
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
              <span className="text-xl font-semibold text-gray-600">{userInitial}</span>
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
            <h4 className="text-md font-semibold text-gray-700 mb-1">Mobile Number</h4>
            <input
              type="tel"
              pattern="[6-9]{1}[0-9]{9}"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4 pb-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${isSubmitting && 'opacity-50 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Ad'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;










// Note: Make sure to handle the file upload and form submission properly in your backend.
// You may need to adjust the API endpoint and the way you handle the form data based on your backend implementation.