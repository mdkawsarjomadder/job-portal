import express from 'express';
import { createJob, getAllJobs } from '../controllers/jobController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// (authenticateToken)
router.post('/apply', authenticateToken, createJob);

// Jobs Token---------
router.get('/', getAllJobs);

export default router;