import Shop from '../models/Shop.js';

// Shop Owner middleware - allow only shop owners with approved shops
export const shopOwnerMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // Check if user is a shop owner
  if (req.user.role !== 'shop_owner') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Shop owners only.'
    });
  }

  // Check if user has an approved shop
  const shop = await Shop.findOne({
    owner: req.user._id,
    status: 'approved',
    isActive: true
  });

  if (!shop) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You need an approved shop to perform this action.'
    });
  }

  req.shop = shop;
  next();
};

export default shopOwnerMiddleware;

