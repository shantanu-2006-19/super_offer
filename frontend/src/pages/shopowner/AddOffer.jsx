import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTag, FiDollarSign, FiCalendar, FiSave } from 'react-icons/fi';
import { offerAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const AddOffer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    originalPrice: '',
    offerPrice: '',
    expiryDate: '',
    images: []
  });

  const { title, description, discountPercentage, originalPrice, offerPrice, expiryDate } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');

    // Auto-calculate offer price based on discount
    if (e.target.name === 'originalPrice' || e.target.name === 'discountPercentage') {
      const price = e.target.name === 'originalPrice' 
        ? parseFloat(e.target.value) 
        : parseFloat(formData.originalPrice);
      const discount = e.target.name === 'discountPercentage' 
        ? parseFloat(e.target.value) 
        : parseFloat(formData.discountPercentage);
      
      if (price && discount) {
        const offerPrice = price - (price * discount / 100);
        setFormData(prev => ({
          ...prev,
          offerPrice: offerPrice.toFixed(2)
        }));
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await offerAPI.create({
        title,
        description,
        discountPercentage: parseFloat(discountPercentage),
        originalPrice: parseFloat(originalPrice),
        offerPrice: parseFloat(offerPrice),
        expiryDate,
        images: []
      });
      
      navigate('/shop-owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create New Offer
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="label">Offer Title *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="e.g., 50% Off Lunch Combo"
                />
              </div>
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
                placeholder="Describe your offer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="originalPrice" className="label">Original Price ($) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={originalPrice}
                    onChange={onChange}
                    className="input pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="discountPercentage" className="label">Discount (%) *</label>
                <input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={discountPercentage}
                  onChange={onChange}
                  className="input"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="offerPrice" className="label">Offer Price ($) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="offerPrice"
                    name="offerPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={offerPrice}
                    onChange={onChange}
                    className="input pl-10 bg-gray-100"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expiryDate" className="label">Expiry Date *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    min={minDateStr}
                    required
                    value={expiryDate}
                    onChange={onChange}
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

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
                    <span>Create Offer</span>
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

export default AddOffer;

