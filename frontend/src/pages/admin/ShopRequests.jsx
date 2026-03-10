import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const ShopRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getShopRequests({ status: filter });
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId) => {
    try {
      await adminAPI.approveShop(shopId);
      setRequests(requests.filter(r => r._id !== shopId));
    } catch (error) {
      console.error('Error approving shop:', error);
    }
  };

  const handleReject = async (shopId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    
    try {
      await adminAPI.rejectShop(shopId, reason);
      setRequests(requests.filter(r => r._id !== shopId));
    } catch (error) {
      console.error('Error rejecting shop:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Shop Requests
          </h1>
          
          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {['pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500">No {filter} shop requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(shop => (
              <div key={shop._id} className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {shop.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shop.status === 'approved' ? 'bg-green-100 text-green-800' :
                        shop.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {shop.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {shop.description || 'No description provided'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <FiMapPin className="mr-2" />
                        {shop.address}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FiPhone className="mr-2" />
                        {shop.phone}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FiMail className="mr-2" />
                        {shop.owner?.email}
                      </div>
                      <div className="text-gray-500">
                        <span className="capitalize">{shop.category}</span>
                      </div>
                    </div>

                    {shop.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Rejection reason: {shop.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {shop.status === 'pending' && (
                    <div className="flex space-x-2 mt-4 lg:mt-0 lg:ml-4">
                      <button
                        onClick={() => handleApprove(shop._id)}
                        className="btn btn-primary flex items-center space-x-2"
                      >
                        <FiCheck className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(shop._id)}
                        className="btn bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2"
                      >
                        <FiX className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopRequests;

