import express from 'express';
const router = express.Router();
import { InstagramAccount } from '../models/index.js';

router.get('/', async (req, res) => {
  try {
    const accounts = await InstagramAccount.findAll();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;