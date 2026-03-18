import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import playerRoutes from './routes/playerRoutes';
import villageRoutes from './routes/villageRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

import './config/firebase-config';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/player', playerRoutes);
app.use('/api/village', villageRoutes);
app.use('/api/users', userRoutes);

// Basic Route to check if server is live
app.get('/', (req, res) => {
  res.send('Clan Clasher API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI!, {
  family: 4 // Forces IPv4
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});