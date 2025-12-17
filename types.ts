
export enum OapStatus {
  OAP = 'OAP',
  NON_OAP = 'NON_OAP'
}

export type PegawaiStatus = 'PNS' | 'CPNS' | 'PPPK' | 'HONOR' | 'KONTRAK';

export interface Employee {
  id: string;
  nip: string;
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  agama: string;
  statusPegawai: PegawaiStatus;
  oapStatus: OapStatus;
  jabatan: string;
  jenisJabatan: 'STRUKTURAL' | 'FUNGSIONAL' | 'PELAKSANA';
  unitKerja: string;
  bagian: string;
  pangkat: string;
  golongan: string;
  tmtPangkat: string;
  mkgTahun: number;
  mkgBulan: number;
  pendidikanTerakhir: string;
  pendidikanJurusan: string;
  pendidikanInstitusi: string;
  pendidikanTahunLulus: string;
  statusKawin: string; // TK, K-0, K-1, K-2, K-3
  jumlahAnak: number;
  jumlahJiwa: number;
  npwp?: string;
  nomorDosir?: string;
  noRekeningTpp?: string;
  namaBank?: string;
  tmtKgb: string;
  tmtJabatan: string;
  keterangan?: string;
  skPejabat?: string;
  skNomor?: string;
  skTanggal?: string;
  skTmt?: string;
  skJenis?: 'SK Pangkat' | 'SK Jabatan' | 'SK PPPK' | 'SK Mutasi';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'GENERATE_SK' | 'BACKUP';
  module: string;
  details: string;
}

export interface ArchiveDocument {
  id: string;
  employeeId: string;
  categoryId: string;
  jenisDokumen: string;
  nomorDokumen: string;
  tanggalDokumen: string;
  fileUrl: string;
  uploadedAt: string;
  isVerified: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  isMandatory: boolean;
  docs: string[];
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  bulan: string;
  tahun: number;
  gajiPokok: number;
  tunjanganIstri: number;
  tunjanganAnak: number;
  tunjanganKeluarga: number;
  tunjanganJabatanEselon: number;
  tunjanganFungsionalUmum: number;
  tunjanganFungsionalKhusus: number;
  tunjanganBeras: number;
  tunjanganTerpencil: number;
  tunjanganKinerjaTpp: number;
  tunjanganPajak: number;
  potonganPph: number;
  potonganIwp1: number;
  potonganIwp8: number;
  potonganBpjs4: number;
  potonganTaperum: number;
  potonganJkk: number;
  potonganJkm: number;
  potonganZakat: number;
  potonganBulog: number;
  potonganSewaRumah: number;
  totalPenghasilan: number;
  totalPotongan: number;
  gajiBersih: number;
}

export type PangkatStatus = 'DRAFT' | 'DIAJUKAN' | 'DIVERIFIKASI' | 'DISETUJUI' | 'DITOLAK' | 'SELESAI';

export interface PromotionRecord {
  id: string;
  employeeId: string;
  periode: 'APRIL' | 'OKTOBER';
  tahun: number;
  pangkatLama: string;
  golLama: string;
  tmtLama: string;
  pangkatBaru: string;
  golBaru: string;
  tmtBaru: string;
  status: PangkatStatus;
  catatan?: string;
}

export interface KgbRecord {
  id: string;
  employeeId: string;
  gajiLama: number;
  gajiBaru: number;
  tmtLama: string;
  tmtBaru: string;
  status: 'DRAFT' | 'SELESAI';
}

export interface MutationRecord {
  id: string;
  employeeId: string;
  jabatanLama: string;
  unitLama: string;
  jabatanBaru: string;
  unitBaru: string;
  tmtMutasi: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  jenisCuti: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lamaHari: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DisciplineRecord {
  id: string;
  employeeId: string;
  jenisPelanggaran: string;
  tingkat: 'RINGAN' | 'SEDANG' | 'BERAT';
  tanggal: string;
  keterangan: string;
}

export interface AppConfig {
  namaInstansi: string;
  namaKepalaBiro: string;
  nipKepalaBiro: string;
  templateSurat: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
