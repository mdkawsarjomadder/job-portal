import jobRoutes from './routes/jobRoutes.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { seedSuperAdmin } from './utils/seedAdmin.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure default Super Admin exists
seedSuperAdmin();

// Router-------------
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',(req,res) => {
    res.send('Job Portal API is running successfully!');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  return res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () =>{
   console.log(`Server running on port ${PORT}`);
}); 


