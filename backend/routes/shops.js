import express from 'express';
import { body, query } from 'express-validator';
import { validateMiddleware } from '../middleware/validationMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { 
  registerShop, 
  getShops, 
  getMyShop, 
  getShop, 
  updateShop, 
  deleteShop,
  getNearbyShops 
} from '../controllers/shopController.js';

const router = express.Router();

// Shop registration validation
const shopValidation = [
  body('name').trim().notEmpty().withMessage('Shop name is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('category').notEmpty().withMessage('Category is required')
    .isIn(['restaurant', 'retail', 'grocery', 'fashion', 'electronics', 'beauty', 'fitness', 'pharmacy', 'other']),
  body('phone').notEmpty().withMessage('Phone is required').isMobilePhone(),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('latitude').notEmpty().withMessage('Latitude is required').isFloat({ min: -90, max: 90 }),
  body('longitude').notEmpty().withMessage('Longitude is required').isFloat({ min: -180, max: 180 })
];

// Update shop validation
const updateShopValidation = [
  body('name').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('category').optional().isIn(['restaurant', 'retail', 'grocery', 'fashion', 'electronics', 'beauty', 'fitness', 'pharmacy', 'other']),
  body('phone').optional().isMobilePhone(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 })
];

// Nearby shops validation
const nearbyValidation = [
  query('latitude').notEmpty().withMessage('Latitude is required').isFloat({ min: -90, max: 90 }),
  query('longitude').notEmpty().withMessage('Longitude is required').isFloat({ min: -180, max: 180 }),
  query('distance').optional().isFloat({ min: 0.1, max: 50 })
];

// Public routes
router.get('/', getShops);
router.get('/nearby', nearbyValidation, validateMiddleware, getNearbyShops);

// Protected routes (shop owner) - MUST come before /:id
router.get('/my-shop', authMiddleware, getMyShop);
router.post('/', authMiddleware, shopValidation, validateMiddleware, registerShop);
router.put('/:id', authMiddleware, updateShopValidation, validateMiddleware, updateShop);
router.delete('/:id', authMiddleware, deleteShop);

// Public route for single shop - MUST come last
router.get('/:id', getShop);

export default router;

