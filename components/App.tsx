
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Employee, OapStatus, AppConfig, ArchiveDocument, PromotionRecord, KgbRecord, LeaveRecord, DisciplineRecord, MutationRecord } from './types';
import { Bell } from 'lucide-react';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1',
    nama: 'ADOLO EDISON WORABAY',
    nip: '196802182023211002',
    tempatLahir: 'Jayapura',
    tanggalLahir: '1968-02-18',
    jenisKelamin: 'L',
    agama: 'Kristen',
    statusPegawai: 'PPPK',
    oapStatus: OapStatus.OAP,
    jabatan: 'Analis Kebijakan',
    jenisJabatan: 'FUNGSIONAL',
    unitKerja: 'Biro Umum & Administrasi Pimpinan',
    bagian: 'Kepegawaian',
    pangkat: 'PPPK V',
    golongan: 'V',
    tmtPangkat: '2023-11-01',
    mkgTahun: 0,
    mkgBulan: 0,
    pendidikanTerakhir: 'S1',
    pendidikanJurusan: 'Hukum',
    pendidikanInstitusi: 'UNCEN',
    pendidikanTahunLulus: '1995',
    statusKawin: 'K-2',
    jumlahAnak: 2,
    jumlahJiwa: 4,
    tmtKgb: '2025-11-01',
    tmtJabatan: '2023-11-01'
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Database States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [archives, setArchives] = useState<ArchiveDocument[]>([]);
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [kgbs, setKgbs] = useState<KgbRecord[]>([]);
  const [mutations, setMutations] = useState<MutationRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineRecord[]>([]);
  
  // App Config
  const [config, setConfig] = useState<AppConfig>({
    namaInstansi: 'Biro Umum & Administrasi Pimpinan Provinsi Papua',
    namaKepalaBiro: 'ELPIUS HUGI, S.Pd., M.A',
    nipKepalaBiro: '197503092003121004',
    templateSurat: '800.1.2.5-[NOMOR]/[KODE]/I/2025'
  });

  const [suratTrigger, setSuratTrigger] = useState<{empId: string, type: string} | null>(null);

  useEffect(() => {
    const savedEmp = localStorage.getItem('db_employees');
    const savedArch = localStorage.getItem('db_archives');
    const savedProm = localStorage.getItem('db_promotions');
    const savedKgb = localStorage.getItem('db_kgbs');
    const savedMut = localStorage.getItem('db_mutations');
    const savedLeaves = localStorage.getItem('db_leaves');
    const savedDisciplines = localStorage.getItem('db_disciplines');
    const savedLogin = localStorage.getItem('isLoggedIn');
    
    if (savedEmp) setEmployees(JSON.parse(savedEmp));
    else setEmployees(INITIAL_EMPLOYEES);

    if (savedArch) setArchives(JSON.parse(savedArch));
    if (savedProm) setPromotions(JSON.parse(savedProm));
    if (savedKgb) setKgbs(JSON.parse(savedKgb));
    if (savedMut) setMutations(JSON.parse(savedMut));
    if (savedLeaves) setLeaves(JSON.parse(savedLeaves));
    if (savedDisciplines) setDisciplines(JSON.parse(savedDisciplines));
    if (savedLogin === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => { localStorage.setItem('db_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('db_archives', JSON.stringify(archives)); }, [archives]);
  useEffect(() => { localStorage.setItem('db_promotions', JSON.stringify(promotions)); }, [promotions]);
  useEffect(() => { localStorage.setItem('db_kgbs', JSON.stringify(kgbs)); }, [kgbs]);
  useEffect(() => { localStorage.setItem('db_mutations', JSON.stringify(mutations)); }, [mutations]);
  useEffect(() => { localStorage.setItem('db_leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => { localStorage.setItem('db_disciplines', JSON.stringify(disciplines)); }, [disciplines]);

  const handleActionToSurat = (empId: string, type: string) => {
    setSuratTrigger({ empId, type });
    setActiveTab('esurat');
  };

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogin = (status: boolean) => {
    setIsLoggedIn(status);
    if (status) localStorage.setItem('isLoggedIn', 'true');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard employees={employees} />;
      case 'master_pegawai': return <EmployeeManagement employees={employees} setEmployees={setEmployees} />;
      case 'arsip_digital': return <ArsipDigital employees={employees} archives={archives} setArchives={setArchives} />;
      case 'gaji_tpp': return <PayrollManagement employees={employees} onAction={handleActionToSurat} />;
      case 'esurat': return <ESuratGenerator employees={employees} config={config} trigger={suratTrigger} setTrigger={setSuratTrigger} />;
      case 'monitoring': return <MonitoringView employees={employees} navigateToTab={navigateToTab} />;
      case 'kenaikan_pangkat': return <KenaikanPangkat employees={employees} records={promotions} setRecords={setPromotions} onAction={handleActionToSurat} />;
      case 'kgb': return <KgbManagement employees={employees} records={kgbs} setRecords={setKgbs} onAction={handleActionToSurat} />;
      case 'jabatan_mutasi': return <MutationManagement employees={employees} records={mutations} setRecords={setMutations} onAction={handleActionToSurat} />;
      case 'cuti': return <LeaveManagement employees={employees} records={leaves} setRecords={setLeaves} onAction={handleActionToSurat} />;
      case 'disiplin': return <DisciplineManagement employees={employees} records={disciplines} setRecords={setDisciplines} onAction={handleActionToSurat} />;
      case 'settings': return <SettingsView config={config} setConfig={setConfig} />;
      default: return <Dashboard employees={employees} />;
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-['Inter']">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => { setIsLoggedIn(false); localStorage.removeItem('isLoggedIn'); }} />
      
      <main className="flex-1 ml-64 p-8 relative">
        <header className="flex justify-between items-center mb-10 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-40 py-4 -mx-8 px-8 border-b border-slate-200/30">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize italic">
              {activeTab.replace('_', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-full shadow-sm pr-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center font-black text-xs ring-2 ring-white">A</div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-800 leading-none">Admin Kepegawaian</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Provinsi Papua</p>
              </div>
            </div>
            <button className="relative p-2 bg-white rounded-full border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 transition-colors">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
