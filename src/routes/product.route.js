import express from 'express';
import * as ctrl from '../controllers/product.controller.js';
import { needLogin, needRole } from '../middleware/auth.js';
import { validasi } from '../middleware/validasi.js';
import { productSchema } from '../validators/product.validator.js';

const router = express.Router();

router.use((req, res, next) => {
    console.log('[product]', req.method, req.originalUrl);
    next();
});

router.get('/', needLogin, ctrl.all);
router.get('/:id', needLogin, ctrl.detail);
router.get('/:id/reviews', needLogin, ctrl.reviews);
router.post('/', needLogin, needRole('admin'), validasi(productSchema), ctrl.create);
router.put('/:id', needLogin, needRole('admin'), validasi(productSchema), ctrl.update);
router.delete('/:id', needLogin, needRole('admin'), ctrl.deleteProduct);

export default router;