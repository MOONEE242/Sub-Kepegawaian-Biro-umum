
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, AppConfig } from '../types';
import { 
  UserPlus, Printer, FileText, Download, LayoutTemplate, Wand2, ChevronRight, Save
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import saveAs from 'file-saver';

interface ESuratGeneratorProps {
  employees: Employee[];
  config: AppConfig;
  trigger?: {empId: string, type: string} | null;
  setTrigger: (val: any) => void;
}

const ESuratGenerator: React.FC<ESuratGeneratorProps> = ({ employees, config, trigger, setTrigger }) => {
  const [selectedType, setSelectedType] = useState('SK_PERBANTUAN');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [manualDraft, setManualDraft] = useState<string>('');
  const [previewData, setPreviewData] = useState<Employee | null>(null);

  useEffect(() => {
    if (trigger) {
      setSelectedEmployeeId(trigger.empId);
      setSelectedType(trigger.type);
      setPreviewData(employees.find(e => e.id === trigger.empId) || null);
      setTrigger(null);
    }
  }, [trigger, employees, setTrigger]);

  const SK_TYPES = [
    { id: 'SK_PERBANTUAN', label: 'Permohonan Staf Diperbantukan' },
    { id: 'SK_KGB', label: 'SK Kenaikan Gaji Berkala' },
    { id: 'SK_PANGKAT', label: 'SK Kenaikan Pangkat' },
    { id: 'SK_CUTI', label: 'Surat Izin Cuti' },
    { id: 'SK_JABATAN', label: 'SK Pengangkatan Jabatan' },
    { id: 'SK_TEGURAN', label: 'Surat Teguran Disiplin' },
  ];

  const handleDownloadDocx = async () => {
    if (!previewData) return;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "PEMERINTAH PROVINSI PAPUA", bold: true, size: 28 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "BIRO UMUM DAN ADMINISTRASI PIMPINAN", bold: true, size: 24 })],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Prihal: ", bold: true }),
              new TextRun({ text: SK_TYPES.find(t => t.id === selectedType)?.label || "", bold: true, underline: {} }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun({ text: manualDraft || "Isi surat belum ditentukan.", font: "Times New Roman" })],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: config.namaKepalaBiro, bold: true, underline: {} })],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Surat_${previewData.nip}.docx`);
  };

  const currentType = SK_TYPES.find(t => t.id === selectedType);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel p-8 rounded-[40px] shadow-xl space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-[#A69485] uppercase tracking-[0.3em] flex items-center gap-2">
              <LayoutTemplate size={14} /> 1. Jenis Surat
            </h3>
            <div className="space-y-2">
              {SK_TYPES.map(type => (
                <button 
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                    selectedType === type.id 
                    ? 'bg-[#403433] text-white border-[#403433] shadow-xl' 
                    : 'bg-white/60 text-[#A69485] border-transparent hover:border-[#A67153]/30'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-[10px] font-black text-[#A69485] uppercase tracking-[0.3em] flex items-center gap-2">
              <UserPlus size={14} /> 2. Pilih Pegawai
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {employees.length === 0 ? (
                <p className="text-[10px] text-[#A69485] font-bold p-4 text-center italic">Database Kosong.</p>
              ) : (
                employees.map(emp => (
                  <div 
                    key={emp.id} 
                    onClick={() => { setSelectedEmployeeId(emp.id); setPreviewData(emp); }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedEmployeeId === emp.id ? 'bg-[#A67153]/10 border-[#A67153]' : 'bg-white border-transparent'
                    }`}
                  >
                    <div>
                      <p className={`font-black text-[10px] uppercase truncate italic ${selectedEmployeeId === emp.id ? 'text-[#A67153]' : 'text-[#403433]'}`}>
                        {emp.nama}
                      </p>
                      <p className="text-[8px] opacity-60 font-bold uppercase mt-0.5">NIP. {emp.nip}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {previewData ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white p-16 shadow-2xl rounded-[40px] border border-white min-h-[700px] flex flex-col font-serif text-[#403433]">
                <div className="text-center border-b-2 border-[#403433] pb-6 mb-10">
                  <h1 className="text-xl font-black uppercase tracking-tight">Pemerintah Provinsi Papua</h1>
                  <h2 className="text-2xl font-black uppercase mt-1">Biro Umum dan Administrasi Pimpinan</h2>
                </div>

                <div className="flex-1 space-y-8">
                   <div className="flex justify-between items-start text-sm">
                      <div className="space-y-1">
                        <p><strong>Nomor:</strong> 800.1.2.5/ /2025</p>
                        <p><strong>Prihal:</strong> <span className="underline font-black">{currentType?.label}</span></p>
                      </div>
                      <p className="font-bold">Jayapura, 2025</p>
                   </div>

                   <div className="space-y-4">
                      <p className="font-bold italic">Dengan hormat,</p>
                      <textarea 
                        className="w-full h-64 p-6 bg-[#F2F2F2] rounded-3xl border-none focus:ring-2 focus:ring-[#A67153]/20 font-serif text-lg leading-relaxed resize-none"
                        placeholder="Tulis draf surat secara manual di sini..."
                        value={manualDraft}
                        onChange={(e) => setManualDraft(e.target.value)}
                      />
                   </div>
                </div>

                <div className="mt-20 ml-auto w-72 text-center space-y-16">
                  <p className="font-black uppercase text-sm">Kepala Biro Umum</p>
                  <div>
                    <p className="text-sm font-black underline uppercase">{config.namaKepalaBiro}</p>
                    <p className="text-xs">NIP. {config.nipKepalaBiro}</p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-[#F2F2F2] flex gap-4 no-print">
                  <button onClick={handleDownloadDocx} className="bg-[#403433] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#A67153] transition-all">
                    <Download size={16}/> Simpan .docx
                  </button>
                  <button onClick={() => window.print()} className="bg-[#A69485] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#734B3D] transition-all">
                    <Printer size={16}/> Cetak / PDF
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full glass-panel rounded-[50px] flex flex-col items-center justify-center p-20 text-center border-dashed border-[#A69485]/30 min-h-[600px]">
              <Wand2 size={64} className="text-[#A69485] opacity-20 mb-8" />
              <h3 className="text-3xl font-black text-[#403433] italic uppercase font-serif-italic">Editor Surat Otoritas</h3>
              <p className="text-[#A69485] mt-4 font-medium italic">Pilih jenis surat dan pegawai untuk membuka lembar kerja digital.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ESuratGenerator;
