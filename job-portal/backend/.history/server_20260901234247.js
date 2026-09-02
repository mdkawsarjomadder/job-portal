import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send('Job Portal API is running successfully!');
});

app.Listen(PORT, () =>{
   console.log(`Server running on port ${PORT}`);
}); 


