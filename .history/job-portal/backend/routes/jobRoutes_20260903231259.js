import express from 'express';
import { createJob, getAllJobs } from '../controllers/jobController.js';
import { applyForJob } from '../controllers/applicationController.js'; // applicationController থেকে Import করুন
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ১. সব জব পাওয়ার জন্য (GET: http://localhost:5000/api/jobs)
router.get('/', getAllJobs);

// ২. নতুন জব পোস্ট করার জন্য (POST: http://localhost:5000/api/jobs)
router.post('/', authenticateToken, createJob);

// ৩. জবে আবেদন করার জন্য (POST: http://localhost:5000/api/jobs/apply)
router.post('/apply', authenticateToken, applyForJob);

export default router;