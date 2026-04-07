import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import session from 'express-session';

import { sequelize, User, Media, Post, Account } from './models/index.js';

const app = express();

// ================= CONFIG =================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true kalau pakai HTTPS
    httpOnly: true
  }
}));

app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

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

    await User.create({
      name,
      email,
      password: hashed
    });

    res.json({ success: true });

  } catch (err) {
    console.error('❌ REGISTER ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN (🔥 FIX UTAMA DI SINI)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email & password wajib' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Password salah' });
    }

    // ✅ Simpan ke session
    req.session.user = {
      id: user.id,
      name: user.name
    };

    // ✅ Pastikan session tersimpan dulu
    req.session.save((err) => {
      if (err) {
        console.error('❌ SESSION ERROR:', err);
        return res.status(500).json({ error: 'Gagal menyimpan session' });
      }

      // ✅ Response harus jelas
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

// CHECK LOGIN (🔥 buat debug)
app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Belum login' });
  }

  res.json({ user: req.session.user });
});

// LOGOUT
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
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

    const user_id = req.session.user.id;

    const newAccount = await Account.create({
      user_id,
      username,
      session: sessionData || '-',
      status: 'active'
    });

    res.json({ success: true, data: newAccount });

  } catch (err) {
    console.error('❌ CREATE ACCOUNT ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET ACCOUNTS
app.get('/api/accounts', authMiddleware, async (req, res) => {
  try {
    const user_id = req.session.user.id;

    const accounts = await Account.findAll({
      where: { user_id }
    });

    res.json(accounts);

  } catch (err) {
    console.error('❌ GET ACCOUNT ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= START =================
sequelize.sync().then(() => {
  app.listen(5000, () => console.log('🚀 Server jalan di 5000'));
});