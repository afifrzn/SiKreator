import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/register', formData);

      // ✅ FIX: pakai success dari backend
      if (response.data?.success) {
        // redirect ke login setelah register berhasil
        navigate('/login');
      } else {
        setError(response.data?.error || 'Register gagal.');
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
          <h2 className="text-3xl font-black tracking-tight relative z-10">Buat Akun</h2>
          <p className="text-white/80 text-sm mt-2 font-medium relative z-10">
            Gabung SiKreator sekarang.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Nama Lengkap
            </label>
            <div className="relative flex items-center group">
              <User className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                required
                type="text"
                placeholder="Contoh: Afif"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-white transition-all text-sm"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Email
            </label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                required
                type="text"
                placeholder="nama@email.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-white transition-all text-sm"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Password
            </label>
            <div className="relative flex items-center group">
              <Lock className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-white transition-all text-sm"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ArrowRight size={18} />
                Daftar Sekarang
              </>
            )}
          </button>

          {/* LINK LOGIN */}
          <p className="text-center text-xs text-gray-500 font-medium pt-4">
            Sudah punya akun?
            <Link to="/login" className="text-primary font-bold ml-1 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
