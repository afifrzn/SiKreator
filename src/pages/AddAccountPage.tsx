import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Save, Loader2 } from 'lucide-react';

export const AddAccountPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    session: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sesuaikan user_id dengan user yang sedang login
      const payload = { ...formData, user_id: 1 }; 
      
      await axios.post('http://localhost:5000/api/accounts', payload);
      alert('Akun berhasil ditambahkan!');
      setFormData({ username: '', session: '' });
    } catch (error) {
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error instanceof Error
          ? error.message
          : String(error);

      alert('Gagal menambah akun: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
            <Camera size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Tambah Akun Instagram</h2>
            <p className="text-gray-500 text-sm">Hubungkan akun untuk mulai menjadwalkan konten.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Username Instagram</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-pink-500 focus:bg-white outline-none transition-all"
              placeholder="@username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Session Data (JSON/Text)</label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-pink-500 focus:bg-white outline-none transition-all font-mono text-xs"
              placeholder="Paste session cookies atau token di sini..."
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Simpan Akun
          </button>
        </form>
      </div>
    </div>
  );
};