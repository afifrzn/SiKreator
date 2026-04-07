import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { sequelize, User, Media, Post, Account } from './models/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- AUTH: REGISTER ---
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.json({ success: true, id: newUser.id, name: newUser.name });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- AUTH: LOGIN ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email tidak ditemukan.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password salah.' });
    }

    res.json({ success: true, id: user.id, name: user.name });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- 1. GET POSTS ---
app.get('/api/posts', async (req, res) => {
  try {
    const { author } = req.query;
    const whereCondition = author ? { author } : {};
    const posts = await Post.findAll({
      where: whereCondition,
      include: [
        { model: Media, attributes: ['file_url', 'file_type'] },
        { model: Account, attributes: ['username'] }
      ],
      order: [['scheduled_time', 'ASC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. CREATE POST ---
app.post('/api/posts', upload.single('file'), async (req, res) => {
  try {
    const { user_id, account_id, caption, scheduled_time, author_name } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File tidak ditemukan!' });
    }

    // ✅ Wajib ada account_id — tidak ada fallback ke ID orang lain
    if (!account_id || account_id === 'undefined') {
      return res.status(400).json({ error: 'Akun Instagram belum dipilih. Tambahkan akun dulu.' });
    }

    if (!user_id || user_id === 'undefined') {
      return res.status(400).json({ error: 'User tidak valid. Coba login ulang.' });
    }

    const parsedUserId = parseInt(user_id);
    const parsedAccountId = parseInt(account_id);

    // ✅ Pastikan account_id ini benar-benar milik user yang sedang login
    const account = await Account.findOne({
      where: { id: parsedAccountId, user_id: parsedUserId }
    });

    if (!account) {
      return res.status(403).json({ error: 'Akun Instagram tidak valid atau bukan milikmu.' });
    }

    const newMedia = await Media.create({
      user_id: parsedUserId,
      file_url: `/uploads/${req.file.filename}`,
      file_type: req.file.mimetype.startsWith('video') ? 'video' : 'image'
    });

    const newPost = await Post.create({
      account_id: parsedAccountId,
      media_id: newMedia.id,
      author: author_name || 'Guest',
      caption: caption || '',
      scheduled_time,
      status: 'pending'
    });

    res.json({ success: true, data: newPost });
  } catch (err) {
    console.error('❌ ERROR POST:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 3. CREATE ACCOUNT ---
app.post('/api/accounts', async (req, res) => {
  try {
    const { user_id, username } = req.body;

    if (!user_id || user_id === 'undefined') {
      return res.status(400).json({ error: 'User tidak valid.' });
    }

    const newAccount = await Account.create({
      user_id: parseInt(user_id),
      username,
      session: '-',
      status: 'active'
    });
    res.json({ success: true, data: newAccount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. GET ACCOUNTS ---
app.get('/api/accounts', async (req, res) => {
  try {
    const { user_id } = req.query;
    const whereCondition = user_id ? { user_id: parseInt(user_id) } : {};
    const accounts = await Account.findAll({ where: whereCondition });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

sequelize.sync({ alter: true }).then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server SiKreator Berjalan di Port 5000');
  });
});