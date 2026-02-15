
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';
import { useStore } from '../store';
import { OrderStatus } from '../types';
import { CURRENCY } from '../constants';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard: React.FC = () => {
  const { orders, drivers, restaurants } = useStore();

  const totalGMV = orders.reduce((acc, o) => acc + o.totalFee, 0) + 125000; // Mock historical scale
  const platformRevenue = totalGMV * 0.20; // 20% platform cut
  const activeDrivers = drivers.filter(d => d.isOnline).length;
  
  const statusDistribution = [
    { name: 'Delivered', value: orders.filter(o => o.status === OrderStatus.DELIVERED).length + 420 },
    { name: 'Active', value: orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length + 32 },
    { name: 'Cancelled', value: orders.filter(o => o.status === OrderStatus.CANCELLED).length + 12 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Marketplace Insights</h2>
          <p className="text-slate-500 font-medium mt-1">Full overview of GMV and regional delivery performance.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-black text-sm hover:border-blue-600 transition-all">Download Report</button>
           <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-200">Global Settings</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total GMV', value: `${CURRENCY}${totalGMV.toLocaleString()}`, change: '+18.4%', icon: '🚀' },
          { label: 'Platform Rev', value: `${CURRENCY}${platformRevenue.toLocaleString()}`, change: '20% Fixed', icon: '💎' },
          { label: 'Township Orders', value: '842', change: 'Soweto #1', icon: '📍' },
          { label: 'Active Fleet', value: activeDrivers, change: '100% Active', icon: '🚛' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-3xl block mb-4">{stat.icon}</span>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              <span className="mt-3 inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase">{stat.change}</span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Weekly Revenue (ZAR)</h3>
            <div className="flex gap-2">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-full"></div><span className="text-[10px] font-bold text-slate-400">Total Sales</span></div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', revenue: 12000 },
                { name: 'Tue', revenue: 14500 },
                { name: 'Wed', revenue: 11000 },
                { name: 'Thu', revenue: 18000 },
                { name: 'Fri', revenue: 25000 },
                { name: 'Sat', revenue: 32000 },
                { name: 'Sun', revenue: 21000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8">Order Logistics</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value">
                  {statusDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">{statusDistribution.reduce((a,b) => a+b.value, 0)}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Trips</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
             {statusDistribution.map((s, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{s.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{s.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Onboarded Vendors</h3>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{restaurants.length} Registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Restaurant</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">Avg Order</th>
                <th className="px-8 py-5">Comm Split</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {restaurants.map((rest) => (
                <tr key={rest.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img src={rest.logo} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="font-black text-slate-900">{rest.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-500">{rest.zone}</td>
                  <td className="px-8 py-5 font-black text-slate-900">{CURRENCY}145.00</td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase bg-green-50 text-green-700 px-2 py-1 rounded-full">75/20/5 Approved</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span className="text-xs font-bold text-slate-700">Verified</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
