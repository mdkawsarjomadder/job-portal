import express from 'express';
import {
  createJob,
  getAllJobs,
  getEmployerJobsWithApplications,
  updateApplicationStatus,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { applyForJob, getMyApplications } from '../controllers/applicationController.js';
import { getProfile, updateProfile } from '../controllers/userController.js'; 
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// 1. Static & Profile Routes (অবশ্যই /:jobId এর উপরে থাকবে)
router.get('/', getAllJobs);
router.get('/profile', authenticateToken, getProfile); // 👈 উপরে আনা হয়েছে
router.put('/profile', authenticateToken, updateProfile); // 👈 উপরে আনা হয়েছে

// 2. Application & Employer Routes
router.post('/apply', authenticateToken, upload.single('resume'), applyForJob);
router.get('/my-applications', authenticateToken, getMyApplications);
router.get('/employer-jobs', authenticateToken, getEmployerJobsWithApplications);
router.patch('/application-status/:applicationId', authenticateToken, updateApplicationStatus);

// 3. Dynamic Job Parameter Routes (সবশেষে রাখতে হবে)
router.post('/', authenticateToken, createJob);
router.put('/:jobId', authenticateToken, updateJob);
router.delete('/:jobId', authenticateToken, deleteJob);

export default router;