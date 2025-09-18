import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());
await connectDB()

app.use('/uploads', express.static('uploads'));

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.get('/', (req, res) => { res.send('Imagify API Server is Working fine'); });

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`);});
