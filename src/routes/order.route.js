import express from 'express';
import * as ctrl from '../controllers/order.controller.js';
import { validasi } from '../middleware/validasi.js';
import { needLogin, needRole } from '../middleware/auth.js';
import { orderSchema } from '../validators/order.validator.js';

const router = express.Router();

// Middleware tingkat router
router.use((req, res, next) => {
    console.log('[order]', req.method, req.originalUrl);
    next();
});

router.get('/', needLogin, ctrl.all);
router.post('/', needLogin, needRole('admin'), validasi(orderSchema), ctrl.create);

export default router;