import Offer from '../models/Offer.js';
import Shop from '../models/Shop.js';

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private (Shop Owner)
export const createOffer = async (req, res, next) => {
  try {
    const { title, description, discountPercentage, originalPrice, offerPrice, expiryDate, images } = req.body;

    // Get shop for this owner
    const shop = await Shop.findOne({ 
      owner: req.user._id, 
      status: 'approved',
      isActive: true 
    });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'You need an approved shop to create offers'
      });
    }

    // Create offer
    const offer = await Offer.create({
      shop: shop._id,
      title,
      description,
      discountPercentage,
      originalPrice,
      offerPrice,
      expiryDate,
      images: images || [],
      location: shop.location,
      isActive: true,
      isApproved: true
    });

    // Populate shop details
    await offer.populate('shop', 'name category address');

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
export const getOffers = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, shopId } = req.query;

    const query = {
      isActive: true,
      isApproved: true,
      expiryDate: { $gt: new Date() }
    };

    if (category) {
      // This requires joining with shops, so we'll handle it differently
    }

    if (shopId) {
      query.shop = shopId;
    }

    const offers = await Offer.find(query)
      .populate('shop', 'name category address location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    let filteredOffers = offers;
    
    // Filter by category if provided
    if (category) {
      filteredOffers = offers.filter(offer => 
        offer.shop && offer.shop.category === category
      );
    }

    const total = await Offer.countDocuments(query);

    res.json({
      success: true,
      data: filteredOffers,
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

// @desc    Get nearby offers
// @route   GET /api/offers/nearby
// @access  Public
export const getNearbyOffers = async (req, res, next) => {
  try {
    const { latitude, longitude, distance = 10, category } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Convert km to radians (Earth radius ≈ 6378.1 km)
    const radiusInRadians = parseFloat(distance) / 6378.1;

    const query = {
      isActive: true,
      isApproved: true,
      expiryDate: { $gt: new Date() },
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            radiusInRadians
          ]
        }
      }
    };

    const offers = await Offer.find(query)
      .populate('shop', 'name category address location images')
      .limit(50);

    // Filter by category if provided
    let filteredOffers = offers;
    if (category) {
      filteredOffers = offers.filter(offer => 
        offer.shop && offer.shop.category === category
      );
    }

    res.json({
      success: true,
      data: filteredOffers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Public
export const getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findOne({
      _id: req.params.id,
      isActive: true,
      isApproved: true
    }).populate('shop', 'name category address location phone images');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Increment views
    offer.views += 1;
    await offer.save();

    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private (Shop Owner)
export const updateOffer = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id, status: 'approved', isActive: true });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'You need an approved shop to update offers'
      });
    }

    const offer = await Offer.findOne({ _id: req.params.id, shop: shop._id });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found or you do not have permission'
      });
    }

    const { title, description, discountPercentage, originalPrice, offerPrice, expiryDate, images, isActive } = req.body;

    // Update fields
    if (title) offer.title = title;
    if (description) offer.description = description;
    if (discountPercentage !== undefined) offer.discountPercentage = discountPercentage;
    if (originalPrice !== undefined) offer.originalPrice = originalPrice;
    if (offerPrice !== undefined) offer.offerPrice = offerPrice;
    if (expiryDate) offer.expiryDate = expiryDate;
    if (images) offer.images = images;
    if (isActive !== undefined) offer.isActive = isActive;

    await offer.save();

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private (Shop Owner)
export const deleteOffer = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id, status: 'approved', isActive: true });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'You need an approved shop to delete offers'
      });
    }

    const offer = await Offer.findOne({ _id: req.params.id, shop: shop._id });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found or you do not have permission'
      });
    }

    // Soft delete
    offer.isActive = false;
    await offer.save();

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my offers (for shop owner)
// @route   GET /api/offers/my-offers
// @access  Private (Shop Owner)
export const getMyOffers = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a shop'
      });
    }

    const offers = await Offer.find({ shop: shop._id })
      .populate('shop', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: offers
    });
  } catch (error) {
    next(error);
  }
};

