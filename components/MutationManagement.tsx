
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, MutationRecord } from '../types';
import { Briefcase, MapPin, ArrowRightLeft, Plus, FileText, ChevronRight, Trash2 } from 'lucide-react';

interface MutationManagementProps {
  employees: Employee[];
  records: MutationRecord[];
  setRecords: React.Dispatch<React.SetStateAction<MutationRecord[]>>;
  onAction: (empId: string, type: string) => void;
}

const MutationManagement: React.FC<MutationManagementProps> = ({ employees, records, setRecords, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMutation, setNewMutation] = useState<Partial<MutationRecord>>({
    employeeId: '',
    jabatanLama: '',
    unitLama: '',
    jabatanBaru: '',
    unitBaru: '',
    tmtMutasi: new Date().toISOString().split('T')[0]
  });

  const handleAddMutation = () => {
    if (!newMutation.employeeId || !newMutation.jabatanBaru) {
      alert("Harap pilih pegawai dan isi jabatan baru!");
      return;
    }
    
    const record: MutationRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: newMutation.employeeId as string,
      jabatanLama: newMutation.jabatanLama as string,
      unitLama: newMutation.unitLama as string,
      jabatanBaru: newMutation.jabatanBaru as string,
      unitBaru: newMutation.unitBaru as string,
      tmtMutasi: newMutation.tmtMutasi as string
    };

    setRecords(prev => [...prev, record]);
    setIsModalOpen(false);
  };

  const handleSelectEmployee = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setNewMutation({
        ...newMutation,
        employeeId: empId,
        jabatanLama: emp.jabatan,
        unitLama: emp.unitKerja
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus riwayat mutasi ini?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Jabatan & Mutasi</h3>
          <p className="text-slate-500 font-medium italic">Riwayat struktural, fungsional, dan mutasi internal.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowRightLeft size={20} /> Tambah Mutasi
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Pegawai</th>
              <th className="px-8 py-6">Riwayat Perubahan</th>
              <th className="px-8 py-6">TMT</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black uppercase italic tracking-widest">
                  Belum ada riwayat mutasi tercatat.
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
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 line-through font-bold uppercase tracking-tight">
                          <span>{rec.jabatanLama}</span>
                          <span className="text-[8px] italic opacity-50">({rec.unitLama})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-blue-600 font-black uppercase tracking-tight">
                          <span>{rec.jabatanBaru}</span>
                          <span className="text-[10px] text-slate-500 italic">({rec.unitBaru})</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-700 text-xs">{rec.tmtMutasi}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onAction(rec.employeeId, 'SK_JABATAN')}
                          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all"
                        >
                          <FileText size={14} /> Buat SK Mutasi <ChevronRight size={12}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(rec.id)}
                          className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-[50px] p-10 space-y-8 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><ArrowRightLeft size={24}/></div>
                  Input Mutasi Jabatan
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-xl font-black">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Pegawai</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs uppercase"
                    value={newMutation.employeeId}
                    onChange={e => handleSelectEmployee(e.target.value)}
                  >
                    <option value="">Cari Pegawai...</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.nama} - {e.nip}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jabatan Baru</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Kasubag Kepegawaian" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs uppercase"
                      value={newMutation.jabatanBaru}
                      onChange={e => setNewMutation({...newMutation, jabatanBaru: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Kerja Baru</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs uppercase"
                      value={newMutation.unitBaru}
                      onChange={e => setNewMutation({...newMutation, unitBaru: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Terhitung Mulai (TMT)</label>
                  <input 
                    type="date" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs"
                    value={newMutation.tmtMutasi}
                    onChange={e => setNewMutation({...newMutation, tmtMutasi: e.target.value})}
                  />
                </div>

                {newMutation.employeeId && (
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-start gap-4">
                     <Briefcase className="text-blue-600 shrink-0" size={24} />
                     <div>
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Status Saat Ini</p>
                       <p className="text-xs font-black text-slate-800 uppercase italic">{newMutation.jabatanLama}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{newMutation.unitLama}</p>
                     </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-5 bg-slate-100 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200"
                >
                  Batal
                </button>
                <button 
                  onClick={handleAddMutation} 
                  className="flex-1 py-5 bg-blue-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                >
                  Simpan Mutasi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MutationManagement;
