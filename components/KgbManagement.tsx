
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, KgbRecord } from '../types';
import { History, Plus, AlertCircle, FileText, ChevronRight, Zap, Info } from 'lucide-react';

interface KgbManagementProps {
  employees: Employee[];
  records: KgbRecord[];
  setRecords: React.Dispatch<React.SetStateAction<KgbRecord[]>>;
  onAction: (empId: string, type: string) => void;
}

const KGB_TEMPLATES: Record<string, { gajiLama: number; gajiBaru: number }> = {
  "PNS_GOL_III_D": { gajiLama: 5200000, gajiBaru: 5400000 },
  "PPPK_GOL_V": { gajiLama: 4500000, gajiBaru: 4700000 },
  "TENAGA_KONTRAK": { gajiLama: 3000000, gajiBaru: 3200000 },
};

const KgbManagement: React.FC<KgbManagementProps> = ({ employees, records, setRecords, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<KgbRecord>>({
    employeeId: '',
    gajiLama: 0,
    gajiBaru: 0,
    tmtBaru: new Date().toISOString().split('T')[0]
  });

  const applyTemplate = (key: string) => {
    const template = KGB_TEMPLATES[key];
    if (template) {
      setFormData(prev => ({ 
        ...prev, 
        gajiLama: template.gajiLama, 
        gajiBaru: template.gajiBaru 
      }));
    }
  };

  const handleAdd = () => {
    if (!formData.employeeId || !formData.gajiBaru) {
      alert("Lengkapi data KGB!");
      return;
    }
    
    const rec: KgbRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: formData.employeeId as string,
      gajiLama: Number(formData.gajiLama),
      gajiBaru: Number(formData.gajiBaru),
      tmtLama: formData.tmtLama || '',
      tmtBaru: formData.tmtBaru as string,
      status: 'SELESAI'
    };
    
    setRecords(prev => [...prev, rec]);
    setIsModalOpen(false);
    setFormData({ gajiLama: 0, gajiBaru: 0, tmtBaru: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Kenaikan Gaji Berkala</h3>
          <p className="text-slate-500 font-medium italic">Hak keuangan ASN setiap 2 tahun masa kerja.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} /> Tambah KGB
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Pegawai</th>
              <th className="px-8 py-6">TMT KGB Baru</th>
              <th className="px-8 py-6">Perubahan Gaji</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black uppercase italic tracking-widest">
                  Belum ada data KGB tercatat.
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const emp = employees.find(e => e.id === rec.employeeId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 uppercase italic leading-tight">{emp?.nama}</p>
                      <p className="text-slate-400 text-[9px] font-bold uppercase mt-1">NIP. {emp?.nip}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-600 text-xs">{rec.tmtBaru}</td>
                    <td className="px-8 py-6">
                       <p className="text-[10px] text-slate-400 font-bold line-through">Rp {Number(rec.gajiLama).toLocaleString('id-ID')}</p>
                       <p className="font-black text-emerald-600 text-xs italic mt-0.5">Rp {Number(rec.gajiBaru).toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => onAction(rec.employeeId, 'SK_KGB')}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 ml-auto shadow-lg hover:bg-emerald-600 transition-all"
                      >
                        <FileText size={14} /> Buat SK KGB <ChevronRight size={12}/>
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-[50px] p-10 space-y-8 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><History size={24}/></div>
                  Input KGB Baru
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-xl font-black">✕</button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Pegawai</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs uppercase"
                    value={formData.employeeId}
                    onChange={e => setFormData({...formData, employeeId: e.target.value})}
                  >
                    <option value="">Cari Pegawai...</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.nama}</option>)}
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200/50 space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                    <Zap size={12} className="text-blue-500" /> Gunakan Template Otomatis
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => applyTemplate('PNS_GOL_III_D')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:border-blue-500 transition-all shadow-sm">PNS III/d</button>
                    <button onClick={() => applyTemplate('PPPK_GOL_V')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:border-blue-500 transition-all shadow-sm">PPPK V</button>
                    <button onClick={() => applyTemplate('TENAGA_KONTRAK')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:border-blue-500 transition-all shadow-sm">Kontrak</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gaji Lama</label>
                    <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs" value={formData.gajiLama} onChange={e => setFormData({...formData, gajiLama: Number(e.target.value)})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gaji Baru</label>
                    <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs" value={formData.gajiBaru} onChange={e => setFormData({...formData, gajiBaru: Number(e.target.value)})}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Terhitung Mulai (TMT)</label>
                  <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs" value={formData.tmtBaru} onChange={e => setFormData({...formData, tmtBaru: e.target.value})}/>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 rounded-[24px] font-black text-[10px] uppercase tracking-widest">Batal</button>
                <button onClick={handleAdd} className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Simpan & Monitoring</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KgbManagement;
