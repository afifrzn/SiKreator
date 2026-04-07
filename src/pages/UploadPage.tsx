import React, { useState, useRef, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { cn } from '../lib/utils';
import { Upload, X, Send, Loader2, Clock, Sparkles, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

  // Fetch akun IG milik user yang sedang login
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    axios.get(`http://localhost:5000/api/accounts?user_id=${userId}`)
      .then(res => {
        setAccounts(res.data);
        // Auto-select akun pertama jika ada
        if (res.data.length > 0) setSelectedAccountId(res.data[0].id.toString());
      })
      .catch(err => console.error('Gagal fetch akun:', err))
      .finally(() => setLoadingAccounts(false));
  }, []);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const timeSlots = [
    { label: 'Pagi (Fresh)', time: '09:00', desc: 'Waktunya orang baru masuk kantor' },
    { label: 'Siang (Lunch)', time: '12:30', desc: 'Jam istirahat makan siang' },
    { label: 'Sore (Chill)', time: '18:30', desc: 'Audiens lagi santai pulang kerja' },
    { label: 'Malam (Prime)', time: '20:00', desc: 'Engagement paling tinggi' },
  ];

  const generateAICaption = async () => {
    if (files.length === 0) return alert("Upload foto dulu biar AI bisa lihat kontennya!");
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0].file);
      const n8nWebhookUrl = 'https://n8n-n8n.wrmm9a.easypanel.host/webhook/2b2a8b50-a3f3-4234-9ce0-caef8903f973';
      const response = await axios.post(n8nWebhookUrl, formData);
      const resultText = response.data?.caption || response.data?.text || "";
      if (resultText) setCaption(resultText);
    } catch {
      alert("Gagal menghubungi AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Pilih minimal satu foto!");
    if (!caption.trim()) return alert("Tulis caption-mu dulu!");
    if (!selectedAccountId) return alert("Pilih akun Instagram dulu!");

    setIsUploading(true);
    try {
      const [hours, minutes] = selectedTime.split(':');
      const finalSchedule = new Date(selectedDate);
      finalSchedule.setHours(parseInt(hours), parseInt(minutes), 0);

      const currentUserId = localStorage.getItem('user_id') || '';
      const currentUserName = localStorage.getItem('user_name') || 'Unknown';

      const formData = new FormData();
      formData.append('file', files[0].file);
      formData.append('user_id', currentUserId);
      formData.append('account_id', selectedAccountId); // ✅ Pakai akun milik user
      formData.append('caption', caption);
      formData.append('author_name', currentUserName);
      formData.append('status', 'pending');
      formData.append('scheduled_time', finalSchedule.toISOString());

      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert(`✅ Berhasil! Konten dijadwalkan.`);
        setFiles([]);
        setCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.message;
      console.error("Error Detail:", errMsg);
      alert(`Gagal: ${errMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const mappedFiles: UploadedFile[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }));
    setFiles(prev => [...prev, ...mappedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  // ✅ Blokir halaman kalau belum punya akun IG
  if (!loadingAccounts && accounts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 lg:pb-8"
      >
        <TopBar title="Upload Bahan Konten" subtitle="Siapkan materimu." isLoggedIn={true} onLogout={() => {}} />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4 px-6 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-black">Belum Ada Akun Instagram</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Kamu harus menambahkan akun Instagram terlebih dahulu sebelum bisa menjadwalkan postingan.
          </p>
          <Link
            to="/tambah-akun"
            className="mt-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:brightness-110 transition-all"
          >
            Tambah Akun Instagram
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 lg:pb-8"
    >
      <TopBar title="Upload Bahan Konten" subtitle={`Halo ${localStorage.getItem('user_name')}, siapkan materimu.`} isLoggedIn={true} onLogout={() => {}} />

      <div className="px-6 pt-4 lg:pt-8 max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-7 space-y-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[300px]",
                isDragging ? "border-primary bg-primary/5" : "border-outline-variant/30 bg-surface-container-low"
              )}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))} className="hidden" multiple accept="image/*,video/*" />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-center">Tarik & Lepas Konten</h3>
              <p className="text-sm text-gray-500 text-center">Klik atau seret file ke sini</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div key={file.id} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border">
                    {file.type === 'video' ? <video src={file.preview} className="w-full h-full object-cover" /> : <img src={file.preview} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/50 space-y-6">

              {/* ✅ Pilih Akun Instagram */}
              <div>
                <label className="text-sm font-bold text-on-surface block mb-2">Akun Instagram</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-primary text-sm font-medium"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>@{acc.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-on-surface">Caption Postingan</label>
                  <button
                    onClick={generateAICaption}
                    disabled={isGenerating || files.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-500 text-white hover:bg-amber-600 disabled:bg-gray-200"
                  >
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {isGenerating ? "AI Berpikir..." : "AI Generate"}
                  </button>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ceritakan sesuatu..."
                  className="w-full h-24 bg-gray-50 rounded-2xl p-4 text-sm outline-none border border-transparent focus:border-primary/30"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3">
                  <CalendarIcon size={18} className="text-primary" /> Tanggal Posting
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium border border-transparent focus:border-primary/30"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-4">
                  <Clock size={18} className="text-primary" /> Pilih Jam Tayang
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center",
                        selectedTime === slot.time ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/50"
                      )}
                    >
                      <div>
                        <div className={cn("text-xs font-bold", selectedTime === slot.time ? "text-primary" : "text-gray-500")}>{slot.label}</div>
                        <div className="text-[10px] text-gray-400">{slot.desc}</div>
                      </div>
                      <div className={cn("text-lg font-black", selectedTime === slot.time ? "text-primary" : "text-gray-300")}>{slot.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedAccountId}
                className="w-full py-4 bg-primary text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {isUploading ? 'Menyimpan...' : 'Jadwalkan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};