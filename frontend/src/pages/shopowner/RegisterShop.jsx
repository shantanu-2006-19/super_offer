import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMapPin, FiPhone, FiMail, FiSave } from 'react-icons/fi';
import { shopAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const RegisterShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'retail',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    images: []
  });

  const { name, description, category, phone, address, latitude, longitude, images } = formData;

  const categories = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'retail', label: 'Retail' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'other', label: 'Other' }
  ];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
        },
        (error) => {
          setError('Could not get your location. Please enter manually.');
        }
      );
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!latitude || !longitude) {
      setError('Please set your shop location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await shopAPI.register({
        name,
        description,
        category,
        phone,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        images: images.length > 0 ? images : []
      });
      
      navigate('/shop-owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Register Your Shop
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="label">Shop Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiShoppingBag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="Enter your shop name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="label">Category *</label>
              <select
                id="category"
                name="category"
                required
                value={category}
                onChange={onChange}
                className="input"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={description}
                onChange={onChange}
                className="input"
                placeholder="Describe your shop"
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">Phone Number *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="label">Address *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={address}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="Enter shop address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="label">Latitude *</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  value={latitude}
                  onChange={onChange}
                  className="input"
                  placeholder="e.g., 40.7128"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="label">Longitude *</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  value={longitude}
                  onChange={onChange}
                  className="input"
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLocationDetect}
              className="btn btn-outline w-full"
            >
              <FiMapPin className="mr-2" />
              Detect My Location
            </button>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiSave className="h-5 w-5" />
                    <span>Submit for Approval</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterShop;

