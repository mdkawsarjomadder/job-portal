import express from 'express';
import { createJob, getAllJobs } from '../controllers/jobController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// পোস্ট করতে টোকেন লাগবে (authenticateToken)
router.post('/', authenticateToken, createJob);

// জব দেখতে টোকেন ছাড়াও দেখতে পারবে
router.get('/', getAllJobs);

export default router;