import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bcrypt from 'bcrypt';
import session from 'express-session';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

import { sequelize, User, Account, Post, Media } from './models/index.js';

const app = express();

const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret-key';

// ================= CONFIG =================

// 🔥 WAJIB untuk Cloudflare / proxy
app.set('trust proxy', 1);

app.use(cors({
  origin: 'https://sikreator.afifrzn.my.id',
  credentials: true
}));

app.use(express.json());

// 🔥 SESSION FINAL (SUDAH FIX)
app.use(session({
  name: 'sikreator.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ================= FILE UPLOAD =================

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// ================= AUTH =================

// REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email sudah ada' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name
      }
    });

  } catch (err) {
    console.error('❌ REGISTER ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Password salah' });

    req.session.user = {
      id: user.id,
      name: user.name
    };

    req.session.save((err) => {
      if (err) return res.status(500).json({ error: 'Session gagal' });

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name
        }
      });
    });

  } catch (err) {
    console.error('❌ LOGIN ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// CHECK LOGIN
app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Belum login' });
  }
  res.json({ user: req.session.user });
});

// LOGOUT
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// ================= MIDDLEWARE =================

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized (belum login)' });
  }
  next();
};

// ================= ACCOUNT =================

// CREATE ACCOUNT
app.post('/api/accounts', authMiddleware, async (req, res) => {
  try {
    const { username, session: sessionData } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username wajib diisi' });
    }

    const newAccount = await Account.create({
      user_id: req.session.user.id,
      username,
      session: sessionData || '-',
      status: 'active'
    });

    res.json({ success: true, data: newAccount });

  } catch (err) {
    console.error('❌ ACCOUNT ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET ACCOUNTS
app.get('/api/accounts', authMiddleware, async (req, res) => {
  const accounts = await Account.findAll({
    where: { user_id: req.session.user.id }
  });

  res.json(accounts);
});

// ================= POSTS =================

// CREATE POST (UPLOAD + RELASI MEDIA)
app.post('/api/posts', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { caption, account_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File wajib diupload' });
    }

    if (!account_id) {
      return res.status(400).json({ error: 'account_id wajib' });
    }

    // 🔥 simpan media
    const media = await Media.create({
      file_path: `/uploads/${file.filename}`,
      type: file.mimetype
    });

    // 🔥 simpan post
    const post = await Post.create({
      user_id: req.session.user.id,
      account_id: account_id,
      media_id: media.id,
      author: req.session.user.name,
      caption: caption || ''
    });

    res.json({ success: true, data: post });

  } catch (err) {
    console.error('❌ CREATE POST ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET POSTS
app.get('/api/posts', authMiddleware, async (req, res) => {
  const posts = await Post.findAll({
    where: { user_id: req.session.user.id },
    include: [Media],
    order: [['createdAt', 'DESC']]
  });

  res.json(posts);
});

// ================= START =================

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server jalan di port ${PORT}`);
  });
});
