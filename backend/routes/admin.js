import express from 'express';
import { body, param, query } from 'express-validator';
import { validateMiddleware } from '../middleware/validationMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  getShopRequests,
  approveShop,
  rejectShop,
  getUsers,
  updateUser,
  deleteUser,
  getAllOffers,
  deleteOffer,
  getAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Shop management
router.get('/shop-requests', getShopRequests);
router.put('/approve-shop/:id', param('id').isMongoId(), validateMiddleware, approveShop);
router.put('/reject-shop/:id', 
  param('id').isMongoId(), 
  body('reason').optional().trim(), 
  validateMiddleware, 
  rejectShop
);

// User management
router.get('/users', getUsers);
router.put('/users/:id', 
  param('id').isMongoId(),
  body('name').optional().trim(),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['user', 'shop_owner', 'admin']),
  body('isActive').optional().isBoolean(),
  validateMiddleware,
  updateUser
);
router.delete('/users/:id', param('id').isMongoId(), validateMiddleware, deleteUser);

// Offer management
router.get('/offers', getAllOffers);
router.delete('/offers/:id', param('id').isMongoId(), validateMiddleware, deleteOffer);

// Analytics
router.get('/analytics', getAnalytics);

export default router;

