import express from 'express';
import { createJob, getAllJobs, getEmployerJobsWithApplications, updateApplicationStatus } from '../controllers/jobController.js';
import { applyForJob, getMyApplications } from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // 💡 upload ইম্পোর্ট যুক্ত করা হয়েছে

const router = express.Router();

// Job Routes
router.get('/', getAllJobs);
router.post('/', authenticateToken, createJob);

// Application Routes
router.post('/apply', authenticateToken, upload.single('resume'), applyForJob);
router.get('/my-applications', authenticateToken, getMyApplications);

// Employer Routes
router.get('/employer-jobs', authenticateToken, getEmployerJobsWithApplications);
router.patch('/application-status/:applicationId', authenticateToken, updateApplicationStatus);

export default router;