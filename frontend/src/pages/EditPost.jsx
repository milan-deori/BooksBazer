import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TbCameraUp } from 'react-icons/tb';
import 'react-toastify/dist/ReactToastify.css';

const EditPost = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [images, setImages] = useState([null, null, null]);
  const [existingImageURLs, setExistingImageURLs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const userName = user?.name || 'Guest';
  const userInitial = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');

  // Fetch post details on mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/books/${id}`);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setPhone(data.phone);
        setState(data.state);
        setCity(data.city);
        setPincode(data.pincode);
        setExistingImageURLs(data.imageUrls || []);
      } catch (err) {
        toast.error('Failed to load post details.');
      }
    };
    fetchPost();
  }, [id]);

  const handlePhotoUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    // Remove corresponding existing image if new one is uploaded
    const updatedURLs = [...existingImageURLs];
    updatedURLs[index] = null;
    setExistingImageURLs(updatedURLs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to edit the ad.');
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

      images.forEach((img, i) => {
        if (img) {
          formData.append('images', img);
        } else if (existingImageURLs[i]) {
          formData.append('existingImageUrls', existingImageURLs[i]);
        }
      });

      await axios.put(`http://localhost:3000/api/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }

      });

      toast.success('Post updated successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update the post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Your Ad</h2>

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
          <div className="w-full text-right text-xs text-gray-500">
            <span className="mr-7">Mention key features</span>({title.length}/30)
          </div>

          <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
          <textarea
            placeholder="Describe what you're selling"
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded resize-none"
            rows={4}
          />
          <div className="w-full text-right text-xs text-gray-500">
            <span className="mr-7">Include condition, reason for selling</span>({description.length}/500)
          </div>
        </div>

        {/* Upload Photos */}
        <div className="bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">UPLOAD UP TO 3 PHOTOS</h3>
          <div className="grid grid-cols-3 gap-4 mb-2">
            {[0, 1, 2].map((index) => {
              const hasNewImage = !!images[index];
              const existingURL = existingImageURLs[index];
              const isDisabled = index > 0 && !(images[index - 1] || existingImageURLs[index - 1]);

              return (
                <div
                  key={index}
                  className={`w-48 h-32 border-2 rounded flex items-center justify-center text-gray-500 relative 
                    ${hasNewImage || existingURL ? 'border-gray-800' : 'border-gray-300'} 
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
                    {hasNewImage ? (
                      <img
                        src={URL.createObjectURL(images[index])}
                        alt={`Uploaded ${index + 1}`}
                        className="absolute inset-0 w-48 h-full object-cover rounded"
                      />
                    ) : existingURL ? (
                      <img
                        src={existingURL}
                        alt={`Existing ${index + 1}`}
                        className="absolute inset-0 w-48 h-full object-cover rounded"
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
          <span className="text-sm text-red-500 ml-3">You can replace existing photos</span>
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

        {/* Location */}
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
          <label className="block text-sm font-medium text-gray-700 mt-4">Pincode *</label>
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

        {/* Submit */}
        <div className="bg-white border-2 shadow border-gray-400 p-5 rounded-b-md">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-semibold"
          >
            {isSubmitting ? 'Updating...' : 'Update Ad'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
