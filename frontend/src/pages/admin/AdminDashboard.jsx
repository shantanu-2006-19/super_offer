import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiTag, FiCheck, FiClock, FiTrendingUp } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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

  const stats = [
    {
      label: 'Total Users',
      value: analytics?.users?.total || 0,
      icon: FiUsers,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Shops',
      value: analytics?.shops?.total || 0,
      icon: FiShoppingBag,
      color: 'bg-green-500'
    },
    {
      label: 'Active Offers',
      value: analytics?.offers?.active || 0,
      icon: FiTag,
      color: 'bg-purple-500'
    },
    {
      label: 'Pending Approvals',
      value: analytics?.shops?.pending || 0,
      icon: FiClock,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/shop-requests"
            className="card p-6 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Shop Requests
                </h3>
                <p className="text-sm text-gray-500">
                  {analytics?.shops?.pending || 0} pending approval
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="card p-6 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Manage Users
                </h3>
                <p className="text-sm text-gray-500">
                  View and manage users
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/offers"
            className="card p-6 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <FiTag className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Manage Offers
                </h3>
                <p className="text-sm text-gray-500">
                  {analytics?.offers?.total || 0} total offers
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Shops */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Shop Registrations
            </h2>
            {analytics?.recentShops && analytics.recentShops.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentShops.map(shop => (
                  <div key={shop._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {shop.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {shop.owner?.name}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shop.status === 'approved' ? 'bg-green-100 text-green-800' :
                      shop.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {shop.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent shop registrations</p>
            )}
          </div>

          {/* Recent Offers */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Offers
            </h2>
            {analytics?.recentOffers && analytics.recentOffers.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentOffers.map(offer => (
                  <div key={offer._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {offer.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {offer.shop?.name}
                      </p>
                    </div>
                    <span className="text-primary-600 font-medium">
                      {offer.discountPercentage}% OFF
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent offers</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

