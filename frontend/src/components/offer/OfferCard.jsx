import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiTag, FiArrowRight } from 'react-icons/fi';

const OfferCard = ({ offer }) => {
  const {
    _id,
    title,
    description,
    discountPercentage,
    originalPrice,
    offerPrice,
    expiryDate,
    images,
    shop
  } = offer;

  const savings = originalPrice - offerPrice;
  const isExpired = new Date(expiryDate) < new Date();
  const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <FiTag className="h-16 w-16 text-primary-300" />
          </div>
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {discountPercentage}% OFF
        </div>

        {/* Expiry Badge */}
        {isExpired ? (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            Expired
          </div>
        ) : daysLeft <= 3 ? (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
            {daysLeft} days left
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Shop Info */}
        {shop && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <FiMapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{shop.name}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${offerPrice.toFixed(2)}
          </span>
          <span className="text-lg text-gray-400 line-through">
            ${originalPrice.toFixed(2)}
          </span>
          <span className="text-sm text-green-600 font-medium">
            Save ${savings.toFixed(2)}
          </span>
        </div>

        {/* Expiry */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <FiCalendar className="h-4 w-4 mr-1" />
          <span>Expires: {new Date(expiryDate).toLocaleDateString()}</span>
        </div>

        {/* CTA */}
        <Link
          to={`/offers/${_id}`}
          className="btn btn-primary w-full flex items-center justify-center space-x-2"
        >
          <span>View Offer</span>
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default OfferCard;

