import Shop from '../models/Shop.js';
import Offer from '../models/Offer.js';

// @desc    Register a new shop
// @route   POST /api/shops
// @access  Private (Shop Owner)
export const registerShop = async (req, res, next) => {
  try {
    const { name, description, category, phone, address, latitude, longitude, images } = req.body;

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: req.user._id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a shop registered'
      });
    }

    // Create shop
    const shop = await Shop.create({
      owner: req.user._id,
      name,
      description,
      category,
      phone,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      images: images || [],
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Shop registration request submitted. Waiting for admin approval.',
      data: shop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
export const getShops = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    let query = {};
    // Only show approved shops to public
    if (status === 'all') {
      // Admin can see all
    } else {
      query.status = 'approved';
      query.isActive = true;
    }

    if (category) {
      query.category = category;
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

// @desc    Get my shop (for shop owner)
// @route   GET /api/shops/my-shop
// @access  Private (Shop Owner)
export const getMyShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id })
      .populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a registered shop'
      });
    }

    // Get shop offers
    const offers = await Offer.find({ shop: shop._id, isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        shop,
        offers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
export const getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({
      _id: req.params.id,
      status: 'approved',
      isActive: true
    }).populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Get active offers
    const offers = await Offer.find({
      shop: shop._id,
      isActive: true,
      isApproved: true,
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        shop,
        offers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (Shop Owner)
export const updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found or you do not have permission'
      });
    }

    const { name, description, category, phone, address, latitude, longitude, images } = req.body;

    // Update fields
    if (name) shop.name = name;
    if (description) shop.description = description;
    if (category) shop.category = category;
    if (phone) shop.phone = phone;
    if (address) shop.address = address;
    if (latitude && longitude) {
      shop.location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    }
    if (images) shop.images = images;

    // If shop was rejected, reset to pending
    if (shop.status === 'rejected') {
      shop.status = 'pending';
    }

    await shop.save();

    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shops for map view (nearby shops with offers)
// @route   GET /api/shops/nearby
// @access  Public
export const getNearbyShops = async (req, res, next) => {
  try {
    const { latitude, longitude, distance = 10, category } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const query = {
      status: 'approved',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(distance) * 1000 // Convert km to meters
        }
      }
    };

    if (category) {
      query.category = category;
    }

    const shops = await Shop.find(query)
      .populate('owner', 'name')
      .limit(50);

    // Get offers for each shop
    const shopIds = shops.map(s => s._id);
    const offers = await Offer.find({
      shop: { $in: shopIds },
      isActive: true,
      isApproved: true,
      expiryDate: { $gt: new Date() }
    });

    // Group offers by shop
    const offersByShop = offers.reduce((acc, offer) => {
      const shopId = offer.shop.toString();
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push(offer);
      return acc;
    }, {});

    // Combine shops with their offers
    const shopsWithOffers = shops.map(shop => ({
      ...shop.toObject(),
      offers: offersByShop[shop._id.toString()] || []
    }));

    res.json({
      success: true,
      data: shopsWithOffers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private (Shop Owner)
export const deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found or you do not have permission'
      });
    }

    // Soft delete - deactivate
    shop.isActive = false;
    await shop.save();

    // Also deactivate offers
    await Offer.updateMany({ shop: shop._id }, { isActive: false });

    res.json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

