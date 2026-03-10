import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiTag, FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';
import { offerAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OfferDetails = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      const response = await offerAPI.getById(id);
      setOffer(response.data.data);
    } catch (error) {
      console.error('Error fetching offer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Offer Not Found
            </h2>
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { title, description, discountPercentage, originalPrice, offerPrice, expiryDate, images, shop } = offer;
  const savings = originalPrice - offerPrice;
  const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/nearby"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to Offers</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="card overflow-hidden">
              {images && images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <FiTag className="h-24 w-24 text-primary-300" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Shop Info */}
              {shop && (
                <Link
                  to={`/shops/${shop._id}`}
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <FiMapPin className="h-5 w-5" />
                  <span className="font-medium">{shop.name}</span>
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>

              {/* Discount Badge */}
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full">
                <FiTag className="h-5 w-5" />
                <span className="text-xl font-bold">{discountPercentage}% OFF</span>
              </div>

              {/* Description */}
              {description && (
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {description}
                </p>
              )}

              {/* Price */}
              <div className="card p-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-primary-600">
                    ${offerPrice.toFixed(2)}
                  </span>
                  <div>
                    <span className="text-xl text-gray-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <p className="text-green-600 font-medium">
                      Save ${savings.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expiry */}
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <FiCalendar className="h-6 w-6" />
                <div>
                  <p className="font-medium">Expires: {new Date(expiryDate).toLocaleDateString()}</p>
                  {daysLeft > 0 ? (
                    <p className="text-sm">{daysLeft} days remaining</p>
                  ) : (
                    <p className="text-sm text-red-500">This offer has expired</p>
                  )}
                </div>
              </div>

              {/* Shop Details */}
              {shop && (
                <div className="card p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Shop Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="text-gray-400" />
                      <span>{shop.address}</span>
                    </div>
                    {shop.phone && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Phone:</span>
                        <span>{shop.phone}</span>
                      </div>
                    )}
                    {shop.category && (
                      <div className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                        {shop.category}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                <button className="btn btn-primary flex-1">
                  Get Offer
                </button>
                <button className="btn btn-outline">
                  <FiShare2 className="h-5 w-5" />
                </button>
                <button className="btn btn-outline">
                  <FiHeart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OfferDetails;

