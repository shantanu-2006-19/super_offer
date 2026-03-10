import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FiMapPin, FiFilter, FiX, FiNavigation } from 'react-icons/fi';
import { offerAPI, shopAPI } from '../services/api';
import OfferGrid from '../components/offer/OfferGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const NearbyOffers = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [distance, setDistance] = useState(10);
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [showFilters, setShowFilters] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'retail', label: 'Retail' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'pharmacy', label: 'Pharmacy' }
  ];

  const distances = [
    { value: 1, label: '1 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' }
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          fetchNearbyShops(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Use default location if permission denied
          setLocation(defaultCenter);
          fetchNearbyShops(defaultCenter.lat, defaultCenter.lng);
        }
      );
    } else {
      setLocation(defaultCenter);
      fetchNearbyShops(defaultCenter.lat, defaultCenter.lng);
    }
  }, []);

  const fetchNearbyShops = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await shopAPI.getNearby({
        latitude: lat,
        longitude: lng,
        distance: distance,
        category
      });
      setShops(response.data.data);
      
      // Extract offers from shops
      const allOffers = response.data.data.flatMap(shop => 
        (shop.offers || []).map(offer => ({
          ...offer,
          shop: {
            _id: shop._id,
            name: shop.name,
            category: shop.category,
            address: shop.address
          }
        }))
      );
      setOffers(allOffers);
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLocation);
          fetchNearbyShops(newLocation.lat, newLocation.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleDistanceChange = (newDistance) => {
    setDistance(newDistance);
    if (location) {
      fetchNearbyShops(location.lat, location.lng);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (location) {
      fetchNearbyShops(location.lat, location.lng);
    }
  };

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLocation({ lat, lng });
    fetchNearbyShops(lat, lng);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar - Filters & List */}
        <div className="w-full lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col h-[50vh] lg:h-[calc(100vh-64px)]">
          {/* Header */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Nearby Offers
              </h1>
              <button
                onClick={handleLocationDetect}
                className="btn btn-outline flex items-center space-x-2"
              >
                <FiNavigation className="h-4 w-4" />
                <span>My Location</span>
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div>
                <label className="label">Distance</label>
                <select
                  value={distance}
                  onChange={(e) => handleDistanceChange(Number(e.target.value))}
                  className="input"
                >
                  {distances.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="input"
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Offers List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-8">
                <FiMapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No offers found in this area
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map(offer => (
                  <div
                    key={offer._id}
                    className="card p-4 cursor-pointer hover:ring-2 hover:ring-primary-500"
                    onClick={() => setSelectedShop(offer.shop)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-primary-600 font-medium">
                        {offer.shop?.name}
                      </span>
                      <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs font-medium">
                        {offer.discountPercentage}% OFF
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {offer.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary-600">
                          ${offer.offerPrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${offer.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="w-full lg:w-2/3 xl:w-3/4 h-[50vh] lg:h-[calc(100vh-64px)]">
          {loadError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Error loading map
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : !isLoaded ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location || defaultCenter}
              zoom={13}
              onClick={onMapClick}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false
              }}
            >
              {/* User Location Marker */}
              {location && (
                <Marker
                  position={location}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2
                  }}
                />
              )}

              {/* Shop Markers */}
              {shops.map(shop => (
                <Marker
                  key={shop._id}
                  position={{
                    lat: shop.location.coordinates[1],
                    lng: shop.location.coordinates[0]
                  }}
                  onClick={() => setSelectedShop(shop)}
                />
              ))}

              {/* Info Window */}
              {selectedShop && (
                <InfoWindow
                  position={{
                    lat: selectedShop.location?.coordinates[1] || selectedShop.lat,
                    lng: selectedShop.location?.coordinates[0] || selectedShop.lng
                  }}
                  onCloseClick={() => setSelectedShop(null)}
                >
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-gray-900">{selectedShop.name}</h3>
                    <p className="text-sm text-gray-600">{selectedShop.address}</p>
                    {selectedShop.offers && selectedShop.offers.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm font-medium text-primary-600">
                          {selectedShop.offers.length} active offer(s)
                        </p>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NearbyOffers;

