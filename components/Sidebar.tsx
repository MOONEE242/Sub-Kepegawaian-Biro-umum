
import React from 'react';
import { motion } from 'framer-motion';
import { SIDEBAR_MENU } from '../constants';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#403433] text-[#F2F2F2] flex flex-col z-50 border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.3)]">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="font-black text-xl leading-none tracking-tighter italic font-serif-italic">SIMPEG<br/><span className="text-[10px] font-bold text-[#A69485] not-italic uppercase tracking-[0.3em] -mt-1 block">PAPUA</span></h1>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-[#A69485]/30 to-transparent mt-6"></div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
        {SIDEBAR_MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="w-full relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 group overflow-hidden"
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeSidebarIndicator"
                className="absolute inset-0 bg-gradient-to-r from-[#A67153] to-[#734B3D] z-0 shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={`relative z-10 transition-all duration-500 group-hover:scale-125 ${activeTab === item.id ? 'text-white' : 'text-[#A69485] group-hover:text-white'}`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
            </span>
            <span className={`relative z-10 font-bold text-[11px] uppercase tracking-widest transition-all duration-300 ${activeTab === item.id ? 'text-white translate-x-1' : 'text-[#A69485] group-hover:text-white group-hover:translate-x-1'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Tutup Sesi</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
