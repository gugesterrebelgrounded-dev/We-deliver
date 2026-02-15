
import React from 'react';
import { useStore } from '../store';
import { OrderStatus } from '../types';
import { CURRENCY } from '../constants';

const DriverApp: React.FC = () => {
  const { currentUser, orders, updateOrderStatus, drivers, restaurants } = useStore();
  const driverData = drivers.find(d => d.id === currentUser?.id);

  const availableOrders = orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP || (o.status === OrderStatus.PENDING && !o.restaurantId));
  const myActiveOrders = orders.filter(o => o.driverId === currentUser?.id && o.status !== OrderStatus.DELIVERED);

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.ACCEPTED, currentUser?.id);
  };

  const handleStatusUpdate = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === OrderStatus.ACCEPTED) nextStatus = OrderStatus.PICKED_UP;
    else if (currentStatus === OrderStatus.PICKED_UP) nextStatus = OrderStatus.IN_TRANSIT;
    else if (currentStatus === OrderStatus.IN_TRANSIT) nextStatus = OrderStatus.DELIVERED;
    
    updateOrderStatus(orderId, nextStatus);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden ring-8 ring-slate-800/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">My Daily Earnings (ZAR)</p>
            <h2 className="text-5xl font-black tracking-tighter mb-6">{CURRENCY}1,450.00</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                ⭐ {driverData?.ratingAvg || 4.9} Rating
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                🛵 {driverData?.totalTrips || 12} Trips
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
             <button className="bg-green-500 text-white px-10 py-4 rounded-3xl font-black text-lg shadow-xl shadow-green-500/20 active:scale-95 transition-all">YOU ARE ONLINE</button>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Soweto Zone • Ready</p>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Deliveries</h3>
          <div className="space-y-6">
            {myActiveOrders.map(order => (
              <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border-4 border-blue-500 space-y-8 animate-in slide-in-from-left duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-2xl text-slate-900">Order #{order.id}</h4>
                    {order.restaurantId ? (
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1">Food Collective</p>
                    ) : (
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Parcel Logistic</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-black text-3xl text-slate-900">{CURRENCY}{order.totalFee.toFixed(2)}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earning Est.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center py-1">
                       <div className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100"></div>
                       <div className="w-0.5 flex-1 bg-slate-100 my-1"></div>
                       <div className="w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-100"></div>
                    </div>
                    <div className="flex-1 space-y-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pick Up From</p>
                          <p className="font-bold text-slate-700">{order.pickupAddress}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop Off To</p>
                          <p className="font-bold text-slate-700">{order.dropoffAddress}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                   <button className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600">Maps</button>
                   <button 
                     onClick={() => handleStatusUpdate(order.id, order.status)} 
                     className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 uppercase tracking-tight"
                   >
                    {order.status === OrderStatus.ACCEPTED ? 'Arrived at Pickup' : 
                     order.status === OrderStatus.PICKED_UP ? 'Order Collected' : 'Mark as Delivered'}
                   </button>
                </div>
              </div>
            ))}
            {myActiveOrders.length === 0 && (
              <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                <p className="text-slate-300 font-black text-xl uppercase tracking-widest">No Active Tasks</p>
                <p className="text-slate-400 text-sm mt-2">Wait for pings in your zone...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Available Near You</h3>
           <div className="space-y-4">
             {availableOrders.map(order => {
               const rest = restaurants.find(r => r.id === order.restaurantId);
               return (
                <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 hover:border-blue-200 transition-all group active:scale-95">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">{order.restaurantId ? '🍕' : '📦'}</div>
                       <div>
                         <p className="font-black text-slate-900 text-lg leading-tight">{rest?.name || 'Logistic Package'}</p>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{rest?.zone || 'Central Zone'}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-green-600 font-black text-xl">+{CURRENCY}18.00</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout</p>
                    </div>
                  </div>
                  <button onClick={() => handleAccept(order.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-colors">
                    Accept Task
                  </button>
                </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DriverApp;
