import express from 'express';
import { createJob, getAllJobs } from '../controllers/jobController.js';
import { applyForJob, getMyApplications } from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.post('/', authenticateToken, createJob);

// Application Routes
router.post('/apply', authenticateToken, applyForJob);
router.get('/my-applications', authenticateToken, getMyApplications); // নতুন রুট

export default router;