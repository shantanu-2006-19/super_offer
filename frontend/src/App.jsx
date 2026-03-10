import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NearbyOffers from './pages/NearbyOffers';
import OfferDetails from './pages/OfferDetails';

// User Pages
import UserDashboard from './pages/user/UserDashboard';

// Shop Owner Pages
import ShopOwnerDashboard from './pages/shopowner/ShopOwnerDashboard';
import RegisterShop from './pages/shopowner/RegisterShop';
import ManageOffers from './pages/shopowner/ManageOffers';
import AddOffer from './pages/shopowner/AddOffer';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ShopRequests from './pages/admin/ShopRequests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/nearby" element={<NearbyOffers />} />
          <Route path="/offers/:id" element={<OfferDetails />} />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shop Owner Routes */}
          <Route
            path="/shop-owner/dashboard"
            element={
              <ProtectedRoute shopOwnerOnly>
                <ShopOwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop-owner/register-shop"
            element={
              <ProtectedRoute shopOwnerOnly>
                <RegisterShop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop-owner/manage-offers"
            element={
              <ProtectedRoute shopOwnerOnly>
                <ManageOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop-owner/add-offer"
            element={
              <ProtectedRoute shopOwnerOnly>
                <AddOffer />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shop-requests"
            element={
              <ProtectedRoute adminOnly>
                <ShopRequests />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

