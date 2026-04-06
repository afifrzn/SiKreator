import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { sequelize } from './models/index.js'; 
import postRoutes from './routes/postRoutes.js';
import accountRoutes from './routes/accountRoutes.js'; // Tambahkan ini

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/accounts', accountRoutes); // Tambahkan ini

const PORT = process.env.PORT || 5000;

// Database Sync & Server Start
sequelize.sync({ force: false }).then(() => {
  console.log('✅ Database connected & synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Unable to connect to the database:', err);
});