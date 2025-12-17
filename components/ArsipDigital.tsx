
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, ArchiveDocument, DocumentCategory } from '../types';
import { 
  FolderSearch, UploadCloud, FileText, Search, ChevronRight, Download, AlertCircle, ShieldCheck, FileBadge, ArrowUpRight, Trash2, Edit3, X, Save
} from 'lucide-react';

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { id: '1', name: 'Berkas Dasar Kepegawaian', isMandatory: true, docs: ['SK CPNS', 'SK PNS', 'NPWP', 'KTP', 'KK'] },
  { id: '2', name: 'Pangkat & Golongan', isMandatory: true, docs: ['SK Pangkat Terakhir', 'SKP'] },
  { id: '3', name: 'Kenaikan Gaji Berkala', isMandatory: true, docs: ['SK KGB Lama', 'SK KGB Baru'] },
  { id: '8', name: 'Pendidikan', isMandatory: false, docs: ['Ijazah', 'Transkrip Nilai'] },
];

interface ArsipDigitalProps {
  employees: Employee[];
  archives: ArchiveDocument[];
  setArchives: React.Dispatch<React.SetStateAction<ArchiveDocument[]>>;
}

const ArsipDigital: React.FC<ArsipDigitalProps> = ({ employees, archives, setArchives }) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('1');
  const [editingDoc, setEditingDoc] = useState<ArchiveDocument | null>(null);
  
  // Upload/Edit State
  const [uploadData, setUploadData] = useState({ jenis: '', nomor: '', tgl: '', file: null as File | null });

  const selectedEmployee = useMemo(() => employees.find(e => e.id === selectedEmpId), [selectedEmpId, employees]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setUploadData({...uploadData, file: e.target.files[0]});
  };

  const openUploadModal = () => {
    setEditingDoc(null);
    setUploadData({ jenis: '', nomor: '', tgl: '', file: null });
    setIsUploadModalOpen(true);
  };

  const handleEditDoc = (doc: ArchiveDocument) => {
    setEditingDoc(doc);
    setUploadData({
      jenis: doc.jenisDokumen,
      nomor: doc.nomorDokumen,
      tgl: doc.tanggalDokumen,
      file: null // Kosongkan file jika tidak ingin mengganti file fisik
    });
    setIsUploadModalOpen(true);
  };

  const processSubmit = () => {
    if (!selectedEmpId || !uploadData.jenis) {
      alert("Harap pilih jenis dokumen!");
      return;
    }

    if (!editingDoc && !uploadData.file) {
      alert("Harap pilih file yang akan diunggah!");
      return;
    }

    const saveToDatabase = (fileBase64?: string) => {
      if (editingDoc) {
        // Mode Edit
        setArchives(prev => prev.map(a => a.id === editingDoc.id ? {
          ...a,
          jenisDokumen: uploadData.jenis,
          nomorDokumen: uploadData.nomor,
          tanggalDokumen: uploadData.tgl,
          fileUrl: fileBase64 || a.fileUrl, // Jika tidak ada file baru, pakai yang lama
        } : a));
      } else {
        // Mode Baru
        const newDoc: ArchiveDocument = {
          id: Math.random().toString(36).substr(2, 9),
          employeeId: selectedEmpId,
          categoryId: activeCategory,
          jenisDokumen: uploadData.jenis,
          nomorDokumen: uploadData.nomor,
          tanggalDokumen: uploadData.tgl,
          fileUrl: fileBase64 || '', 
          uploadedAt: new Date().toISOString(),
          isVerified: true
        };
        setArchives(prev => [...prev, newDoc]);
      }
      
      setIsUploadModalOpen(false);
      setUploadData({ jenis: '', nomor: '', tgl: '', file: null });
      setEditingDoc(null);
    };

    if (uploadData.file) {
      const reader = new FileReader();
      reader.onload = (e) => saveToDatabase(e.target?.result as string);
      reader.readAsDataURL(uploadData.file);
    } else {
      saveToDatabase();
    }
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus berkas ini secara permanen?")) {
      setArchives(prev => prev.filter(a => a.id !== id));
    }
  };

  const checklistStats = useMemo(() => {
    if (!selectedEmpId) return null;
    const empDocs = archives.filter(d => d.employeeId === selectedEmpId);
    const mandatoryCategories = DOCUMENT_CATEGORIES.filter(c => c.isMandatory);
    let totalMandatoryCount = 0;
    let uploadedMandatoryCount = 0;

    mandatoryCategories.forEach(cat => {
      cat.docs.forEach(docName => {
        totalMandatoryCount++;
        if (empDocs.some(d => d.jenisDokumen === docName)) uploadedMandatoryCount++;
      });
    });

    return {
      total: totalMandatoryCount,
      uploaded: uploadedMandatoryCount,
      percentage: Math.round((uploadedMandatoryCount / totalMandatoryCount) * 100) || 0
    };
  }, [selectedEmpId, archives]);

  const filteredEmployees = employees.filter(e => 
    e.nama.toLowerCase().includes(searchQuery.toLowerCase()) || e.nip.includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10">
      {/* Sidebar Pegawai */}
      <div className="lg:col-span-3 glass-panel rounded-[40px] overflow-hidden flex flex-col border border-white shadow-xl bg-white/40">
        <div className="p-6 border-b border-slate-100/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Cari Pegawai..." 
              className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar pr-2">
          {filteredEmployees.map(emp => (
            <motion.div 
              whileHover={{ x: 5 }}
              key={emp.id}
              onClick={() => setSelectedEmpId(emp.id)}
              className={`p-4 rounded-3xl cursor-pointer flex items-center justify-between transition-all ${selectedEmpId === emp.id ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-white/60 text-slate-600'}`}
            >
              <div>
                <p className={`font-black text-[10px] uppercase truncate italic ${selectedEmpId === emp.id ? 'text-white' : 'text-slate-900'}`}>{emp.nama}</p>
                <p className={`text-[8px] font-bold uppercase mt-1 tracking-widest ${selectedEmpId === emp.id ? 'text-slate-400' : 'text-slate-400'}`}>NIP. {emp.nip}</p>
              </div>
              {selectedEmpId === emp.id && <ChevronRight size={14} />}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Arsip */}
      <div className="lg:col-span-9 space-y-6">
        {selectedEmployee ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Profile Header */}
            <div className="col-span-12 glass-panel p-10 rounded-[50px] flex flex-col md:flex-row justify-between items-center border border-white shadow-2xl bg-white/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full"></div>
              <div className="relative z-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">{selectedEmployee.nama}</h2>
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mt-3 bg-blue-50 px-4 py-1.5 rounded-full inline-block">{selectedEmployee.jabatan}</p>
              </div>
              <button 
                onClick={openUploadModal}
                className="relative z-10 mt-6 md:mt-0 bg-slate-900 text-white px-10 py-5 rounded-[30px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all group"
              >
                <UploadCloud size={20} className="group-hover:bounce" /> Unggah Berkas Baru
              </button>
            </div>

            {/* Audit Status */}
            <div className="col-span-12 lg:col-span-4 glass-panel p-10 rounded-[50px] border border-white shadow-xl bg-white/40 flex flex-col justify-center items-center text-center">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" /> Integrity Audit
              </h4>
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * (checklistStats?.percentage || 0)) / 100} strokeLinecap="round" className="text-blue-600 transition-all duration-1000" />
                 </svg>
                 <p className="absolute text-3xl font-black text-slate-900">{checklistStats?.percentage}%</p>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{checklistStats?.uploaded} dari {checklistStats?.total} berkas wajib terunggah</p>
            </div>

            {/* Document Browser */}
            <div className="col-span-12 lg:col-span-8 glass-panel rounded-[50px] border border-white shadow-xl overflow-hidden flex flex-col bg-white/40">
              <div className="flex overflow-x-auto p-4 border-b border-slate-100/50 gap-3 custom-scrollbar">
                {DOCUMENT_CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-8 py-4 rounded-3xl whitespace-nowrap text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${activeCategory === cat.id ? 'bg-slate-900 text-white shadow-xl border-slate-900' : 'text-slate-400 bg-white/50 border-slate-100 hover:border-blue-300 hover:text-blue-500'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[500px] custom-scrollbar space-y-4">
                {DOCUMENT_CATEGORIES.find(c => c.id === activeCategory)?.docs.map(docType => {
                  const doc = archives.find(d => d.employeeId === selectedEmpId && d.jenisDokumen === docType);
                  return (
                    <motion.div 
                      layout
                      key={docType} 
                      className={`p-6 rounded-[35px] border transition-all flex items-center justify-between group ${doc ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 opacity-60 border-dashed border-slate-200'}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${doc ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-300'}`}>
                          <FileText size={28} />
                        </div>
                        <div>
                          <p className="font-black text-xs text-slate-800 uppercase tracking-tight italic">{docType}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{doc ? `No: ${doc.nomorDokumen || '-'}` : 'BELUM TERSEDIA'}</p>
                          {doc && <p className="text-[8px] text-emerald-500 font-black uppercase mt-1 tracking-tighter">Verified: {new Date(doc.uploadedAt).toLocaleDateString('id-ID')}</p>}
                        </div>
                      </div>
                      {doc && (
                        <div className="flex gap-2">
                          <a 
                            href={doc.fileUrl} 
                            download={`${doc.jenisDokumen.replace(/\s+/g, '_')}_${selectedEmployee.nama.replace(/\s+/g, '_')}.png`}
                            title="Unduh Berkas"
                            className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Download size={18}/>
                          </a>
                          <button 
                            onClick={() => handleEditDoc(doc)}
                            title="Edit Metadata"
                            className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          >
                            <Edit3 size={18}/>
                          </button>
                          <button 
                            onClick={() => handleDeleteDoc(doc.id)} 
                            title="Hapus Berkas"
                            className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[600px] glass-panel rounded-[60px] flex flex-col items-center justify-center p-20 text-center border-dashed border-slate-300 bg-white/30">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-inner">
               <FolderSearch size={40} className="text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Pilih Pegawai Master</h3>
            <p className="text-slate-400 font-medium italic mt-2">Gunakan panel kiri untuk mengakses basis data arsip digital.</p>
          </div>
        )}
      </div>

      {/* Upload & Edit Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[150] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[60px] p-12 shadow-2xl relative"
            >
              <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 p-2">
                <X size={24} />
              </button>

              <div className="flex items-center gap-5 mb-10">
                 <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl">
                   {editingDoc ? <Edit3 size={32} /> : <UploadCloud size={32} />}
                 </div>
                 <div>
                   <h3 className="text-2xl font-black uppercase italic leading-none">{editingDoc ? 'Edit Metadata Berkas' : 'Unggah Berkas Baru'}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 italic">E-Arsip Digital System v2.5</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Dokumen</label>
                   <select 
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-black text-xs uppercase shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    value={uploadData.jenis}
                    onChange={e => setUploadData({...uploadData, jenis: e.target.value})}
                  >
                    <option value="">Pilih Jenis Dokumen</option>
                    {DOCUMENT_CATEGORIES.find(c => c.id === activeCategory)?.docs.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Dokumen</label>
                    <input 
                      type="text" placeholder="Masukkan Nomor..." 
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-black text-xs uppercase shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={uploadData.nomor}
                      onChange={e => setUploadData({...uploadData, nomor: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Dokumen</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-black text-xs shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={uploadData.tgl}
                      onChange={e => setUploadData({...uploadData, tgl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{editingDoc ? 'Ganti File (Opsional)' : 'Pilih File Dokumen'}</label>
                   <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer relative transition-all group">
                      <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                        <FileBadge size={32} />
                      </div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">
                        {uploadData.file ? uploadData.file.name : (editingDoc ? 'Klik untuk Ganti File' : 'Seret file atau klik di sini')}
                      </p>
                      <p className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">PDF, JPG, PNG Maksimal 5MB</p>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button 
                  onClick={() => setIsUploadModalOpen(false)} 
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[28px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={processSubmit} 
                  className="flex-1 py-5 bg-slate-900 text-white rounded-[28px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                >
                  {/* Fixed: Added missing 'Save' icon import from lucide-react */}
                  {editingDoc ? <Save size={18} /> : <ArrowUpRight size={18} />}
                  {editingDoc ? 'Perbarui Berkas' : 'Simpan Berkas'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArsipDigital;
