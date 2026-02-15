
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useStore } from '../store';
import { OrderStatus } from '../types';
import { CURRENCY } from '../constants';

const RestaurantAdminDashboard: React.FC = () => {
  const { orders, updateOrderStatus, currentUser, restaurants } = useStore();
  const myRest = restaurants.find(r => r.ownerId === currentUser?.id);
  
  const myOrders = orders.filter(o => o.restaurantId === myRest?.id);
  const pending = myOrders.filter(o => o.status === OrderStatus.PENDING);
  const active = myOrders.filter(o => [OrderStatus.RESTAURANT_ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP].includes(o.status));

  const stats = [
    { label: 'Today Orders', value: myOrders.length, color: 'text-slate-900', bg: 'bg-white' },
    { label: 'Net Earnings', value: `${CURRENCY}4,850`, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg Prep Time', value: '12m', color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <img src={myRest?.logo} className="w-20 h-20 rounded-[2rem] object-cover shadow-xl border-4 border-white" />
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{myRest?.name}</h1>
              <p className="text-slate-500 font-medium">Branch Ops • {myRest?.zone}</p>
           </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
           <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
           <span className="font-black text-[10px] uppercase tracking-widest text-slate-500">Kitchen Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div key={i} className={`${s.bg} p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all`}>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{s.label}</p>
             <p className={`text-5xl font-black ${s.color} tracking-tighter`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              Incoming Tickets
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">{pending.length} New</span>
           </h2>
           
           <div className="space-y-6">
             {pending.map(order => (
               <div key={order.id} className="bg-white border-4 border-orange-100 p-8 rounded-[3rem] shadow-xl shadow-orange-500/5">
                 <div className="flex justify-between items-start mb-6">
                   <div>
                      <p className="font-black text-2xl">Order #{order.id}</p>
                      <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Received 4m ago</p>
                   </div>
                   <p className="font-black text-3xl">{CURRENCY}{order.totalFee.toFixed(2)}</p>
                 </div>
                 
                 <div className="bg-slate-50 p-6 rounded-3xl mb-8 space-y-4">
                   {order.items?.map((item, i) => (
                     <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                        <span className="font-black text-slate-800">{item.quantity}x {item.name}</span>
                        <span className="text-xs font-bold text-slate-400">{CURRENCY}{item.totalPrice.toFixed(2)}</span>
                     </div>
                   ))}
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400">Decline</button>
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.RESTAURANT_ACCEPTED)} className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200 uppercase">Accept Order</button>
                 </div>
               </div>
             ))}
             {pending.length === 0 && (
               <div className="py-20 text-center bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem]">
                  <p className="text-slate-300 font-black text-xl uppercase tracking-widest">Kitchen Quiet</p>
               </div>
             )}
           </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-2xl font-black tracking-tight">Active Queue</h2>
           <div className="space-y-4">
              {active.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🍕</div>
                      <div>
                         <p className="font-black">Order #{order.id}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.status.replace('_', ' ')}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === OrderStatus.PREPARING ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>Prep</button>
                      <button onClick={() => updateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === OrderStatus.READY_FOR_PICKUP ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>Ready</button>
                   </div>
                </div>
              ))}
              {active.length === 0 && <p className="text-center py-10 text-slate-300 font-bold">No active prep.</p>}
           </div>

           <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl mt-12">
              <h3 className="text-lg font-black mb-6">Daily Performance</h3>
              <div className="h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: '8am', s: 12 }, { name: '12pm', s: 45 }, { name: '4pm', s: 28 }, { name: '8pm', s: 65 }]}>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                       <Bar dataKey="s" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdminDashboard;
