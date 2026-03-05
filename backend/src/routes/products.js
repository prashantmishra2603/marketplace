import express from 'express';
import { 
  createProduct,
  getBrandProducts,
  getBrandProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getMarketplaceProducts,
  getMarketplaceProduct,
  getCategories,
} from '../controllers/productController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes (Marketplace)
router.get('/categories', getCategories);
router.get('/', optionalAuth, getMarketplaceProducts);
router.get('/:id', optionalAuth, getMarketplaceProduct);

// Protected routes (Brand)
router.post('/', protect, authorize('brand'), upload.array('images', 5), createProduct);
router.get('/brand', protect, authorize('brand'), getBrandProducts);
router.get('/brand/:id', protect, authorize('brand'), getBrandProduct);
router.put('/brand/:id', protect, authorize('brand'), upload.array('images', 5), updateProduct);
router.delete('/brand/:id', protect, authorize('brand'), deleteProduct);
router.delete('/brand/:id/images/:imageId', protect, authorize('brand'), deleteProductImage);

export default router;
