import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTag, FiPlus, FiEdit, FiTrash2, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { shopAPI, offerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const ShopOwnerDashboard = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await shopAPI.getMyShop();
      setShop(response.data.data.shop);
      setOffers(response.data.data.offers || []);
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      await offerAPI.delete(offerId);
      setOffers(offers.filter(o => o._id !== offerId));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // If no shop, show registration prompt
  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Register Your Shop
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You haven't registered your shop yet. Create your shop to start publishing offers and attracting customers.
            </p>
            <Link
              to="/shop-owner/register-shop"
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <FiPlus className="h-5 w-5" />
              <span>Register Shop</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPending = shop.status === 'pending';
  const isRejected = shop.status === 'rejected';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Status Banner */}
        {isPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <FiClock className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Your shop is pending approval</p>
              <p className="text-sm text-yellow-600">Please wait while our team reviews your shop registration.</p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <FiX className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Your shop was rejected</p>
              <p className="text-sm text-red-600">Reason: {shop.rejectionReason || 'Does not meet our requirements'}</p>
              <Link to="/shop-owner/register-shop" className="text-sm text-red-700 underline">
                Update and resubmit
              </Link>
            </div>
          </div>
        )}

        {/* Shop Info */}
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {shop.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <FiShoppingBag className="mr-1" />
                  {shop.category}
                </span>
                <span className="flex items-center">
                  {shop.address}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {shop.status === 'approved' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <FiCheck className="mr-1" />
                  Approved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/shop-owner/add-offer"
            className="card p-6 flex items-center space-x-4 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <FiPlus className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Add New Offer</h3>
              <p className="text-sm text-gray-500">Create a new deal for customers</p>
            </div>
          </Link>

          <Link
            to="/shop-owner/shop-profile"
            className="card p-6 flex items-center space-x-4 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center">
              <FiEdit className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Edit Shop Profile</h3>
              <p className="text-sm text-gray-500">Update your shop information</p>
            </div>
          </Link>
        </div>

        {/* Offers */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Offers
            </h2>
            <span className="text-sm text-gray-500">
              {offers.length} offer(s)
            </span>
          </div>

          {offers.length === 0 ? (
            <div className="card p-12 text-center">
              <FiTag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">You haven't created any offers yet</p>
              <Link to="/shop-owner/add-offer" className="btn btn-primary">
                Create Your First Offer
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map(offer => (
                <div key={offer._id} className="card p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {offer.title}
                      </h3>
                      <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs font-medium">
                        {offer.discountPercentage}% OFF
                      </span>
                      {!offer.isActive && (
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ${offer.offerPrice} (was ${offer.originalPrice}) • 
                      Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/shop-owner/edit-offer/${offer._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <FiEdit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteOffer(offer._id)}
                      className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;

