import React, { useState, useRef } from 'react';
import { TopBar } from '../components/TopBar';
import { cn } from '../lib/utils';
import { Upload, X, Send, Loader2, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export const UploadPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // --- STATE JADWAL GACOR ---
  const [selectedTime, setSelectedTime] = useState('20:00'); // Default Prime Time
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Daftar Jam Gacor (Slot)
  const timeSlots = [
    { label: 'Pagi (Fresh)', time: '09:00', desc: 'Waktunya orang baru masuk kantor' },
    { label: 'Siang (Lunch)', time: '12:30', desc: 'Jam istirahat makan siang' },
    { label: 'Sore (Chill)', time: '18:30', desc: 'Audiens lagi santai pulang kerja' },
    { label: 'Malam (Prime)', time: '20:00', desc: 'Engagement paling tinggi' },
  ];

  // --- FUNGSI UPLOAD KE DATABASE ---
  const handleUpload = async () => {
    if (files.length === 0) return alert("Pilih minimal satu foto atau video!");
    if (!caption.trim()) return alert("Tulis caption-mu dulu biar kontennya menarik!");

    setIsUploading(true);
    try {
      // Gabungkan tanggal hari ini dengan jam gacor yang dipilih
      const today = new Date();
      const [hours, minutes] = selectedTime.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), 0);

      const payload = {
        user_id: 1,
        instagram_account_id: 1,
        media_url: files[0].preview,
        caption: caption,
        status: 'scheduled',
        scheduled_at: today.toISOString(), // Jam gacor dinamis
      };

      const response = await axios.post('http://localhost:5000/api/posts', payload);
      
      if (response.status === 201) {
        alert(`✅ Mantap! Postingan dijadwalkan jam ${selectedTime}`);
        
        // Bersihkan form
        setFiles([]);
        setCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Gagal ngirim ke server. Cek koneksi!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const mappedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }));
    setFiles(prev => [...prev, ...mappedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 lg:pb-8"
    >
      <TopBar 
        title="Upload Bahan Konten" 
        subtitle="Siapkan materi terbaikmu untuk postingan selanjutnya." 
      />

      <div className="px-6 pt-4 lg:pt-8 max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Upload Area */}
          <div className="lg:col-span-7 space-y-6">
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[300px]",
                isDragging 
                  ? "border-primary bg-primary/5 scale-[0.98]" 
                  : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high"
              )}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple accept="image/*,video/*" />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Tarik & Lepas Konten</h3>
              <p className="text-on-surface-variant text-sm text-center">Maks. 50MB per file</p>
            </div>

            {/* Preview Grid */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                      {file.type === 'video' ? <video src={file.preview} className="w-full h-full object-cover" /> : <img src={file.preview} className="w-full h-full object-cover" alt="Preview" />}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Kolom Kanan: Detail & Jam Gacor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10 space-y-6">
              {/* Bagian Caption */}
              <div>
                <label className="block text-sm font-bold mb-2 text-on-surface">Caption Postingan</label>
                <textarea 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tulis caption menarik di sini..."
                  className="w-full h-24 bg-surface-container-low rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              {/* BAGIAN JADWAL GACOR */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-4 text-on-surface">
                  <Clock size={18} className="text-primary" />
                  Waktu Posting Tergacor
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {timeSlots.map((slot) => (
                    <div 
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center",
                        selectedTime === slot.time 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-outline-variant/20 hover:border-primary/20"
                      )}
                    >
                      <div>
                        <div className="text-xs font-bold uppercase text-primary/70">{slot.label}</div>
                        <div className="text-[10px] text-on-surface-variant leading-tight">{slot.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-lg font-black tracking-tight", selectedTime === slot.time ? "text-primary" : "text-on-surface-variant")}>
                          {slot.time}
                        </div>
                        {selectedTime === slot.time && <CheckCircle2 size={16} className="text-primary ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className={cn(
                  "w-full py-4 bg-primary text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition-all",
                  isUploading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110 active:scale-95 shadow-primary/20"
                )}
              >
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {isUploading ? 'Sedang Memproses...' : 'Siapkan Postingan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};