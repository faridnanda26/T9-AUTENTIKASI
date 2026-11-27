import express from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { validasi } from '../middleware/validasi.js';
import { needLogin } from '../middleware/auth.js';
import { authSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validasi(authSchema), ctrl.register);
router.post('/login', validasi(authSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/saya', needLogin, ctrl.saya);

export default router;