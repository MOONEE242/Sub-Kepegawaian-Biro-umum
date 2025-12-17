
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, PromotionRecord, PangkatStatus } from '../types';
import { TrendingUp, Plus, FileText, ChevronRight, Clock, ShieldCheck, XCircle, FileCheck, Info } from 'lucide-react';

interface KenaikanPangkatProps {
  employees: Employee[];
  records: PromotionRecord[];
  setRecords: React.Dispatch<React.SetStateAction<PromotionRecord[]>>;
  onAction: (empId: string, type: string) => void;
}

const KenaikanPangkat: React.FC<KenaikanPangkatProps> = ({ employees, records, setRecords, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsulan, setNewUsulan] = useState<Partial<PromotionRecord>>({
    employeeId: '',
    periode: 'APRIL',
    tahun: 2025,
    status: 'DRAFT'
  });

  const handleSelectEmployee = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setNewUsulan({
        ...newUsulan,
        employeeId: empId,
        pangkatLama: emp.pangkat,
        golLama: emp.golongan,
        tmtLama: emp.tmtPangkat
      });
    }
  };

  const handleAdd = () => {
    if (!newUsulan.employeeId || !newUsulan.pangkatBaru) {
      alert("Lengkapi data usulan!");
      return;
    }
    
    const rec: PromotionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: newUsulan.employeeId as string,
      periode: newUsulan.periode as any,
      tahun: newUsulan.tahun as number,
      pangkatLama: newUsulan.pangkatLama as string,
      golLama: newUsulan.golLama as string,
      tmtLama: newUsulan.tmtLama as string,
      pangkatBaru: newUsulan.pangkatBaru as string,
      golBaru: newUsulan.golBaru as string,
      tmtBaru: newUsulan.tmtBaru as string,
      status: newUsulan.status as PangkatStatus,
      catatan: newUsulan.catatan
    };
    
    setRecords(prev => [...prev, rec]);
    setIsModalOpen(false);
    setNewUsulan({ periode: 'APRIL', tahun: 2025, status: 'DRAFT' });
  };

  const handleUpdateStatus = (id: string, status: PangkatStatus) => {
    setRecords(prev => prev.map(r => r.id === id ? {...r, status} : r));
  };

  const getStatusStyle = (status: PangkatStatus) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'DIAJUKAN': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DIVERIFIKASI': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'DISETUJUI': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'DITOLAK': return 'bg-red-50 text-red-600 border-red-100';
      case 'SELESAI': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-[#403433] dark:text-[#F2F2F2] italic uppercase tracking-tight font-serif-italic">Kenaikan Pangkat</h3>
          <p className="opacity-60 font-medium italic">Manajemen usulan periode April & Oktober.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#403433] text-white px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-[#A67153] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} /> Tambah Usulan
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[40px] border border-[#A69485]/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F2F2F2] text-[#A69485] font-black uppercase text-[10px] tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Pegawai</th>
              <th className="px-8 py-6">Periode Usulan</th>
              <th className="px-8 py-6">Status Alur Kerja</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-[#A69485] font-black uppercase italic tracking-widest">
                  Belum ada usulan pangkat tercatat.
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const emp = employees.find(e => e.id === rec.employeeId);
                return (
                  <tr key={rec.id} className="hover:bg-white transition-all group">
                    <td className="px-8 py-6">
                      <p className="font-black text-[#403433] uppercase italic leading-tight">{emp?.nama}</p>
                      <p className="text-[#A69485] text-[9px] font-bold uppercase mt-1">NIP. {emp?.nip}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-[#403433] uppercase text-xs tracking-widest">{rec.periode} {rec.tahun}</p>
                      <p className="text-[10px] text-[#A69485] font-bold uppercase mt-0.5">{rec.golLama} → {rec.golBaru}</p>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={rec.status} 
                        onChange={(e) => handleUpdateStatus(rec.id, e.target.value as PangkatStatus)}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase outline-none border transition-all ${getStatusStyle(rec.status)}`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="DIAJUKAN">DIAJUKAN</option>
                        <option value="DIVERIFIKASI">DIVERIFIKASI</option>
                        <option value="DISETUJUI">DISETUJUI</option>
                        <option value="DITOLAK">DITOLAK</option>
                        <option value="SELESAI">SELESAI</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => onAction(rec.employeeId, 'SK_PANGKAT')}
                        className="bg-[#403433] text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 ml-auto shadow-lg hover:bg-[#A67153] transition-all"
                      >
                        <FileText size={14} /> Buat SK <ChevronRight size={12}/>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#403433]/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-[50px] p-10 space-y-8 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4 font-serif-italic">
                  <div className="w-12 h-12 bg-[#403433] rounded-2xl flex items-center justify-center text-white"><TrendingUp size={24}/></div>
                  Usulan Pangkat Baru
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-xl font-black">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                <div className="p-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl flex items-center gap-3">
                  <Info className="text-[#A67153]" size={18} />
                  <p className="text-[10px] font-bold text-[#A69485] uppercase tracking-widest">Sistem akan mengisi data pangkat lama secara otomatis setelah pegawai dipilih.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Pilih Pegawai (Auto-fill)</label>
                  <select 
                    className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase"
                    value={newUsulan.employeeId}
                    onChange={e => handleSelectEmployee(e.target.value)}
                  >
                    <option value="">Cari Pegawai...</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.nama} - {e.nip}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Periode</label>
                    <select className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase" value={newUsulan.periode} onChange={e => setNewUsulan({...newUsulan, periode: e.target.value as any})}>
                      <option value="APRIL">APRIL</option>
                      <option value="OKTOBER">OKTOBER</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Tahun</label>
                    <input type="number" className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs" value={newUsulan.tahun} onChange={e => setNewUsulan({...newUsulan, tahun: Number(e.target.value)})}/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Pangkat Baru</label>
                    <input className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase" placeholder="Contoh: Pembina Utama" value={newUsulan.pangkatBaru} onChange={e => setNewUsulan({...newUsulan, pangkatBaru: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Golongan Baru</label>
                    <input className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase" placeholder="Contoh: IV/e" value={newUsulan.golBaru} onChange={e => setNewUsulan({...newUsulan, golBaru: e.target.value})}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">TMT Pangkat Baru</label>
                  <input type="date" className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs" value={newUsulan.tmtBaru} onChange={e => setNewUsulan({...newUsulan, tmtBaru: e.target.value})}/>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Catatan / Alasan</label>
                  <textarea rows={3} className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase" value={newUsulan.catatan} onChange={e => setNewUsulan({...newUsulan, catatan: e.target.value})}/>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-[#F2F2F2] rounded-[24px] font-black text-[10px] uppercase tracking-widest">Batal</button>
                <button onClick={handleAdd} className="flex-1 py-5 bg-[#403433] text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[#A67153] transition-all">Simpan Usulan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KenaikanPangkat;
