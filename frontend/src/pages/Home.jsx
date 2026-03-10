import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiArrowRight, FiTag, FiShield, FiClock } from 'react-icons/fi';
import { offerAPI } from '../services/api';
import OfferGrid from '../components/offer/OfferGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offerAPI.getAll({ limit: 8 });
      setOffers(response.data.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Nearby Deals
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Find the best offers from local shops in your area. Save money while supporting your community.
            </p>
            
            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row shadow-xl">
                <div className="flex-1 flex items-center px-4 mb-2 md:mb-0">
                  <FiMapPin className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="flex-1 text-gray-700 outline-none"
                  />
                </div>
                <Link
                  to="/nearby"
                  className="btn btn-primary flex items-center justify-center space-x-2 md:px-8"
                >
                  <FiSearch />
                  <span>Find Offers</span>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-primary-200">Local Shops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-primary-200">Active Offers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-primary-200">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Choose Super Offer?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nearby Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find deals from shops right in your neighborhood using our advanced map technology.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTag className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Discounts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get access to exclusive offers and deals you won't find anywhere else.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Offers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All offers are verified and approved to ensure authenticity and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Offers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latest Offers
            </h2>
            <Link
              to="/nearby"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View All</span>
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <OfferGrid offers={offers} loading={loading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are You a Local Shop Owner?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join Super Offer and reach more customers with your deals and promotions.
          </p>
          <Link
            to="/register"
            className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

