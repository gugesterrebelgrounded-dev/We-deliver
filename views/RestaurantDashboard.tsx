
import React from 'react';
import { useStore } from '../store';
import { OrderStatus } from '../types';
import { CURRENCY } from '../constants';

const RestaurantDashboard: React.FC = () => {
  const { orders, updateOrderStatus, currentUser, restaurants } = useStore();
  const myRest = restaurants.find(r => r.ownerId === currentUser?.id);
  
  const myOrders = orders.filter(o => o.restaurantId === myRest?.id);
  const pendingOrders = myOrders.filter(o => o.status === OrderStatus.PENDING);
  const activeOrders = myOrders.filter(o => [OrderStatus.RESTAURANT_ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP].includes(o.status));

  const handleUpdate = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{myRest?.name} Kitchen</h1>
          <p className="text-slate-500 font-medium">Orders flowing from {myRest?.zone}.</p>
        </div>
        <div className="flex items-center gap-4 bg-green-50 px-6 py-3 rounded-2xl border-2 border-green-100">
           <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
           <span className="font-black uppercase text-[10px] tracking-widest text-green-700">Live & Accepting Orders</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Unchecked Orders', value: pendingOrders.length, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Kitchen Prep', value: activeOrders.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: "Today's Payout", value: `${CURRENCY}4,850`, color: 'text-green-600', bg: 'bg-green-50' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-8 rounded-[2.5rem] border-2 border-transparent hover:border-white transition-all`}>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
             <p className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Incoming Tickets</h2>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-refresh Active</span>
          </div>
          
          <div className="space-y-6">
            {pendingOrders.map(order => (
              <div key={order.id} className="bg-white border-4 border-orange-500/10 p-8 rounded-[2.5rem] shadow-xl shadow-orange-500/5 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-2xl text-slate-900">Order #{order.id}</h4>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-1">Received 2m ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-3xl text-slate-900">{CURRENCY}{order.totalFee.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.paymentMethod.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1 py-3 border-b border-slate-200 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-slate-800 text-lg">{item.quantity}x {item.name}</span>
                        <span className="font-black text-slate-900">{CURRENCY}{item.totalPrice.toFixed(2)}</span>
                      </div>
                      {item.variation && <span className="text-xs font-bold text-blue-600 uppercase">Size: {item.variation.name}</span>}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => handleUpdate(order.id, OrderStatus.CANCELLED)} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">Decline</button>
                  <button onClick={() => handleUpdate(order.id, OrderStatus.RESTAURANT_ACCEPTED)} className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all">Accept Order</button>
                </div>
              </div>
            ))}
            {pendingOrders.length === 0 && (
              <div className="bg-slate-50 border-4 border-dashed border-slate-100 py-20 rounded-[3rem] text-center">
                <p className="text-slate-300 font-black text-xl uppercase tracking-widest">No New Orders</p>
                <p className="text-slate-400 text-xs mt-2">Kitchen is quiet for now...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Queue</h2>
           <div className="space-y-4">
             {activeOrders.map(order => (
               <div key={order.id} className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 shadow-sm flex items-center justify-between gap-6 hover:shadow-lg transition-all">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">🍲</div>
                    <div>
                      <p className="font-black text-slate-900 text-lg">Order #{order.id}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.items?.length} Items • Preparing</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleUpdate(order.id, OrderStatus.PREPARING)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === OrderStatus.PREPARING ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>Prep</button>
                    <button onClick={() => handleUpdate(order.id, OrderStatus.READY_FOR_PICKUP)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === OrderStatus.READY_FOR_PICKUP ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>Ready</button>
                 </div>
               </div>
             ))}
             {activeOrders.length === 0 && <p className="text-slate-300 font-bold text-sm text-center py-10">Queue is empty.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
