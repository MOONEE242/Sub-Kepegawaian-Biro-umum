
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, OapStatus, PegawaiStatus } from '../types';
import { 
  Plus, Search, User, Briefcase, GraduationCap, Medal, Users, Save, Trash2, Edit3, ShieldCheck, Heart, FileText, Landmark, Download, Eye, EyeOff, AlertCircle, Filter, X
} from 'lucide-react';

interface EmployeeManagementProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, setEmployees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFormSection, setActiveFormSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [filterOap, setFilterOap] = useState<string>('ALL');
  const [filterAgama, setFilterAgama] = useState<string>('ALL');
  const [filterGolongan, setFilterGolongan] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  const initialForm: Partial<Employee> = {
    nama: '', nip: '', jenisKelamin: 'L', agama: 'Kristen', statusPegawai: 'PNS', oapStatus: OapStatus.OAP,
    jabatan: '', jenisJabatan: 'PELAKSANA', unitKerja: 'Sub Bag Kepegawaian', bagian: '',
    pangkat: '', golongan: '', mkgTahun: 0, mkgBulan: 0, pendidikanTerakhir: 'S-1', pendidikanJurusan: '',
    statusKawin: 'TK', jumlahAnak: 0, jumlahJiwa: 1, tmtKgb: '', tmtJabatan: '', tmtPangkat: '',
    npwp: '', nomorDosir: '', noRekeningTpp: '', namaBank: 'Bank Papua', skPejabat: '', skNomor: '',
    skTanggal: '', skTmt: '', skJenis: 'SK Jabatan'
  };

  const [formData, setFormData] = useState<Partial<Employee>>(initialForm);

  const toggleMasking = (id: string) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskString = (str: string) => {
    if (!str) return '-';
    if (str.length <= 8) return '********';
    return str.substring(0, 4) + '********' + str.substring(str.length - 4);
  };

  const handleSave = () => {
    if (!formData.nama || !formData.nip) {
      alert("Nama dan NIP wajib diisi!");
      return;
    }
    
    if (selectedEmp) {
      setEmployees(prev => prev.map(e => e.id === selectedEmp.id ? { ...e, ...formData } as Employee : e));
    } else {
      const newEmp = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Employee;
      setEmployees(prev => [...prev, newEmp]);
    }
    
    setIsModalOpen(false);
    setSelectedEmp(null);
  };

  const handleEdit = (emp: Employee) => {
    setSelectedEmp(emp);
    setFormData(emp);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pegawai ini? Jejak audit akan mencatat tindakan Anda.")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Nama", "NIP", "Pangkat", "Golongan", "Jabatan", "Unit Kerja", "OAP Status"];
    const csvContent = [
      headers.join(","),
      ...employees.map(e => [
        `"${e.nama}"`,
        `"${e.nip}"`,
        `"${e.pangkat}"`,
        `"${e.golongan}"`,
        `"${e.jabatan}"`,
        `"${e.unitKerja}"`,
        `"${e.oapStatus}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Pegawai_Papua_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setFilterOap('ALL');
    setFilterAgama('ALL');
    setFilterGolongan('ALL');
    setFilterStatus('ALL');
    setSearchQuery('');
  };

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchesSearch = e.nama.toLowerCase().includes(searchQuery.toLowerCase()) || e.nip.includes(searchQuery);
      const matchesOap = filterOap === 'ALL' || e.oapStatus === filterOap;
      const matchesAgama = filterAgama === 'ALL' || e.agama === filterAgama;
      const matchesGol = filterGolongan === 'ALL' || e.golongan === filterGolongan;
      const matchesStatus = filterStatus === 'ALL' || e.statusPegawai === filterStatus;
      
      return matchesSearch && matchesOap && matchesAgama && matchesGol && matchesStatus;
    });
  }, [employees, searchQuery, filterOap, filterAgama, filterGolongan, filterStatus]);

  // Derived unique lists for filters
  const golonganList = useMemo(() => Array.from(new Set(employees.map(e => e.golongan).filter(Boolean))), [employees]);
  const agamaList = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
  const statusList: PegawaiStatus[] = ["PNS", "CPNS", "PPPK", "HONOR", "KONTRAK"];

  const SECTIONS = [
    { id: 'A', label: 'Identitas', icon: <User size={16}/> },
    { id: 'B', label: 'Pendidikan', icon: <GraduationCap size={16}/> },
    { id: 'C', label: 'Pangkat/Gol', icon: <Medal size={16}/> },
    { id: 'D', label: 'Jabatan/Unit', icon: <Briefcase size={16}/> },
    { id: 'E', label: 'Detail SK', icon: <FileText size={16}/> },
    { id: 'F', label: 'Keluarga', icon: <Heart size={16}/> },
    { id: 'G', label: 'Admin', icon: <Landmark size={16}/> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Master Brankas Pegawai</h3>
          <p className="text-slate-500 font-medium italic">Basis Data ASN Biro Umum & Administrasi Pimpinan dengan Integritas Softbank.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadCSV}
            className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Download size={18} /> Export Laporan
          </button>
          <button 
            onClick={() => { setFormData(initialForm); setSelectedEmp(null); setIsModalOpen(true); }}
            className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all"
          >
            <Plus size={18} strokeWidth={3} /> Tambah Pegawai
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-200/50 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Cari NIP atau Nama..." 
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-slate-700 placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Data:</span>
          </div>

          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/10"
            value={filterOap} onChange={e => setFilterOap(e.target.value)}
          >
            <option value="ALL">Status OAP (Semua)</option>
            <option value="OAP">Hanya OAP</option>
            <option value="NON_OAP">Non-OAP</option>
          </select>

          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/10"
            value={filterAgama} onChange={e => setFilterAgama(e.target.value)}
          >
            <option value="ALL">Agama (Semua)</option>
            {agamaList.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/10"
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Kepegawaian (Semua)</option>
            {statusList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/10"
            value={filterGolongan} onChange={e => setFilterGolongan(e.target.value)}
          >
            <option value="ALL">Golongan (Semua)</option>
            {golonganList.sort().map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          {(filterOap !== 'ALL' || filterAgama !== 'ALL' || filterStatus !== 'ALL' || filterGolongan !== 'ALL' || searchQuery !== '') && (
            <button 
              onClick={clearFilters}
              className="px-4 py-2 text-red-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-red-50 rounded-xl transition-all"
            >
              <X size={12} /> Bersihkan
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-8 py-6">Profil Pegawai</th>
              <th className="px-8 py-6">Jabatan / Unit</th>
              <th className="px-8 py-6">Golongan</th>
              <th className="px-8 py-6 text-right">Aksi Otoritas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest italic">
                  Tidak ada pegawai yang sesuai dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-inner">
                        {emp.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 uppercase italic leading-tight">{emp.gelarDepan} {emp.nama} {emp.gelarBelakang}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            NIP. {showSensitive[emp.id] ? emp.nip : maskString(emp.nip)} • {emp.oapStatus}
                          </p>
                          <button onClick={() => toggleMasking(emp.id)} className="text-slate-300 hover:text-blue-500">
                            {showSensitive[emp.id] ? <EyeOff size={12}/> : <Eye size={12}/>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-700 uppercase italic text-xs tracking-tight">{emp.jabatan}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{emp.unitKerja}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-blue-600 italic">{emp.golongan}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{emp.pangkat}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(emp)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(emp.id)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-5xl rounded-[50px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center"><User size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black uppercase italic leading-none">{selectedEmp ? 'Enkripsi Data Pegawai' : 'Otorisasi Pegawai Baru'}</h3>
                     <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">Formulir Master Data Berintegritas Tinggi</p>
                   </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-xl font-black">✕</button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 space-y-2">
                  {SECTIONS.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setActiveFormSection(s.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${activeFormSection === s.id ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                  {activeFormSection === 'A' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <h4 className="text-lg font-black uppercase italic border-b pb-4 text-slate-800 flex items-center gap-3">
                        <User size={20} className="text-blue-500"/> A. Data Identitas Pegawai
                      </h4>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gelar Depan</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.gelarDepan} onChange={e => setFormData({...formData, gelarDepan: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap (Tanpa Gelar)</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value.toUpperCase()})}/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gelar Belakang</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.gelarBelakang} onChange={e => setFormData({...formData, gelarBelakang: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIP / NIK PPPK (18 Digit)</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Kelamin</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.jenisKelamin} onChange={e => setFormData({...formData, jenisKelamin: e.target.value as any})}>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Agama</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.agama} onChange={e => setFormData({...formData, agama: e.target.value})}>
                            <option>Islam</option><option>Kristen</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Konghucu</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status OAP</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.oapStatus} onChange={e => setFormData({...formData, oapStatus: e.target.value as any})}>
                            <option value="OAP">OAP (Orang Asli Papua)</option>
                            <option value="NON_OAP">Non-OAP</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status Kepegawaian</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.statusPegawai} onChange={e => setFormData({...formData, statusPegawai: e.target.value as any})}>
                            <option>PNS</option><option>CPNS</option><option>PPPK</option><option>HONOR</option><option>KONTRAK</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormSection === 'B' && (
                    <div className="space-y-8">
                      <h4 className="text-lg font-black uppercase italic border-b pb-4 text-slate-800 flex items-center gap-3">
                         <GraduationCap size={20} className="text-emerald-500"/> B. Pendidikan Terakhir
                      </h4>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenjang Pendidikan</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.pendidikanTerakhir} onChange={e => setFormData({...formData, pendidikanTerakhir: e.target.value})}>
                            <option>SD</option><option>SMP</option><option>SMA/SMK</option><option>D-III</option><option>D-IV</option><option>S-1</option><option>S-2</option><option>S-3</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jurusan</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.pendidikanJurusan} onChange={e => setFormData({...formData, pendidikanJurusan: e.target.value})}/>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormSection === 'C' && (
                    <div className="space-y-8">
                      <h4 className="text-lg font-black uppercase italic border-b pb-4 text-slate-800 flex items-center gap-3">
                         <Medal size={20} className="text-amber-500"/> C. Pangkat & Golongan
                      </h4>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pangkat Terakhir</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.pangkat} onChange={e => setFormData({...formData, pangkat: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Golongan / Ruang</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.golongan} onChange={e => setFormData({...formData, golongan: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TMT Pangkat Terakhir</label>
                          <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.tmtPangkat} onChange={e => setFormData({...formData, tmtPangkat: e.target.value})}/>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormSection === 'G' && (
                    <div className="space-y-8">
                      <h4 className="text-lg font-black uppercase italic border-b pb-4 text-slate-800 flex items-center gap-3">
                         <ShieldCheck size={20} className="text-red-500"/> G. Data Administrasi Sensitif
                      </h4>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NPWP (Dienkripsi)</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.npwp} onChange={e => setFormData({...formData, npwp: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nomor Rekening TPP</label>
                          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black" value={formData.noRekeningTpp} onChange={e => setFormData({...formData, noRekeningTpp: e.target.value})}/>
                        </div>
                        <div className="space-y-2 col-span-2">
                           <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                               <AlertCircle size={14}/> Peringatan Integritas
                             </p>
                             <p className="text-[9px] text-red-400 font-bold mt-2 uppercase italic leading-relaxed">
                               Perubahan pada data administrasi sensitif akan dicatat dalam Audit Log dan diawasi oleh Inspektorat Provinsi Papua.
                             </p>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-10 bg-slate-50 border-t flex justify-end items-center gap-6">
                 <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest italic hover:text-slate-600 transition-colors">Batal</button>
                 <button onClick={handleSave} className="px-12 py-4 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                   <Save size={18} /> Simpan ke Brankas
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeManagement;
