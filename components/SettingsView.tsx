
import React, { useState, useEffect, useRef } from 'react';
import { AppConfig, AdminCredentials, AuditLog } from '../types';
import { 
  Settings, Save, Shield, Database, Globe, Eye, EyeOff, Lock, User, 
  KeyRound, CheckCircle, AlertCircle, ListRestart, History, Search, UploadCloud, DownloadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsViewProps {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  credentials: AdminCredentials;
  setCredentials: (creds: AdminCredentials) => void;
  logs: AuditLog[];
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, setConfig, credentials, setCredentials, logs, onBackup, onRestore }) => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [tempCreds, setTempCreds] = useState<AdminCredentials>(credentials);
  const [confirmPassword, setConfirmPassword] = useState(credentials.password);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [logFilter, setLogFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempCreds(credentials);
    setConfirmPassword(credentials.password);
  }, [credentials]);

  const handleUpdateCredentials = () => {
    setErrorMessage('');
    if (tempCreds.username.length < 3) {
      setErrorMessage("Username minimal 3 karakter.");
      return;
    }
    if (tempCreds.password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok!");
      return;
    }
    setSaveStatus('saving');
    setTimeout(() => {
      setCredentials(tempCreds);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(logFilter.toLowerCase()) || 
    log.module.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.details.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#403433] dark:text-[#F2F2F2] tracking-tight uppercase italic font-serif-italic">Sistem Kontrol & Database</h2>
          <p className="opacity-60 font-medium text-sm italic">Konfigurasi otoritas, keamanan, dan pemeliharaan data sektor.</p>
        </div>
        <div className="flex gap-3">
          <input type="file" ref={fileInputRef} onChange={onRestore} className="hidden" accept=".json" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border border-[#A69485]/30 text-[#403433] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-sm hover:bg-[#F2F2F2] transition-all"
          >
            <UploadCloud size={16} /> Restore Database
          </button>
          <button 
            onClick={onBackup}
            className="bg-[#A67153] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
          >
            <DownloadCloud size={18} /> Backup Database
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-10 rounded-[40px] space-y-8">
            <h3 className="font-black text-[#403433] dark:text-[#F2F2F2] flex items-center gap-3 uppercase text-[10px] tracking-[0.2em] italic font-serif-italic">
              <Globe size={18} className="text-[#A67153]" /> Profil Instansi
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Nama Organisasi</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-white/50 border border-[#A69485]/20 rounded-2xl font-bold text-[#403433]"
                  value={config.namaInstansi}
                  onChange={(e) => setConfig({...config, namaInstansi: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Kepala Biro</label>
                  <input type="text" className="w-full px-6 py-4 bg-white/50 border border-[#A69485]/20 rounded-2xl font-bold" value={config.namaKepalaBiro} onChange={(e) => setConfig({...config, namaKepalaBiro: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">NIP Kepala Biro</label>
                  <input type="text" className="w-full px-6 py-4 bg-white/50 border border-[#A69485]/20 rounded-2xl font-bold" value={config.nipKepalaBiro} onChange={(e) => setConfig({...config, nipKepalaBiro: e.target.value})}/>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#403433] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A67153]/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            <h3 className="font-black text-xl tracking-tight uppercase italic font-serif-italic mb-8 relative z-10 flex items-center gap-3">
              <Shield size={24} className="text-[#A67153]" /> Akses Otoritas Admin
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">ID Pengguna</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm"
                  value={tempCreds.username}
                  onChange={(e) => setTempCreds({...tempCreds, username: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Password Baru</label>
                  <div className="relative">
                    <input 
                      type={showCredentials ? "text" : "password"} 
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm"
                      value={tempCreds.password}
                      onChange={(e) => setTempCreds({...tempCreds, password: e.target.value})}
                    />
                    <button onClick={() => setShowCredentials(!showCredentials)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">
                      {showCredentials ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Konfirmasi</label>
                  <input type={showCredentials ? "text" : "password"} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
              </div>
              {errorMessage && <p className="text-red-400 text-[10px] font-black uppercase flex items-center gap-2 italic"><AlertCircle size={14} /> {errorMessage}</p>}
              <button 
                onClick={handleUpdateCredentials}
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all ${saveStatus === 'success' ? 'bg-emerald-600' : 'bg-[#A67153] hover:bg-[#734B3D]'}`}
              >
                {saveStatus === 'saving' ? 'Memproses...' : saveStatus === 'success' ? 'Kredensial Diperbarui' : 'Simpan Kredensial Baru'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="glass-panel p-10 rounded-[40px] h-full flex flex-col max-h-[700px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-[#403433] dark:text-[#F2F2F2] flex items-center gap-3 uppercase text-[10px] tracking-[0.2em] italic font-serif-italic">
                <History size={18} className="text-[#A67153]" /> Log Aktivitas Sektor
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={12} />
                <input type="text" placeholder="Cari Log..." className="pl-8 pr-4 py-2 bg-white border border-[#A69485]/10 rounded-full text-[10px] font-bold outline-none" value={logFilter} onChange={e => setLogFilter(e.target.value)}/>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 opacity-20"><ListRestart size={32} /><p className="text-[10px] font-black uppercase mt-4 tracking-widest">Tidak ada aktivitas.</p></div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className="p-4 bg-white/40 rounded-2xl border border-[#A69485]/10 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${log.action === 'DELETE' ? 'bg-red-100 text-red-600' : 'bg-[#A67153]/10 text-[#A67153]'}`}>{log.action}</span>
                      <span className="text-[8px] opacity-40 uppercase italic font-bold">{log.timestamp}</span>
                    </div>
                    <p className="text-[10px] font-black text-[#403433] opacity-80 uppercase leading-tight italic">{log.details}</p>
                    <p className="text-[8px] opacity-30 font-bold uppercase mt-2">{log.module} • {log.user}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
