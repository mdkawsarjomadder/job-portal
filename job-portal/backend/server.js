import jobRoutes from './routes/jobRoutes.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Router-------------
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRoutes);

app.get('/',(req,res) => {
    res.send('Job Portal API is running successfully!');
});

app.listen(PORT, () =>{
   console.log(`Server running on port ${PORT}`);
}); 


