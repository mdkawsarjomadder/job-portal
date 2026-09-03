import express from 'express';
import { createJob, getAllJobs, getEmployerJobsWithApplications, updateApplicationStatus } from '../controllers/jobController.js';
import { applyForJob, getMyApplications } from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.post('/', authenticateToken, createJob);

// Application Routes
router.post('/apply', authenticateToken, applyForJob);
router.get('/my-applications', authenticateToken, getMyApplications);

// Employer Routes (নতুন যুক্ত হওয়া রুট)
router.get('/employer-jobs', authenticateToken, getEmployerJobsWithApplications);
router.patch('/application-status/:applicationId', authenticateToken, updateApplicationStatus);

export default router;