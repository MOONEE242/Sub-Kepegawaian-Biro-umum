
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, SalaryRecord } from '../types';
import { 
  Calculator, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History, 
  Download, 
  Plus, 
  Trash2,
  Save,
  Banknote,
  Printer,
  ChevronDown,
  Info,
  Zap,
  FileText,
  ChevronRight
} from 'lucide-react';

interface PayrollManagementProps {
  employees: Employee[];
  onAction: (empId: string, type: string) => void;
}

const PayrollManagement: React.FC<PayrollManagementProps> = ({ employees, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [bulan, setBulan] = useState('September');
  const [tahun, setTahun] = useState(2025);
  
  const [formData, setFormData] = useState({
    gajiPokok: 0, tunjanganIstri: 0, tunjanganAnak: 0, tunjanganKeluarga: 0,
    tunjanganJabatanEselon: 0, tunjanganFungsionalUmum: 0, tunjanganFungsionalKhusus: 0,
    tunjanganBeras: 0, tunjanganTerpencil: 0, tunjanganKinerjaTpp: 0, tunjanganPajak: 0,
    potonganPph: 0, potonganIwp1: 0, potonganIwp8: 0, potonganBpjs4: 0, potonganTaperum: 0, 
    potonganJkk: 0, potonganJkm: 0, potonganZakat: 0, potonganBulog: 0, potonganSewaRumah: 0
  });

  const totals = useMemo(() => {
    const penghasilan = formData.gajiPokok + formData.tunjanganIstri + formData.tunjanganAnak + 
                       formData.tunjanganKeluarga + formData.tunjanganJabatanEselon + 
                       formData.tunjanganFungsionalUmum + formData.tunjanganFungsionalKhusus + 
                       formData.tunjanganBeras + formData.tunjanganTerpencil + 
                       formData.tunjanganKinerjaTpp + formData.tunjanganPajak;
    
    const potongan = formData.potonganPph + formData.potonganIwp1 + formData.potonganIwp8 + 
                    formData.potonganBpjs4 + formData.potonganTaperum + formData.potonganJkk + 
                    formData.potonganJkm + formData.potonganZakat + formData.potonganBulog + 
                    formData.potonganSewaRumah;
    
    return {
      kotor: penghasilan,
      totalPotongan: potongan,
      bersih: penghasilan - potongan
    };
  }, [formData]);

  const applyTemplate = (type: string) => {
    if (type === 'PNS_IV_E') {
      setFormData({
        gajiPokok: 6373200, tunjanganIstri: 637320, tunjanganAnak: 254928, tunjanganKeluarga: 892248,
        tunjanganJabatanEselon: 1685000, tunjanganFungsionalUmum: 0, tunjanganFungsionalKhusus: 0,
        tunjanganBeras: 155233, tunjanganTerpencil: 0, tunjanganKinerjaTpp: 5000000, tunjanganPajak: 126072,
        potonganPph: 126072, potonganIwp1: 63732, potonganIwp8: 509856, potonganBpjs4: 254928, 
        potonganTaperum: 86832, potonganJkk: 15296, potonganJkm: 45887, potonganZakat: 150000, 
        potonganBulog: 0, potonganSewaRumah: 0
      });
    }
  };

  const handleSave = () => {
    if (!selectedEmployeeId) { alert("Pilih pegawai terlebih dahulu!"); return; }
    alert("Slip Gaji Berhasil Disimpan & Diakses oleh Modul Laporan.");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Administrasi Gaji & TPP</h3>
          <p className="text-slate-500 font-medium italic mt-2">Daftar Pembayaran Gaji Induk ASN & TPP Provinsi Papua.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl hover:bg-blue-600 hover:scale-105 transition-all"
        >
          <Plus size={18} strokeWidth={3} /> Input Slip Gaji
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200/50 shadow-sm flex items-center gap-6 group hover:border-blue-500 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Calculator size={32}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Payout Bulanan</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">Rp 2.145.890.200</p>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-900/20 text-white flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[28px] flex items-center justify-center shadow-inner"><Banknote size={32}/></div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Periode Pembayaran</p>
            <p className="text-2xl font-black tracking-tighter italic uppercase">{bulan} {tahun}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-200/50 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center shadow-inner"><History size={32}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Verifikasi Inspektorat</p>
            <p className="text-2xl font-black text-emerald-600 tracking-tighter italic">VALIDATED</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-8 py-6">Penerima Manfaat (ASN)</th>
              <th className="px-8 py-6 text-right">Penghasilan Kotor</th>
              <th className="px-8 py-6 text-right">Total Potongan</th>
              <th className="px-8 py-6 text-right">Diterima Bersih</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase italic">{emp.nama}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">NIP. {emp.nip} • {emp.golongan}</p>
                </td>
                <td className="px-8 py-6 text-right font-bold text-slate-600">Rp 12.101.011</td>
                <td className="px-8 py-6 text-right font-bold text-red-500">-Rp 2.200.111</td>
                <td className="px-8 py-6 text-right font-black text-blue-700 bg-blue-50/20 italic">Rp 9.900.900</td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onAction(emp.id, 'SK_KGB')}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all"
                      >
                        <FileText size={14} /> Buat SK
                      </button>
                      <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm group-hover:scale-110"><Printer size={18} /></button>
                      <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm group-hover:scale-110"><Download size={18} /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-7xl rounded-[60px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="bg-slate-900 p-10 text-white flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-emerald-600 rounded-[30px] flex items-center justify-center shadow-lg hover:rotate-12 transition-all"><Wallet size={32} /></div>
                   <div>
                     <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-emerald-400">Payroll Engine Papua</h3>
                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3 italic">Daftar Pembayaran Gaji Induk PNSD & TPP v2025.09</p>
                   </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-full hover:bg-white/10 flex items-center justify-center transition-all text-2xl font-black">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 custom-scrollbar">
                 {/* Section A: Identitas Slip */}
                 <div className="lg:col-span-3 bg-slate-50 p-10 border-r border-slate-100 space-y-10">
                    <div className="space-y-4">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-3">A. Identitas Slip Gaji</h4>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Pegawai</label>
                             <select 
                               className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl font-black text-xs uppercase shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all"
                               value={selectedEmployeeId}
                               onChange={(e) => setSelectedEmployeeId(e.target.value)}
                             >
                               <option value="">Cari Pegawai...</option>
                               {employees.map(e => <option key={e.id} value={e.id}>{e.nama} - {e.nip}</option>)}
                             </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bulan</label>
                                <select className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl font-black text-xs uppercase" value={bulan} onChange={(e) => setBulan(e.target.value)}>
                                  {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(m => <option key={m}>{m}</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tahun</label>
                                <input type="number" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl font-black text-xs" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}/>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 space-y-5">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-3 flex items-center gap-2">
                         <Zap size={14} className="text-amber-500" /> Smart Templates
                       </h4>
                       <div className="space-y-3">
                          <button onClick={() => applyTemplate('PNS_IV_E')} className="w-full text-left p-5 bg-white border border-slate-200 rounded-[32px] hover:border-emerald-500 hover:shadow-xl transition-all group">
                             <p className="font-black text-slate-800 group-hover:text-emerald-600 text-xs uppercase">PNS GOL IV/e</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 italic leading-tight">Default Eselon II / Pimpinan</p>
                          </button>
                          <button className="w-full text-left p-5 bg-white border border-slate-200 rounded-[32px] hover:border-blue-500 transition-all opacity-50 cursor-not-allowed">
                             <p className="font-black text-slate-800 text-xs uppercase">PPPK GOL V</p>
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Section B & C: Income & Deductions */}
                 <div className="lg:col-span-5 p-12 space-y-12 bg-white">
                    <div className="space-y-8">
                       <h5 className="font-black text-emerald-600 text-[11px] uppercase tracking-[0.4em] flex items-center gap-3 border-b border-emerald-100 pb-4 italic">
                         <ArrowUpCircle size={20}/> B. Komponen Penghasilan
                       </h5>
                       <div className="grid grid-cols-2 gap-6">
                          {[
                            { id: 'gajiPokok', label: 'Gaji Pokok' },
                            { id: 'tunjanganIstri', label: 'Tunjangan Istri' },
                            { id: 'tunjanganAnak', label: 'Tunjangan Anak' },
                            { id: 'tunjanganKeluarga', label: 'Total Tunj. Keluarga' },
                            { id: 'tunjanganJabatanEselon', label: 'Tunj. Jabatan / Eselon' },
                            { id: 'tunjanganFungsionalUmum', label: 'Fungsional Umum' },
                            { id: 'tunjanganFungsionalKhusus', label: 'Fungsional Khusus' },
                            { id: 'tunjanganBeras', label: 'Tunjangan Beras' },
                            { id: 'tunjanganTerpencil', label: 'Tunjangan Terpencil' },
                            { id: 'tunjanganKinerjaTpp', label: 'TPP / Kinerja' },
                            { id: 'tunjanganPajak', label: 'Tunjangan Pajak' },
                          ].map(f => (
                            <div key={f.id} className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
                               <input type="number" className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 text-xs focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none" 
                                value={(formData as any)[f.id]} onChange={e => setFormData({...formData, [f.id]: Number(e.target.value)})}/>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-8 pt-10 border-t border-slate-100">
                       <h5 className="font-black text-red-600 text-[11px] uppercase tracking-[0.4em] flex items-center gap-3 border-b border-red-100 pb-4 italic">
                         <ArrowDownCircle size={20}/> C. Komponen Potongan
                       </h5>
                       <div className="grid grid-cols-2 gap-6">
                          {[
                            { id: 'potonganPph', label: 'Potongan PPh' },
                            { id: 'potonganIwp1', label: 'IWP 1%' },
                            { id: 'potonganIwp8', label: 'IWP 8%' },
                            { id: 'potonganBpjs4', label: 'BPJS Kesehatan 4%' },
                            { id: 'potonganTaperum', label: 'Taperum' },
                            { id: 'potonganJkk', label: 'JKK' },
                            { id: 'potonganJkm', label: 'JKM' },
                            { id: 'potonganZakat', label: 'Zakat / Infaq' },
                            { id: 'potonganBulog', label: 'Bulog' },
                            { id: 'potonganSewaRumah', label: 'Sewa Rumah' },
                          ].map(f => (
                            <div key={f.id} className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
                               <input type="number" className="w-full px-6 py-3.5 bg-red-50/20 border border-red-50 rounded-2xl font-black text-red-700 text-xs focus:bg-white focus:ring-4 focus:ring-red-500/5 transition-all outline-none" 
                                value={(formData as any)[f.id]} onChange={e => setFormData({...formData, [f.id]: Number(e.target.value)})}/>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Section D & E: Totals & Output */}
                 <div className="lg:col-span-4 bg-slate-950 text-white p-14 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 space-y-12">
                       <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-16 border-b border-white/10 pb-4 italic">D. Resume Perhitungan Gaji</p>
                       
                       <div className="space-y-10">
                          <div className="flex justify-between items-center group transition-all">
                             <div className="flex flex-col">
                               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Total Penghasilan Kotor</span>
                               <span className="text-[9px] font-bold text-slate-600 uppercase mt-2">(Sebelum Potongan)</span>
                             </div>
                             <span className="text-3xl font-black tracking-tighter">Rp {totals.kotor.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between items-center group transition-all">
                             <div className="flex flex-col">
                               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-red-400 transition-colors">Total Potongan</span>
                               <span className="text-[9px] font-bold text-slate-600 uppercase mt-2">(Komponen C)</span>
                             </div>
                             <span className="text-3xl font-black tracking-tighter text-red-400">-Rp {totals.totalPotongan.toLocaleString('id-ID')}</span>
                          </div>
                       </div>

                       <div className="pt-16 border-t border-white/20 mt-10">
                          <div className="flex items-center gap-3 mb-6">
                            <Info size={16} className="text-emerald-500" />
                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em]">Take Home Pay (THP)</p>
                          </div>
                          <p className="text-7xl font-black tracking-tighter text-white italic leading-none drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)]">Rp {totals.bersih.toLocaleString('id-ID')}</p>
                       </div>
                    </div>

                    <div className="relative z-10 pt-20 space-y-5">
                       <button onClick={handleSave} className="w-full py-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[36px] font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/50 transition-all flex items-center justify-center gap-4 group">
                         <Save size={22} className="group-hover:scale-125 transition-transform" /> Simpan Data & Slip
                       </button>
                       <div className="flex gap-4">
                          <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/15 transition-all"><Printer size={18}/> Cetak Slip</button>
                          <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/15 transition-all"><Download size={18}/> Export</button>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayrollManagement;
