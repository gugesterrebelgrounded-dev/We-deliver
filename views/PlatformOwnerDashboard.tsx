
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line
} from 'recharts';
import { useStore } from '../store';
import { OrderStatus } from '../types';
import { CURRENCY } from '../constants';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const PlatformOwnerDashboard: React.FC = () => {
  const { orders, restaurants, drivers } = useStore();

  const gmv = orders.reduce((acc, o) => acc + o.totalFee, 0) + 145000;
  const platformRevenue = gmv * 0.20;

  const kpis = [
    { label: 'Total GMV', value: `${CURRENCY}${gmv.toLocaleString()}`, change: '+12.5%', icon: '🚀', trend: 'up' },
    { label: 'Net Commission', value: `${CURRENCY}${platformRevenue.toLocaleString()}`, change: '+8.2%', icon: '💎', trend: 'up' },
    { label: 'Active Drivers', value: drivers.length + 84, change: '100% Online', icon: '🚛', trend: 'neutral' },
    { label: 'Avg Delivery', value: '24m', change: '-2m from avg', icon: '⏱️', trend: 'up' },
  ];

  const citySales = [
    { name: 'Soweto', sales: 45000 },
    { name: 'Sandton', sales: 32000 },
    { name: 'Khayelitsha', sales: 28000 },
    { name: 'Umlazi', sales: 22000 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Platform Control</h1>
          <p className="text-slate-500 font-medium">Real-time Gross Merchandise Value (GMV) across South Africa.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white border-2 border-slate-100 p-2 rounded-2xl flex gap-1">
              {['Daily', 'Weekly', 'Monthly'].map(t => (
                <button key={t} className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${t === 'Monthly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
             <div className="relative z-10">
                <span className="text-3xl block mb-4">{stat.icon}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <span className={`mt-3 inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {stat.change}
                </span>
             </div>
             <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-slate-50 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
           <h3 className="text-xl font-black mb-8">Revenue by Region (ZAR)</h3>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={citySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900 }} />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
           <h3 className="text-xl font-black mb-8">Payment Methods</h3>
           <div className="h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie 
                    data={[
                      { name: 'Card', value: 55 },
                      { name: 'Cash', value: 25 },
                      { name: 'EFT/POP', value: 20 }
                    ]} 
                    cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value"
                   >
                     {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                   </Pie>
                   <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-black">75%</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital</span>
              </div>
           </div>
           <div className="mt-8 space-y-3">
              {[
                { label: 'Card (Yoco/PayFast)', color: COLORS[0], percent: '55%' },
                { label: 'Cash on Delivery', color: COLORS[1], percent: '25%' },
                { label: 'EFT Upload', color: COLORS[2], percent: '20%' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">{p.label}</span>
                   </div>
                   <span className="font-black text-slate-900">{p.percent}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b flex items-center justify-between">
            <h3 className="text-xl font-black">Managed Vendors</h3>
            <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">+ Onboard Restaurant</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                     <th className="px-8 py-5">Restaurant Name</th>
                     <th className="px-8 py-5">Owner</th>
                     <th className="px-8 py-5">Zone</th>
                     <th className="px-8 py-5">Comm %</th>
                     <th className="px-8 py-5">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm">
                  {restaurants.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-all">
                       <td className="px-8 py-5 font-black text-slate-900">{r.name}</td>
                       <td className="px-8 py-5 font-medium text-slate-500">{r.ownerId}</td>
                       <td className="px-8 py-5 font-bold text-slate-700">{r.zone}</td>
                       <td className="px-8 py-5 font-black text-blue-600">20.0%</td>
                       <td className="px-8 py-5">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Verified</span>
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

export default PlatformOwnerDashboard;
