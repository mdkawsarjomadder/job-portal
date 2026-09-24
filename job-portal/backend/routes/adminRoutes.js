import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin,
  getAllApplicationsAdmin,
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Super Admin Authorization Guard
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access Denied: Super Admin privilege required.' });
  }
  next();
};

// All routes require token + Admin role
router.use(authenticateToken, requireAdmin);

// Analytics
router.get('/stats', getAdminStats);

// Users Management
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Jobs Management
router.get('/jobs', getAllJobsAdmin);
router.delete('/jobs/:jobId', deleteJobAdmin);

// Applications Management
router.get('/applications', getAllApplicationsAdmin);

export default router;
