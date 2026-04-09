import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bcrypt from 'bcrypt';
import session from 'express-session';
import dotenv from 'dotenv';
import multer from 'multer';
import { Op } from 'sequelize';  // ✅ Hanya ini, satu kali saja
import { sequelize, User, Account, Post, Media } from './models/index.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret-key';

// ================= CONFIG =================
app.set('trust proxy', 1);

app.use(cors({
  origin: 'https://sikreator.afifrzn.my.id',
  credentials: true
}));

app.use(express.json());

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
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// ================= AUTH =================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Field wajib diisi' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email sudah ada' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.json({ success: true, user: { id: user.id, name: user.name } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Password salah' });

    req.session.user = { id: user.id, name: user.name };
    req.session.save((err) => {
      if (err) return res.status(500).json({ error: 'Session gagal' });
      res.json({ success: true, user: req.session.user });
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Belum login' });
  res.json({ user: req.session.user });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// ================= MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

// ================= ACCOUNT =================
app.post('/api/accounts', authMiddleware, async (req, res) => {
  try {
    const { username, session: sessionData } = req.body;
    if (!username) return res.status(400).json({ error: 'Username wajib diisi' });

    const newAccount = await Account.create({
      user_id: req.session.user.id,
      username,
      session: sessionData || '-',
      status: 'active'
    });
    res.json({ success: true, data: newAccount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/accounts', authMiddleware, async (req, res) => {
  const accounts = await Account.findAll({ where: { user_id: req.session.user.id } });
  res.json(accounts);
});

// ================= POSTS =================
app.post('/api/posts', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { caption, account_id, scheduled_time } = req.body;
    const file = req.file;

    if (!file || !account_id) return res.status(400).json({ error: 'Data tidak lengkap' });

    const media = await Media.create({
      user_id: req.session.user.id,
      file_url: `/uploads/${file.filename}`,
      file_type: file.mimetype.startsWith('video') ? 'video' : 'image'
    });

    const post = await Post.create({
      user_id: req.session.user.id,
      account_id,
      media_id: media.id,
      author: req.session.user.name,
      caption: caption || '',
      scheduled_time: (scheduled_time && scheduled_time !== "undefined") ? scheduled_time : null
    });

    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        author: req.session.user.name, // ✅ Pakai author, bukan user_id
        scheduled_time: { [Op.ne]: null }
      },
      include: [Media],
      order: [['scheduled_time', 'ASC']]
    });
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= START =================
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server jalan di port ${PORT}`));
});
