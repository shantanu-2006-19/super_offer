import express from 'express';
import { body, query, param } from 'express-validator';
import { validateMiddleware } from '../middleware/validationMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { 
  createOffer, 
  getOffers, 
  getNearbyOffers, 
  getOffer, 
  updateOffer, 
  deleteOffer,
  getMyOffers 
} from '../controllers/offerController.js';

const router = express.Router();

// Offer creation validation
const offerValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('discountPercentage').notEmpty().withMessage('Discount is required').isFloat({ min: 0, max: 100 }),
  body('originalPrice').notEmpty().withMessage('Original price is required').isFloat({ min: 0 }),
  body('offerPrice').notEmpty().withMessage('Offer price is required').isFloat({ min: 0 }),
  body('expiryDate').notEmpty().withMessage('Expiry date is required').isISO8601()
];

// Offer update validation
const updateOfferValidation = [
  body('title').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('discountPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('originalPrice').optional().isFloat({ min: 0 }),
  body('offerPrice').optional().isFloat({ min: 0 }),
  body('expiryDate').optional().isISO8601()
];

// Nearby offers validation
const nearbyValidation = [
  query('latitude').notEmpty().withMessage('Latitude is required').isFloat({ min: -90, max: 90 }),
  query('longitude').notEmpty().withMessage('Longitude is required').isFloat({ min: -180, max: 180 }),
  query('distance').optional().isFloat({ min: 0.1, max: 50 })
];

// ID validation
const idValidation = [param('id').isMongoId().withMessage('Invalid ID')];

// Public routes
router.get('/', getOffers);
router.get('/nearby', nearbyValidation, validateMiddleware, getNearbyOffers);

// Protected routes (shop owner) - MUST come before /:id
router.post('/', authMiddleware, offerValidation, validateMiddleware, createOffer);
router.get('/my/offers', authMiddleware, getMyOffers);
router.put('/:id', authMiddleware, idValidation, updateOfferValidation, validateMiddleware, updateOffer);
router.delete('/:id', authMiddleware, idValidation, validateMiddleware, deleteOffer);

// Public route for single offer - MUST come last
router.get('/:id', idValidation, validateMiddleware, getOffer);

export default router;

