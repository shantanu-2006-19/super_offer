import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiShoppingBag, FiBookmark, FiSettings } from 'react-icons/fi';
import { offerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import OfferGrid from '../../components/offer/OfferGrid';
import Navbar from '../../components/Navbar';

const UserDashboard = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offerAPI.getAll({ limit: 12 });
      setOffers(response.data.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="card p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover the best deals from local shops near you.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/nearby"
            className="card p-6 flex items-center space-x-4 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <FiMapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Find Nearby Offers</h3>
              <p className="text-sm text-gray-500">Discover deals in your area</p>
            </div>
          </Link>

          <Link
            to="/user/saved"
            className="card p-6 flex items-center space-x-4 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center">
              <FiBookmark className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Saved Offers</h3>
              <p className="text-sm text-gray-500">View your saved deals</p>
            </div>
          </Link>

          <Link
            to="/user/settings"
            className="card p-6 flex items-center space-x-4 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <FiSettings className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </Link>
        </div>

        {/* Latest Offers */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Latest Offers
          </h2>
          <OfferGrid offers={offers} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

