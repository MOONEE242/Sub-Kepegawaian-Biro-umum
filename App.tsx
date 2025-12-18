
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import PayrollManagement from './components/PayrollManagement';
import ESuratGenerator from './components/ESuratGenerator';
import MonitoringView from './components/MonitoringView';
import LeaveManagement from './components/LeaveManagement';
import DisciplineManagement from './components/DisciplineManagement';
import SettingsView from './components/SettingsView';
import KenaikanPangkat from './components/KenaikanPangkat';
import KgbManagement from './components/KgbManagement';
import MutationManagement from './components/MutationManagement';
import ArsipDigital from './components/ArsipDigital';
import Login from './components/Login';
import { api } from './src/lib/api';
import { 
  Employee, AppConfig, ArchiveDocument, PromotionRecord, 
  KgbRecord, LeaveRecord, DisciplineRecord, MutationRecord, 
  AuditLog 
} from './types';
import { ShieldCheck, Sun, Moon, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Database States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [archives, setArchives] = useState<ArchiveDocument[]>([]);
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [kgbs, setKgbs] = useState<KgbRecord[]>([]);
  const [mutations, setMutations] = useState<MutationRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [config, setConfig] = useState<AppConfig>({
    namaInstansi: 'Biro Umum & Administrasi Pimpinan Provinsi Papua',
    namaKepalaBiro: 'ELPIUS HUGI, S.Pd., M.A',
    nipKepalaBiro: '197503092003121004',
    templateSurat: '800.1.2.5-[NOMOR]/[KODE]/I/2025'
  });

  const [suratTrigger, setSuratTrigger] = useState<{empId: string, type: string} | null>(null);

  // Sync with Real Database via API
  const fetchData = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    try {
      const [empData, promData, kgbData, leaveData, discData, mutData, archData, logData] = await Promise.all([
        api.get('/employees'),
        api.get('/records/promotions'),
        api.get('/records/kgb'),
        api.get('/records/leaves'),
        api.get('/records/disciplines'),
        api.get('/records/mutations'),
        api.get('/records/archives'),
        api.get('/logs')
      ]);
      setEmployees(empData);
      setPromotions(promData);
      setKgbs(kgbData);
      setLeaves(leaveData);
      setDisciplines(discData);
      setMutations(mutData);
      setArchives(archData);
      setAuditLogs(logData);
    } catch (err) {
      console.error("Gagal sinkronisasi database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateEmployees = async () => {
    await fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const renderContent = () => {
    if (isLoading) return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={40} className="animate-spin text-[#A67153]" />
        <p className="text-[10px] font-black uppercase tracking-widest italic">Akses Sektor Otoritas...</p>
      </div>
    );

    switch (activeTab) {
      case 'dashboard': return <Dashboard employees={employees} />;
      case 'master_pegawai': return <EmployeeManagement employees={employees} setEmployees={handleUpdateEmployees as any} />;
      case 'arsip_digital': return <ArsipDigital employees={employees} archives={archives} setArchives={setArchives as any} />;
      case 'gaji_tpp': return <PayrollManagement employees={employees} onAction={(id, type) => { setSuratTrigger({empId: id, type}); setActiveTab('esurat'); }} />;
      case 'esurat': return <ESuratGenerator employees={employees} config={config} trigger={suratTrigger} setTrigger={setSuratTrigger} />;
      case 'monitoring': return <MonitoringView employees={employees} navigateToTab={setActiveTab} />;
      case 'kenaikan_pangkat': return <KenaikanPangkat employees={employees} records={promotions} setRecords={setPromotions as any} onAction={(id, type) => { setSuratTrigger({empId: id, type}); setActiveTab('esurat'); }} />;
      case 'kgb': return <KgbManagement employees={employees} records={kgbs} setRecords={setKgbs as any} onAction={(id, type) => { setSuratTrigger({empId: id, type}); setActiveTab('esurat'); }} />;
      case 'jabatan_mutasi': return <MutationManagement employees={employees} records={mutations} setRecords={setMutations as any} onAction={(id, type) => { setSuratTrigger({empId: id, type}); setActiveTab('esurat'); }} />;
      case 'cuti': return <LeaveManagement employees={employees} records={leaves} setRecords={setLeaves as any} onAction={(id, type) => { setSuratTrigger({empId: id, type}); setActiveTab('esurat'); }} />;
      case 'disiplin': return <DisciplineManagement employees={employees} records={disciplines} setRecords={setDisciplines as any} onAction={(id, type) => { setSuratTrigger({empId: id, type}); setActiveTab('esurat'); }} />;
      case 'settings': return (
        <SettingsView 
          config={config} setConfig={setConfig} 
          credentials={{} as any} setCredentials={() => {}} 
          logs={auditLogs} onBackup={() => {}} onRestore={() => {}}
        />
      );
      default: return <Dashboard employees={employees} />;
    }
  };

  const BackgroundElements = () => (
    <>
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="spotlight"></div>
    </>
  );

  if (!isLoggedIn) return (
    <>
      <BackgroundElements />
      <Login onLogin={(status) => { if(status) { setIsLoggedIn(true); fetchData(); } }} credentials={{} as any} />
    </>
  );

  return (
    <div className={`flex min-h-screen relative overflow-hidden transition-colors duration-700 ${isDarkMode ? 'dark-mode' : ''}`}>
      <BackgroundElements />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-8 relative z-10">
        <header className="flex justify-between items-center mb-10 sticky top-0 backdrop-blur-md z-40 py-4 -mx-8 px-8 border-b border-white/5">
          <h2 className="text-2xl font-black tracking-tight capitalize italic font-serif-italic">
            {activeTab.replace('_', ' ')}
          </h2>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 glass-panel rounded-full text-[#A67153] hover:scale-110 active:scale-95 transition-all">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center gap-4 p-1 glass-panel rounded-full pr-6">
              <div className="w-10 h-10 bg-[#A67153] text-white rounded-full flex items-center justify-center font-black text-sm shadow-xl">A</div>
              <div className="text-left hidden md:block">
                <p className="text-[10px] font-black leading-none flex items-center gap-1.5 uppercase tracking-wider">
                   ADMIN KEPEGAWAIAN <ShieldCheck size={12} className="text-[#A67153]" />
                </p>
                <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest mt-1">Sektor Otoritas Papua</p>
              </div>
            </div>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
