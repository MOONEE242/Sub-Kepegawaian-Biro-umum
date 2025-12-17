
import React, { useState, useEffect, useCallback } from 'react';
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
import { 
  Employee, AppConfig, ArchiveDocument, PromotionRecord, 
  KgbRecord, LeaveRecord, DisciplineRecord, MutationRecord, 
  AdminCredentials, AuditLog 
} from './types';
import { ShieldCheck, Sun, Moon } from 'lucide-react';

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'Papua2025'
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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Database States (Initialized as Empty for Clean Deploy)
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [archives, setArchives] = useState<ArchiveDocument[]>([]);
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [kgbs, setKgbs] = useState<KgbRecord[]>([]);
  const [mutations, setMutations] = useState<MutationRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineRecord[]>([]);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(DEFAULT_CREDENTIALS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [config, setConfig] = useState<AppConfig>({
    namaInstansi: 'Biro Umum & Administrasi Pimpinan Provinsi Papua',
    namaKepalaBiro: 'ELPIUS HUGI, S.Pd., M.A',
    nipKepalaBiro: '197503092003121004',
    templateSurat: '800.1.2.5-[NOMOR]/[KODE]/I/2025'
  });

  const [suratTrigger, setSuratTrigger] = useState<{empId: string, type: string} | null>(null);

  // Load Database from LocalStorage on Mount
  useEffect(() => {
    const keys = [
      'db_employees', 'db_archives', 'db_promotions', 'db_kgbs', 
      'db_mutations', 'db_leaves', 'db_disciplines', 'db_audit_logs',
      'admin_creds', 'app_config', 'isLoggedIn', 'theme'
    ];
    
    const savedEmp = localStorage.getItem('db_employees');
    const savedArch = localStorage.getItem('db_archives');
    const savedProm = localStorage.getItem('db_promotions');
    const savedKgb = localStorage.getItem('db_kgbs');
    const savedMut = localStorage.getItem('db_mutations');
    const savedLeaves = localStorage.getItem('db_leaves');
    const savedDisc = localStorage.getItem('db_disciplines');
    const savedLogs = localStorage.getItem('db_audit_logs');
    const savedCreds = localStorage.getItem('admin_creds');
    const savedConfig = localStorage.getItem('app_config');
    const savedLogin = localStorage.getItem('isLoggedIn');
    const savedTheme = localStorage.getItem('theme');

    if (savedEmp) setEmployees(JSON.parse(savedEmp));
    if (savedArch) setArchives(JSON.parse(savedArch));
    if (savedProm) setPromotions(JSON.parse(savedProm));
    if (savedKgb) setKgbs(JSON.parse(savedKgb));
    if (savedMut) setMutations(JSON.parse(savedMut));
    if (savedLeaves) setLeaves(JSON.parse(savedLeaves));
    if (savedDisc) setDisciplines(JSON.parse(savedDisc));
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
    if (savedCreds) setAdminCredentials(JSON.parse(savedCreds));
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedLogin === 'true') setIsLoggedIn(true);
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  // Sync Database to LocalStorage on Change
  useEffect(() => { localStorage.setItem('db_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('db_archives', JSON.stringify(archives)); }, [archives]);
  useEffect(() => { localStorage.setItem('db_promotions', JSON.stringify(promotions)); }, [promotions]);
  useEffect(() => { localStorage.setItem('db_kgbs', JSON.stringify(kgbs)); }, [kgbs]);
  useEffect(() => { localStorage.setItem('db_mutations', JSON.stringify(mutations)); }, [mutations]);
  useEffect(() => { localStorage.setItem('db_leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => { localStorage.setItem('db_disciplines', JSON.stringify(disciplines)); }, [disciplines]);
  useEffect(() => { localStorage.setItem('db_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('admin_creds', JSON.stringify(adminCredentials)); }, [adminCredentials]);
  useEffect(() => { localStorage.setItem('app_config', JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);

  // Global Mouse Tracking for Spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--x', `${e.clientX}px`);
      document.body.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [isDarkMode]);

  const addLog = useCallback((action: AuditLog['action'], module: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('id-ID'),
      user: adminCredentials.username,
      action, module, details
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 100));
  }, [adminCredentials.username]);

  const handleActionToSurat = (empId: string, type: string) => {
    setSuratTrigger({ empId, type });
    setActiveTab('esurat');
    addLog('GENERATE_SK', 'E-SURAT', `Memicu pembuatan draf ${type} untuk Pegawai ID: ${empId}`);
  };

  const handleBackup = () => {
    const database = {
      employees, archives, promotions, kgbs, mutations, leaves, disciplines, auditLogs, config, adminCredentials
    };
    const blob = new Blob([JSON.stringify(database, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SIMPEG_PAPUA_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    addLog('BACKUP', 'SYSTEM', 'Database diekspor ke file JSON.');
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.employees) setEmployees(data.employees);
        if (data.archives) setArchives(data.archives);
        if (data.promotions) setPromotions(data.promotions);
        if (data.kgbs) setKgbs(data.kgbs);
        if (data.mutations) setMutations(data.mutations);
        if (data.leaves) setLeaves(data.leaves);
        if (data.disciplines) setDisciplines(data.disciplines);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.config) setConfig(data.config);
        alert('Database berhasil dipulihkan!');
        addLog('UPDATE', 'SYSTEM', 'Database dipulihkan dari file backup.');
      } catch (err) {
        alert('File tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  const handleLogin = (status: boolean) => {
    setIsLoggedIn(status);
    if (status) {
      localStorage.setItem('isLoggedIn', 'true');
      addLog('LOGIN', 'AUTH', 'Login berhasil.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard employees={employees} />;
      case 'master_pegawai': return <EmployeeManagement employees={employees} setEmployees={setEmployees} />;
      case 'arsip_digital': return <ArsipDigital employees={employees} archives={archives} setArchives={setArchives} />;
      case 'gaji_tpp': return <PayrollManagement employees={employees} onAction={handleActionToSurat} />;
      case 'esurat': return <ESuratGenerator employees={employees} config={config} trigger={suratTrigger} setTrigger={setSuratTrigger} />;
      case 'monitoring': return <MonitoringView employees={employees} navigateToTab={setActiveTab} />;
      case 'kenaikan_pangkat': return <KenaikanPangkat employees={employees} records={promotions} setRecords={setPromotions} onAction={handleActionToSurat} />;
      case 'kgb': return <KgbManagement employees={employees} records={kgbs} setRecords={setKgbs} onAction={handleActionToSurat} />;
      case 'jabatan_mutasi': return <MutationManagement employees={employees} records={mutations} setRecords={setMutations} onAction={handleActionToSurat} />;
      case 'cuti': return <LeaveManagement employees={employees} records={leaves} setRecords={setLeaves} onAction={handleActionToSurat} />;
      case 'disiplin': return <DisciplineManagement employees={employees} records={disciplines} setRecords={setDisciplines} onAction={handleActionToSurat} />;
      case 'settings': return (
        <SettingsView 
          config={config} setConfig={setConfig} 
          credentials={adminCredentials} setCredentials={setAdminCredentials} 
          logs={auditLogs} onBackup={handleBackup} onRestore={handleRestore}
        />
      );
      default: return <Dashboard employees={employees} />;
    }
  };

  if (!isLoggedIn) return (
    <>
      <BackgroundElements />
      <Login onLogin={handleLogin} credentials={adminCredentials} />
    </>
  );

  return (
    <div className="flex min-h-screen relative overflow-hidden transition-colors duration-700">
      <BackgroundElements />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => { 
        setIsLoggedIn(false); 
        localStorage.removeItem('isLoggedIn'); 
        addLog('LOGIN', 'AUTH', 'Logout berhasil.');
      }} />
      <main className="flex-1 ml-64 p-8 relative z-10">
        <header className="flex justify-between items-center mb-10 sticky top-0 backdrop-blur-md z-40 py-4 -mx-8 px-8 border-b border-white/5">
          <h2 className="text-2xl font-black tracking-tight capitalize italic font-serif-italic">
            {activeTab.replace('_', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 glass-panel rounded-full text-[#A67153] hover:scale-110 active:scale-95 transition-all shadow-xl">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center gap-4 p-1 glass-panel rounded-full pr-6">
              <div className="w-10 h-10 bg-[#A67153] text-white rounded-full flex items-center justify-center font-black text-sm shadow-xl">
                {adminCredentials.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[10px] font-black leading-none flex items-center gap-1.5 uppercase tracking-wider">
                   {adminCredentials.username} <ShieldCheck size={12} className="text-[#A67153]" />
                </p>
                <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest mt-1">Sektor Otoritas</p>
              </div>
            </div>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="h-full">
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
