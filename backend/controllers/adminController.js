import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Offer from '../models/Offer.js';

// @desc    Get pending shop requests
// @route   GET /api/admin/shop-requests
// @access  Admin
export const getShopRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    } else {
      query.status = 'pending';
    }

    const shops = await Shop.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Shop.countDocuments(query);

    res.json({
      success: true,
      data: shops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve shop
// @route   PUT /api/admin/approve-shop/:id
// @access  Admin
export const approveShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (shop.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Shop is not in pending status'
      });
    }

    shop.status = 'approved';
    await shop.save();

    // Update user role to shop_owner if not already
    const user = await User.findById(shop.owner);
    if (user && user.role === 'user') {
      user.role = 'shop_owner';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Shop approved successfully',
      data: shop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject shop
// @route   PUT /api/admin/reject-shop/:id
// @access  Admin
export const rejectShop = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (shop.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Shop is not in pending status'
      });
    }

    shop.status = 'rejected';
    shop.rejectionReason = reason || 'Your shop does not meet our requirements';
    await shop.save();

    res.json({
      success: true,
      message: 'Shop rejected',
      data: shop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive, phone } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role or deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify your own account'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    // Also deactivate their shop if they have one
    await Shop.updateMany({ owner: req.params.id }, { isActive: false });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all offers (admin view)
// @route   GET /api/admin/offers
// @access  Admin
export const getAllOffers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive, isApproved } = req.query;

    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    const offers = await Offer.find(query)
      .populate('shop', 'name category owner')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Offer.countDocuments(query);

    res.json({
      success: true,
      data: offers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer (admin)
// @route   DELETE /api/admin/offers/:id
// @access  Admin
export const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    await Offer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalytics = async (req, res, next) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const totalShopOwners = await User.countDocuments({ role: 'shop_owner' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Shop statistics
    const totalShops = await Shop.countDocuments();
    const pendingShops = await Shop.countDocuments({ status: 'pending' });
    const approvedShops = await Shop.countDocuments({ status: 'approved' });
    const rejectedShops = await Shop.countDocuments({ status: 'rejected' });

    // Offer statistics
    const totalOffers = await Offer.countDocuments();
    const activeOffers = await Offer.countDocuments({ isActive: true, isApproved: true, expiryDate: { $gt: new Date() } });
    const expiredOffers = await Offer.countDocuments({ expiryDate: { $lt: new Date() } });

    // Calculate total savings for users
    const offers = await Offer.find({ isActive: true, isApproved: true });
    const totalSavings = offers.reduce((sum, offer) => {
      return sum + ((offer.originalPrice - offer.offerPrice) * 1); // Assuming 1 redemption
    }, 0);

    // Get recent activity
    const recentShops = await Shop.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentOffers = await Offer.find()
      .populate('shop', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          shopOwners: totalShopOwners,
          regular: regularUsers
        },
        shops: {
          total: totalShops,
          pending: pendingShops,
          approved: approvedShops,
          rejected: rejectedShops
        },
        offers: {
          total: totalOffers,
          active: activeOffers,
          expired: expiredOffers
        },
        totalSavings,
        recentShops,
        recentOffers
      }
    });
  } catch (error) {
    next(error);
  }
};

