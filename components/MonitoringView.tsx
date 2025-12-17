
import React from 'react';
import { Employee } from '../types';
import { Activity, Bell, Calendar, ChevronRight, FileWarning, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface MonitoringViewProps {
  employees: Employee[];
  navigateToTab: (tab: string) => void;
}

const LevelBadge = ({ level }: { level: string }) => {
  switch (level) {
    case 'H-30': return <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">KRITIS H-30</span>;
    case 'H-90': return <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">WASPADA H-90</span>;
    case 'H-180': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">SIAGA H-180</span>;
    default: return <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest">{level}</span>;
  }
};

const MonitoringView: React.FC<MonitoringViewProps> = ({ employees, navigateToTab }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">System Intelligence</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Pusat Notifikasi & Kontrol</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KGB Alerts */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200/50 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase text-xs tracking-widest">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              Akan KGB
            </h3>
            <span className="bg-red-50 text-red-700 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Kebutuhan Mendesak</span>
          </div>
          <div className="space-y-4">
            {employees.slice(0, 3).map((emp, i) => (
              <div key={i} className="flex flex-col gap-3 p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors text-sm uppercase italic leading-tight">{emp.nama}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">TMT Berikutnya: {emp.tmtKgb}</p>
                  </div>
                  <LevelBadge level={i === 0 ? 'H-30' : 'H-90'} />
                </div>
                <button 
                  onClick={() => navigateToTab('kgb')}
                  className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-all mt-2"
                >
                  Perbaiki Sekarang <ArrowRight size={12}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion Alerts */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200/50 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase text-xs tracking-widest">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              Naik Pangkat
            </h3>
            <span className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Periode April</span>
          </div>
          <div className="space-y-4">
            {employees.slice(1, 4).map((emp, i) => (
              <div key={i} className="flex flex-col gap-3 p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors text-sm uppercase italic leading-tight">{emp.nama}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Gol: {emp.golongan} → Usulan Baru</p>
                  </div>
                  <LevelBadge level='H-180' />
                </div>
                <button 
                  onClick={() => navigateToTab('kenaikan_pangkat')}
                  className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-all mt-2"
                >
                  Proses Usulan <ArrowRight size={12}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Archive Incomplete */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200/50 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase text-xs tracking-widest">
              <FileWarning className="text-amber-500" size={18} />
              Arsip Audit
            </h3>
            <span className="bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Data Tidak Lengkap</span>
          </div>
          <div className="space-y-4">
            {employees.slice(0, 3).map((emp, i) => (
              <div key={i} className="flex flex-col gap-3 p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group">
                <div>
                  <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors text-sm uppercase italic leading-tight">{emp.nama}</p>
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                    <AlertCircle size={12}/> Hilang: SK PNS, K4 (KK)
                  </p>
                </div>
                <button 
                  onClick={() => navigateToTab('arsip_digital')}
                  className="flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase tracking-widest hover:translate-x-1 transition-all mt-2"
                >
                  Lengkapi Berkas <ArrowRight size={12}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[60px] flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full -mr-40 -mt-40"></div>
        <div className="relative z-10 flex items-center gap-10">
          <div className="w-28 h-28 bg-white/5 backdrop-blur-3xl rounded-[40px] flex items-center justify-center border border-white/10 shadow-2xl group transition-all duration-500 hover:rotate-6">
            <ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-all" size={56} />
          </div>
          <div>
            <h3 className="text-4xl font-black tracking-tighter mb-4 italic">Integrity Score: 98.4%</h3>
            <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed italic opacity-80">Sistem validasi BKN 2025 mendeteksi tingkat akurasi administrasi yang sangat baik. Selesaikan notifikasi kritis untuk mencapai skor sempurna.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 relative z-10 w-full md:w-auto">
          <button className="bg-white text-slate-900 px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Laporan Audit PDF</button>
          <button className="bg-white/10 border border-white/10 backdrop-blur-md text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.25em] hover:bg-white/20 transition-all">Audit Trail System</button>
        </div>
      </div>
    </div>
  );
};

export default MonitoringView;
