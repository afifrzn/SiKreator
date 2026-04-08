import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

// ✅ Hapus import axios & axios.defaults.withCredentials — udah dihandle di api.ts

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', formData);

      if (response.data?.success) {
        const user = response.data.user;
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_id', user.id.toString());
        localStorage.setItem('is_logged_in', 'true');
        navigate('/');
      } else {
        setError('Respons server tidak valid.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-gray-100 overflow-hidden"
      >
        <div className="bg-primary p-10 text-white text-center relative overflow-hidden">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-4 -right-4 opacity-20"
          >
            <Sparkles size={80} />
          </motion.div>
          <h2 className="text-3xl font-black">Selamat Datang</h2>
          <p className="text-white/80 text-sm mt-2">Masuk ke Dashboard Kreator Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500">Email</label>
            <input
              required
              type="text"
              placeholder="nama@email.com"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border focus:border-primary outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border focus:border-primary outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Login'}
          </button>

          <p className="text-center text-xs">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-bold">Daftar</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};