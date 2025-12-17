
import React from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarClock, UserCheck, ArrowUpRight, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Employee } from '../types';

interface DashboardProps {
  employees: Employee[];
}

const Dashboard: React.FC<DashboardProps> = ({ employees }) => {
  const totalEmployees = employees.length;
  const oapCount = employees.filter(e => e.oapStatus === 'OAP').length;
  
  // Custom Palette for Charts - Using User provided palette
  const CHART_COLORS = ['#A67153', '#A69485', '#734B3D', '#403433'];

  const statCards = [
    { label: 'Total ASN', value: totalEmployees, icon: <Users size={20} />, color: 'bg-[#A67153]' },
    { label: 'Orang Asli Papua', value: oapCount, icon: <UserCheck size={20} />, color: 'bg-[#734B3D]' },
    { label: 'Akan KGB', value: '00', icon: <CalendarClock size={20} />, color: 'bg-[#A69485]' },
    { label: 'Naik Pangkat', value: '00', icon: <ArrowUpRight size={20} />, color: 'bg-[#403433]' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -10, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="glass-panel p-8 rounded-[40px] flex flex-col justify-between shadow-2xl border-white/20"
          >
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
              {card.icon}
            </div>
            <div>
              <p className="opacity-60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{card.label}</p>
              <h3 className="text-4xl font-black tracking-tighter italic font-serif-italic">{card.value.toString().padStart(2, '0')}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {totalEmployees === 0 ? (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-[60px] border-dashed border-[#A69485]/30 p-24 flex flex-col items-center justify-center text-center shadow-inner bg-white/5"
        >
           <div className="w-24 h-24 bg-[#A67153]/10 rounded-[40px] flex items-center justify-center mb-8 text-[#A67153]">
              <Database size={48} className="animate-pulse" />
           </div>
           <h3 className="text-3xl font-black uppercase italic font-serif-italic tracking-tight">Database Masih Steril</h3>
           <p className="opacity-60 text-sm font-medium italic mt-4 max-w-md">Otoritas SIMPEG siap digunakan. Harap masukkan data master pertama untuk mengaktifkan mesin statistik.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 glass-panel p-10 rounded-[50px] shadow-2xl border-white/20"
          >
            <h3 className="font-black mb-10 text-xl uppercase italic font-serif-italic tracking-tight">Performa Distribusi Sektoral</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'PNS', count: employees.filter(e => e.statusPegawai === 'PNS').length },
                  { name: 'CPNS', count: employees.filter(e => e.statusPegawai === 'CPNS').length },
                  { name: 'PPPK', count: employees.filter(e => e.statusPegawai === 'PPPK').length },
                  { name: 'HONOR', count: employees.filter(e => e.statusPegawai === 'HONOR').length },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A69485' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgba(166, 113, 83, 0.05)' }} contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)' }} />
                  <Bar dataKey="count" fill="#A67153" radius={[15, 15, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 glass-panel p-10 rounded-[50px] shadow-2xl border-white/20 flex flex-col items-center justify-center"
          >
            <h3 className="font-black mb-6 uppercase italic font-serif-italic text-xl">Indeks Keaslian (OAP)</h3>
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={[
                                { name: 'OAP', value: oapCount },
                                { name: 'NON-OAP', value: totalEmployees - oapCount },
                            ]} 
                            innerRadius={70} 
                            outerRadius={100} 
                            paddingAngle={8}
                            dataKey="value"
                        >
                            <Cell fill="#A67153" stroke="none" />
                            <Cell fill="#A69485" stroke="none" opacity={0.4} />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-8 flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center p-5 rounded-3xl bg-[#A67153]/5 border border-[#A67153]/10">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Komposisi OAP</span>
                    <span className="font-black text-xl text-[#A67153]">{totalEmployees > 0 ? Math.round((oapCount / totalEmployees) * 100) : 0}%</span>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
