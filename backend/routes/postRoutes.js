import express from 'express';
import multer from 'multer';
import path from 'path';
import { Post, InstagramAccount } from '../models/index.js';

const router = express.Router();

// --- 1. KONFIGURASI MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'uploads' sudah dibuat manual di root backend
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- 2. GET ALL POSTS ---
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: InstagramAccount, attributes: ['username'] }]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 3. POST NEW POST (DENGAN PENYELAMAT DATA) ---
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { user_id, instagram_account_id, caption, status, scheduled_at } = req.body;

    // Cek apakah file benar-benar masuk ke Multer
    if (!req.file) {
      return res.status(400).json({ message: "File gambar tidak diterima oleh server!" });
    }

    const media_url = `http://localhost:5000/uploads/${req.file.filename}`;

    // --- PROSES SIMPAN KE DATABASE ---
    const post = await Post.create({
      // Di-parse ke Integer karena FormData mengirim string
      user_id: parseInt(user_id), 
      instagram_account_id: parseInt(instagram_account_id),
      media_url: media_url,
      caption: caption,
      // Pastikan status ada isinya, kalau kosong default ke 'scheduled'
      status: status || 'scheduled',
      // Pastikan format tanggal benar
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null 
    });

    res.status(201).json(post);
  } catch (err) {
    // LOG INI SANGAT PENTING: Cek terminal backend kamu pas error!
    console.error("🔥 Error Detail Database:", err); 
    res.status(400).json({ 
      message: "Gagal simpan ke database", 
      error: err.message 
    });
  }
});

export default router;