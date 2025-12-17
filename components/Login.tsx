
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, User, Lock, Eye, EyeOff, HelpCircle, 
  ChevronRight, AlertCircle 
} from 'lucide-react';
import { AdminCredentials } from '../types';

interface LoginProps {
  onLogin: (status: boolean) => void;
  credentials: AdminCredentials;
}

const Login: React.FC<LoginProps> = ({ onLogin, credentials }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (username === credentials.username && password === credentials.password) {
        onLogin(true);
      } else {
        setError('Kredensial Tidak Terverifikasi Oleh Otoritas.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[1100px] glass-panel rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row z-10 border-white/20"
      >
        
        {/* Sisi Kiri: Visual Identity */}
        <div className="w-full md:w-[45%] bg-[#403433] p-16 text-[#F2F2F2] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A67153]/20 blur-[120px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6 mb-20"
            >
              <h1 className="font-black text-2xl tracking-tighter leading-none italic uppercase font-serif-italic">Simpeg<br/><span className="text-[11px] text-[#A69485] not-italic tracking-[0.4em] uppercase">Papua</span></h1>
            </motion.div>
            
            <h2 className="text-6xl font-serif-italic mb-10 leading-[1.05] tracking-tight">
              Otoritas <br/> 
              <span className="text-[#A67153]">Manajemen</span> <br/>
              ASN Digital.
            </h2>
            <p className="text-[#A69485] text-sm leading-relaxed font-medium max-w-[280px] italic opacity-80">
              Gerbang akses eksklusif administrasi Biro Umum & Administrasi Pimpinan Provinsi Papua.
            </p>
          </div>
          
          <div className="relative z-10 pt-10 border-t border-white/10 flex items-center justify-between">
            <p className="text-[9px] text-[#A69485] uppercase font-black tracking-[0.4em]">Enterprise Access &bull; v2.0</p>
          </div>
        </div>

        {/* Sisi Kanan: Interaction Form */}
        <div className="w-full md:w-[55%] p-16 md:p-24 bg-white/10 flex flex-col justify-center relative backdrop-blur-3xl">
          <div className="mb-14">
            <span className="px-5 py-2 bg-[#A67153]/10 text-[#A67153] rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Security Protocol Active</span>
            <h3 className="text-4xl font-black text-[#403433] tracking-tighter uppercase italic font-serif-italic leading-none">Akses Otoritas</h3>
            <p className="opacity-60 font-medium text-sm mt-3 italic">Validasi kredensial administrator biro.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">ID Pengguna Sistem</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A69485] group-focus-within:text-[#A67153] transition-colors" size={22} />
                <input 
                  type="text" required placeholder="admin"
                  className="w-full pl-16 pr-8 py-6 bg-white/50 border border-[#A69485]/20 rounded-[30px] focus:outline-none focus:ring-4 focus:ring-[#A67153]/10 focus:bg-white transition-all font-bold text-[#403433] shadow-inner"
                  value={username} onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Kunci Keamanan</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A69485] group-focus-within:text-[#A67153] transition-colors" size={22} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full pl-16 pr-16 py-6 bg-white/50 border border-[#A69485]/20 rounded-[30px] focus:outline-none focus:ring-4 focus:ring-[#A67153]/10 focus:bg-white transition-all font-bold text-[#403433] shadow-inner"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A69485] hover:text-[#A67153] p-2">
                  {showPassword ? <EyeOff size={22}/> : <Eye size={22}/>}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-5 bg-red-500/5 text-red-600 rounded-[25px] text-xs font-black uppercase tracking-widest flex items-center gap-4 border border-red-500/10 italic">
                <AlertCircle size={20} /> {error}
              </motion.div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full py-7 bg-[#403433] hover:bg-[#A67153] text-white rounded-[30px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-[#403433]/30 active:scale-95 disabled:opacity-50"
            >
              {loading ? <div className="w-6 h-6 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div> : <><ShieldCheck size={22} /> Validasi Sesi Digital</>}
            </button>
          </form>

          <div className="mt-16 text-center">
             <button className="text-[10px] font-black text-[#A69485] uppercase tracking-[0.4em] hover:text-[#A67153] transition-all flex items-center gap-3 mx-auto group">
               <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" /> 
               Bantuan Akses Otoritas
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
