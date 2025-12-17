
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, LeaveRecord } from '../types';
import { Calendar, UserCheck, Timer, FileCheck, Plus, Trash2, FileText, ChevronRight } from 'lucide-react';

interface LeaveManagementProps {
  employees: Employee[];
  records: LeaveRecord[];
  setRecords: React.Dispatch<React.SetStateAction<LeaveRecord[]>>;
  onAction: (empId: string, type: string) => void;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ employees, records, setRecords, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<LeaveRecord>>({
    employeeId: '',
    jenisCuti: 'Cuti Tahunan',
    tanggalMulai: '',
    tanggalSelesai: '',
    lamaHari: 0,
    status: 'PENDING'
  });

  const handleSave = () => {
    if (!formData.employeeId || !formData.tanggalMulai || !formData.tanggalSelesai) {
      alert("Harap lengkapi semua data!");
      return;
    }
    
    const newRecord: LeaveRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: formData.employeeId as string,
      jenisCuti: formData.jenisCuti as string,
      tanggalMulai: formData.tanggalMulai as string,
      tanggalSelesai: formData.tanggalSelesai as string,
      lamaHari: Number(formData.lamaHari),
      status: formData.status as any
    };

    setRecords(prev => [...prev, newRecord]);
    setIsModalOpen(false);
    setFormData({ jenisCuti: 'Cuti Tahunan', status: 'PENDING' });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus data cuti ini?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, status: any) => {
    setRecords(prev => prev.map(r => r.id === id ? {...r, status} : r));
  };

  const stats = {
    total: records.length,
    pending: records.filter(r => r.status === 'PENDING').length,
    approved: records.filter(r => r.status === 'APPROVED').length,
    rejected: records.filter(r => r.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-[#403433] dark:text-[#F2F2F2] uppercase italic tracking-tight font-serif-italic">Cuti Pegawai</h3>
          <p className="opacity-60 font-medium italic">Pengajuan dan rekapitulasi hak cuti ASN.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#403433] text-white px-8 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-2xl hover:bg-[#A67153] hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar size={20} /> Ajukan Cuti
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pengajuan', val: stats.total, icon: <FileCheck className="text-[#A67153]" /> },
          { label: 'Menunggu', val: stats.pending, icon: <Timer className="text-amber-600" /> },
          { label: 'Disetujui', val: stats.approved, icon: <UserCheck className="text-emerald-600" /> },
          { label: 'Ditolak', val: stats.rejected, icon: <Calendar className="text-red-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-md p-6 rounded-[32px] border border-[#A69485]/10 shadow-sm flex flex-col justify-center items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#F2F2F2] flex items-center justify-center mb-1">{stat.icon}</div>
            <p className="text-[10px] font-black text-[#A69485] uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-[#403433]">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[40px] border border-[#A69485]/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F2F2F2] text-[#A69485] font-black uppercase text-[10px] tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Pegawai</th>
              <th className="px-8 py-6">Jenis Cuti</th>
              <th className="px-8 py-6">Masa Cuti</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-[#A69485] font-black uppercase italic tracking-widest">
                  Belum ada pengajuan cuti tercatat.
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
                      <p className="font-black text-[#403433] uppercase italic text-xs tracking-tight">{rec.jenisCuti}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-[#403433] text-xs">{rec.tanggalMulai} s/d {rec.tanggalSelesai}</p>
                      <p className="text-[10px] font-bold text-[#A67153] uppercase mt-0.5">{rec.lamaHari} Hari Kerja</p>
                    </td>
                    <td className="px-8 py-6">
                       <select 
                        value={rec.status} 
                        onChange={(e) => handleUpdateStatus(rec.id, e.target.value)}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase outline-none border ${
                          rec.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          rec.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onAction(rec.employeeId, 'SK_CUTI')}
                          className="bg-[#403433] text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg hover:bg-[#A67153] transition-all"
                        >
                          <FileText size={14} /> Buat Surat Cuti <ChevronRight size={12}/>
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
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4 font-serif-italic">
                  <div className="w-12 h-12 bg-[#403433] rounded-2xl flex items-center justify-center text-white"><Calendar size={24}/></div>
                  Form Pengajuan Cuti
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
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Jenis Cuti</label>
                  <select 
                    className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs uppercase"
                    value={formData.jenisCuti}
                    onChange={e => setFormData({...formData, jenisCuti: e.target.value})}
                  >
                    <option value="Cuti Tahunan">Cuti Tahunan</option>
                    <option value="Cuti Sakit">Cuti Sakit</option>
                    <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                    <option value="Cuti Besar">Cuti Besar</option>
                    <option value="Cuti Alasan Penting">Cuti Alasan Penting</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Tanggal Mulai</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs"
                      value={formData.tanggalMulai}
                      onChange={e => setFormData({...formData, tanggalMulai: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Tanggal Selesai</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs"
                      value={formData.tanggalSelesai}
                      onChange={e => setFormData({...formData, tanggalSelesai: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A69485] uppercase tracking-widest ml-1">Lama Hari</label>
                  <input 
                    type="number" 
                    placeholder="Contoh: 5" 
                    className="w-full px-6 py-4 bg-[#F2F2F2] border border-[#A69485]/20 rounded-2xl font-black text-xs"
                    value={formData.lamaHari}
                    onChange={e => setFormData({...formData, lamaHari: Number(e.target.value)})}
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
                  Simpan Pengajuan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveManagement;
