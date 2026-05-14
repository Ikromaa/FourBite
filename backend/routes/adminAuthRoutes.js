import express from 'express';
import { adminLogin, adminLogout } from '../controllers/adminAuthController.js';
import { adminAuthLimiter } from '../middleware/rateLimiters.js';

const adminAuthRouter = express.Router();

// POST /api/admin/login
adminAuthRouter.post('/login', adminAuthLimiter, adminLogin);
adminAuthRouter.post('/logout', adminLogout);

export default adminAuthRouter;
