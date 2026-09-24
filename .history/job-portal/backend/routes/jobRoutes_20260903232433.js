import express from 'express';
import { createJob, getAllJobs } from '../controllers/jobController.js';
import { applyForJob } from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/jobs -> সব জব দেখার জন্য
router.get('/', getAllJobs);

// POST /api/jobs -> নতুন জব তৈরি করার জন্য (এটি মিসিং ছিল)
router.post('/', authenticateToken, createJob);

// POST /api/jobs/apply -> জবে আবেদন করার জন্য
router.post('/apply', authenticateToken, applyForJob);

export default router;