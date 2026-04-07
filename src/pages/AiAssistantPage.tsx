import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Sparkles, User, Bot, PlusCircle, 
  Image as ImageIcon, Hash, Lightbulb, 
  ChevronLeft, Loader2, Lock, LayoutDashboard, Flame
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantPage = () => {
  // State Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: 'assistant', 
      content: 'Halo! Saya asisten AI-mu. Ada yang bisa saya bantu buat konten hari ini?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const N8N_WEBHOOK_URL = "https://n8n-n8n.wrmm9a.easypanel.host/webhook/ai-assistant";

  // Cek Status Login
  useEffect(() => {
    const savedUser = localStorage.getItem('user_name');
    if (savedUser) {
      setIsLoggedIn(true);
      setUserName(savedUser);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(N8N_WEBHOOK_URL, {
        message: textToSend,
        user: isLoggedIn ? userName : "Guest"
      });

      const rawData = response.data;
      let aiContent = Array.isArray(rawData) ? (rawData[0].output || rawData[0].text) : (rawData.output || rawData.text);

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: aiContent || "Maaf, respon tidak terbaca." 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Gagal konek ke AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const menuFitur = [
    { label: "Bikin Postingan", icon: <PlusCircle size={18} />, protected: true },
    { label: "Heatmap", icon: <Flame size={18} />, protected: true },
    { label: "AI Assistant", icon: <Sparkles size={18} />, protected: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen bg-background">
      
      {/* Header Dinamis */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-outline-variant z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-on-surface">
              {isLoggedIn ? `Halo, ${userName}` : "Halo, Mau Ngonten Apa Hari Ini?"}
            </h1>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              {isLoggedIn ? "SiKreator Member" : "Guest Mode"}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-outline-variant p-6 flex-col gap-2 bg-surface-container-lowest">
          {menuFitur.map((item, i) => (
            <button
              key={i}
              disabled={item.protected && !isLoggedIn}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all",
                item.protected && !isLoggedIn 
                  ? "text-outline cursor-not-allowed opacity-40" 
                  : "text-on-surface-variant hover:bg-primary/10 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon} {item.label}
              </div>
              {item.protected && !isLoggedIn && <Lock size={14} />}
            </button>
          ))}
        </aside>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 bg-surface-container-low/30">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse ml-auto" : "mr-auto")}
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", 
                    msg.role === 'user' ? "bg-secondary-container text-secondary" : "bg-primary text-white")}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn("p-4 rounded-2xl text-sm border shadow-sm", 
                    msg.role === 'user' ? "bg-surface-container-lowest border-outline-variant rounded-tr-none" : "bg-white border-primary/10 rounded-tl-none")}>
                    {msg.role === 'assistant' ? (
                      <article className="prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </article>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-outline-variant pb-10 lg:pb-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-surface-container-low p-2 rounded-2xl border border-outline-variant focus-within:border-primary focus-within:bg-white transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya ide konten..."
              className="flex-1 bg-transparent border-none outline-none text-sm px-3"
            />
            <button type="submit" className="p-3 bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};