
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, DisciplineRecord } from '../types';
import { ShieldAlert, Info, Gavel, Trash2, Plus, FileText, ChevronRight } from 'lucide-react';

interface DisciplineManagementProps {
  employees: Employee[];
  records: DisciplineRecord[];
  setRecords: React.Dispatch<React.SetStateAction<DisciplineRecord[]>>;
  onAction: (empId: string, type: string) => void;
}

const DisciplineManagement: React.FC<DisciplineManagementProps> = ({ employees, records, setRecords, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DisciplineRecord>>({
    employeeId: '',
    jenisPelanggaran: '',
    tingkat: 'RINGAN',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: ''
  });

  const handleSave = () => {
    if (!formData.employeeId || !formData.jenisPelanggaran) {
      alert("Harap lengkapi semua data!");
      return;
    }
    
    const newRecord: DisciplineRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: formData.employeeId as string,
      jenisPelanggaran: formData.jenisPelanggaran as string,
      tingkat: formData.tingkat as any,
      tanggal: formData.tanggal as string,
      keterangan: formData.keterangan as string
    };

    setRecords(prev => [...prev, newRecord]);
    setIsModalOpen(false);
    setFormData({ tingkat: 'RINGAN', tanggal: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus catatan disiplin ini?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-[#403433] dark:text-[#F2F2F2] uppercase italic tracking-tight font-serif-italic">Disiplin & Presensi</h3>
          <p className="opacity-60 font-medium italic">Penegakan disiplin dan catatan kehadiran ASN.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#403433] text-white px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-2xl hover:bg-[#A67153] hover:scale-105 active:scale-95 transition-all"
        >
          <ShieldAlert size={20} /> Catat Pelanggaran
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[40px] border border-[#A69485]/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F2F2F2] text-[#A69485] font-black uppercase text-[10px] tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Pegawai</th>
              <th className="px-8 py-6">Jenis Pelanggaran</th>
              <th className="px-8 py-6">Tingkat</th>
              <th className="px-8 py-6">Tanggal</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-[#A69485] font-black uppercase italic tracking-widest">
                  Belum ada catatan pelanggaran disiplin.
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
                      <p className="font-black text-[#403433] text-xs uppercase italic">{rec.jenisPelanggaran}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                        rec.tingkat === 'BERAT' ? 'bg-red-50 text-red-700 border-red-100' :
                        rec.tingkat === 'SEDANG' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {rec.tingkat}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-[#A69485] text-xs">{rec.tanggal}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onAction(rec.employeeId, 'SK_TEGURAN')}
                          className="bg-[#403433] text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg hover:bg-[#A67153] transition-all"
                        >
                          <FileText size={14} /> Buat Teguran <ChevronRight size={12}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(rec.id)}
                          className="p-2.5 bg-white border border-slate-100 rounded-xl text-[#A69485] hover:text-red-600 transition-all"
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
          <div className="fixed inset-0 bg-[#403433]/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-[50px] p-10 space-y-8 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4 text-[#A67153] font-serif-italic">
                  <div className="w-12 h-12 bg-[#403433] rounded-2xl flex items-center justify-center text-white"><ShieldAlert size={24}/></div>
                  Pencatatan Pelanggaran
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-xl font-black">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Nama Pegawai</label>
                  <select 
                    className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase"
                    value={formData.employeeId}
                    onChange={e => setFormData({...formData, employeeId: e.target.value})}
                  >
                    <option value="">Cari Pegawai...</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.nama} - {e.nip}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Jenis Pelanggaran</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Terlambat Apel Pagi" 
                    className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase"
                    value={formData.jenisPelanggaran}
                    onChange={e => setFormData({...formData, jenisPelanggaran: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Tingkat Disiplin</label>
                    <select 
                      className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase"
                      value={formData.tingkat}
                      onChange={e => setFormData({...formData, tingkat: e.target.value as any})}
                    >
                      <option value="RINGAN">RINGAN</option>
                      <option value="SEDANG">SEDANG</option>
                      <option value="BERAT">BERAT</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Tanggal Kejadian</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs"
                      value={formData.tanggal}
                      onChange={e => setFormData({...formData, tanggal: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Keterangan / Uraian</label>
                  <textarea 
                    rows={4}
                    placeholder="Masukkan uraian kejadian..." 
                    className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase"
                    value={formData.keterangan}
                    onChange={e => setFormData({...formData, keterangan: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-5 bg-[#F2F2F2] rounded-[24px] font-black text-[10px] uppercase tracking-widest"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave} 
                  className="flex-1 py-5 bg-[#403433] text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[#A67153] transition-all"
                >
                  Simpan Catatan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DisciplineManagement;
