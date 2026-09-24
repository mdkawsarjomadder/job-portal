import express from 'express';
import { createJob, getAllJobs, getEmployerJobsWithApplications, updateApplicationStatus } from '../controllers/jobController.js';
import { applyForJob, getMyApplications } from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // 💡 upload ইম্পোর্ট যুক্ত করা হয়েছে
import {
  createJob,
  getAllJobs,
  getEmployerJobsWithApplications,
  updateApplicationStatus,
  updateJob,
  deleteJob,} from '../controllers/jobController.js'

const router = express.Router();

// Job Routes
router.get('/', getAllJobs);
router.post('/', authenticateToken, createJob);

// Application Routes
router.post('/apply', authenticateToken, upload.single('resume'), applyForJob);
router.get('/employer-jobs', authenticateToken, getEmployerJobsWithApplications);
router.get('/my-applications', authenticateToken, getMyApplications);

// Employer Routes
router.get('/employer-jobs', authenticateToken, getEmployerJobsWithApplications);
router.patch('/application-status/:applicationId', authenticateToken, updateApplicationStatus);

// 💡 New Edit and Delete Routes
router.put('/:jobId', authenticateToken, updateJob);
router.delete('/:jobId', authenticateToken, deleteJob);


export default router;