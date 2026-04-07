import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path'; // Tambahkan ini
import { fileURLToPath } from 'url'; // Tambahkan ini jika pakai Type: Module
import { sequelize } from './models/index.js'; 
import postRoutes from './routes/postRoutes.js';
import accountRoutes from './routes/accountRoutes.js';

const __filename = fileURLToPath(import.meta.url); // Tambahkan ini
const __dirname = path.dirname(__filename); // Tambahkan ini

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- FIX: IZINKAN AKSES FOLDER UPLOADS ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/accounts', accountRoutes);

const PORT = process.env.PORT || 5000;

// Database Sync & Server Start
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database connected & synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Unable to connect to the database:', err);
});