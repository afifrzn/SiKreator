import React, { useState, useRef, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { cn } from '../lib/utils';
import { Upload, X, Send, Loader2, Clock, Sparkles, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface Account {
  id: number;
  username: string;
}

export const UploadPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('20:00');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ================= LOAD ACCOUNTS =================
  useEffect(() => {
    api.get('/accounts')
      .then(res => {
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSelectedAccountId(res.data[0].id.toString());
        }
      })
      .catch(err => console.error('Gagal fetch akun:', err))
      .finally(() => setLoadingAccounts(false));
  }, []);

  // cleanup preview
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  // ================= AI CAPTION =================
  const generateAICaption = async () => {
    if (files.length === 0) return alert("Upload foto dulu!");

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0].file);

      const res = await fetch('https://n8n-n8n.wrmm9a.easypanel.host/webhook/2b2a8b50-a3f3-4234-9ce0-caef8903f973', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const result = data?.caption || data?.text || "";

      if (result) setCaption(result);

    } catch {
      alert("Gagal AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (files.length === 0) return alert("Upload file dulu!");
    if (!caption.trim()) return alert("Isi caption!");
    if (!selectedAccountId) return alert("Pilih akun!");

    setIsUploading(true);

    try {
      const [h, m] = selectedTime.split(':');
      const schedule = new Date(selectedDate);
      schedule.setHours(parseInt(h), parseInt(m), 0);

      const formData = new FormData();

      // 🔥 WAJIB (match backend)
      formData.append('file', files[0].file);
      formData.append('caption', caption);
      formData.append('account_id', selectedAccountId);

      // optional future
      formData.append('scheduled_time', schedule.toISOString());
      formData.append('status', 'pending');

      const res = await api.post('/posts', formData);

      if (res.data.success) {
        alert('✅ Upload berhasil!');
        setFiles([]);
        setCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }

    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      console.error(msg);
      alert(`❌ ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  // ================= FILE =================
  const addFiles = (newFiles: File[]) => {
    const mapped = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }));

    setFiles(prev => [...prev, ...mapped]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const f = prev.find(x => x.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter(x => x.id !== id);
    });
  };

  // ================= EMPTY ACCOUNT =================
  if (!loadingAccounts && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h2 className="text-xl font-bold">Belum ada akun IG</h2>
        <Link to="/tambah-akun" className="bg-primary text-white px-4 py-2 rounded">
          Tambah akun
        </Link>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Upload Konten</h1>

      {/* FILE */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-dashed border-2 p-10 text-center cursor-pointer rounded-xl"
      >
        Klik / drag file
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
        />
      </div>

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.id} className="relative">
            <img src={f.preview} className="rounded" />
            <button onClick={() => removeFile(f.id)}>X</button>
          </div>
        ))}
      </div>

      {/* ACCOUNT */}
      <select
        value={selectedAccountId}
        onChange={(e) => setSelectedAccountId(e.target.value)}
        className="w-full border p-3 rounded"
      >
        {accounts.map(acc => (
          <option key={acc.id} value={acc.id}>
            @{acc.username}
          </option>
        ))}
      </select>

      {/* CAPTION */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border p-3 rounded"
        placeholder="Caption..."
      />

      <button onClick={generateAICaption}>
        🤖 Generate AI
      </button>

      {/* UPLOAD */}
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="bg-blue-500 text-white px-4 py-3 rounded w-full"
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

    </div>
  );
};
