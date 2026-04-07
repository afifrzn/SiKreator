import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Save, Loader2 } from 'lucide-react';

// ✅ Penting: biar kirim cookie/session ke backend
axios.defaults.withCredentials = true;

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
      await axios.post(
        'http://localhost:5000/api/accounts',
        {
          username: formData.username,
          session: formData.session,
        }
      );

      alert('✅ Akun berhasil ditambahkan!');
      setFormData({ username: '', session: '' });

    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error.message ||
        'Terjadi kesalahan';

      alert('❌ Gagal menambah akun: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
            <Camera size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Tambah Akun Instagram
            </h2>
            <p className="text-gray-500 text-sm">
              Hubungkan akun untuk mulai menjadwalkan konten.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* USERNAME */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Username Instagram
            </label>
            <input
              type="text"
              required
              placeholder="@username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-pink-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* SESSION */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Session Data (Optional)
            </label>
            <textarea
              rows={5}
              placeholder="Paste session cookies / token (optional)..."
              value={formData.session}
              onChange={(e) =>
                setFormData({ ...formData, session: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-pink-500 focus:bg-white outline-none transition-all font-mono text-xs"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} />
                Simpan Akun
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};