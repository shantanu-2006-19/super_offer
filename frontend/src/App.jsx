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

          {/* Shop Owner Routes
              NOTE: register-shop and dashboard use plain auth (not shopOwnerOnly)
              so a new shop_owner who has no shop yet can still access them.
              shopOwnerOnly (requires approved shop) is only for offer management. */}
          <Route
            path="/shop-owner/dashboard"
            element={
              <ProtectedRoute>
                <ShopOwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop-owner/register-shop"
            element={
              <ProtectedRoute>
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
          {/* Edit offer reuses AddOffer with an id param */}
          <Route
            path="/shop-owner/edit-offer/:id"
            element={
              <ProtectedRoute shopOwnerOnly>
                <AddOffer />
              </ProtectedRoute>
            }
          />
          {/* Shop profile reuses RegisterShop for editing */}
          <Route
            path="/shop-owner/shop-profile"
            element={
              <ProtectedRoute>
                <RegisterShop />
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
