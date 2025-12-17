
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  TrendingUp, 
  Wallet, 
  UserPlus, 
  Calendar, 
  ShieldAlert, 
  Activity, 
  Settings, 
  LogOut,
  Briefcase,
  History,
  FileSpreadsheet
} from 'lucide-react';

export const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'master_pegawai', label: 'Data Pegawai (Master)', icon: <Users size={20} /> },
  { id: 'arsip_digital', label: 'E-Arsip Digital', icon: <FileText size={20} /> },
  { id: 'esurat', label: 'Generator E-Surat', icon: <FileSpreadsheet size={20} /> },
  { id: 'kenaikan_pangkat', label: 'Kenaikan Pangkat', icon: <TrendingUp size={20} /> },
  { id: 'kgb', label: 'Kenaikan Gaji (KGB)', icon: <History size={20} /> },
  { id: 'gaji_tpp', label: 'Gaji & TPP', icon: <Wallet size={20} /> },
  { id: 'jabatan_mutasi', label: 'Jabatan & Mutasi', icon: <Briefcase size={20} /> },
  { id: 'cuti', label: 'Cuti Pegawai', icon: <Calendar size={20} /> },
  { id: 'disiplin', label: 'Disiplin & Presensi', icon: <ShieldAlert size={20} /> },
  { id: 'monitoring', label: 'Monitoring', icon: <Activity size={20} /> },
  { id: 'settings', label: 'Pengaturan', icon: <Settings size={20} /> },
];

export const APP_THEME = {
  primary: '#0056b3', // Government Blue
  secondary: '#FFD700', // Gold for Papua accents
  danger: '#dc3545',
  success: '#28a745'
};
