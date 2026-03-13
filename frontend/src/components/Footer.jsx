import { Link } from 'react-router-dom';
import { FiMapPin, FiMail, FiPhone, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FiMapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Super Offer</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Discover the best nearby deals from local shops. Save money while supporting your community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/nearby" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Nearby Offers
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FiMail className="h-4 w-4" />
                <span>shantanu.chavre24@vit.edu</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="h-4 w-4" />
                <span>+91 9021325026</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMapPin className="h-4 w-4" />
                <span>Bibevadi pune</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Super Offer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

