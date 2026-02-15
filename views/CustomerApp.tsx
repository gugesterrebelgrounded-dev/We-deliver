
import React, { useState } from 'react';
import { useStore } from '../store';
import { OrderStatus, Order, Restaurant, MenuItem, CartItem, MenuItemVariation, MenuItemModifier, PaymentMethod } from '../types';
import { FOOD_CATEGORIES, CURRENCY } from '../constants';

const CustomerApp: React.FC = () => {
  const { restaurants, menuItems, cart, addToCart, removeFromCart, placeOrder, currentUser, orders } = useStore();
  const [selectedRest, setSelectedRest] = useState<Restaurant | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedVar, setSelectedVar] = useState<MenuItemVariation | null>(null);
  const [selectedMods, setSelectedMods] = useState<MenuItemModifier[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);

  const foodSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = 25.00; // Flat local delivery fee for demo
  const serviceFee = 5.00;
  const totalOrderAmount = foodSubtotal + deliveryFee + serviceFee;

  const handleAddToCart = () => {
    if (!selectedItem) return;
    const finalPrice = selectedItem.basePrice + (selectedVar?.price || 0) + selectedMods.reduce((a, b) => a + b.price, 0);
    const item: CartItem = {
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      quantity: 1,
      variation: selectedVar || undefined,
      modifiers: selectedMods,
      totalPrice: finalPrice
    };
    addToCart(item);
    setSelectedItem(null);
    setSelectedVar(null);
    setSelectedMods([]);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 90000)}`,
      customerId: currentUser?.id || '',
      restaurantId: selectedRest?.id,
      items: [...cart],
      pickupAddress: selectedRest?.address || '',
      dropoffAddress: 'House 4242, Orlando West, Soweto',
      status: OrderStatus.PENDING,
      paymentMethod: paymentMethod,
      foodSubtotal: foodSubtotal,
      deliveryFee: deliveryFee,
      serviceFee: serviceFee,
      totalFee: totalOrderAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    placeOrder(newOrder);
    setSelectedRest(null);
  };

  if (selectedRest) {
    const restMenu = menuItems.filter(m => m.restaurantId === selectedRest.id);
    return (
      <div className="max-w-4xl mx-auto pb-48">
        <button onClick={() => setSelectedRest(null)} className="mb-4 text-blue-600 font-semibold flex items-center gap-1 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Township Favorites
        </button>
        
        <div className="relative h-64 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <img src={selectedRest.banner} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                {selectedRest.isChain && <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">National Chain</span>}
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">{selectedRest.zone}</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">{selectedRest.name}</h1>
              <p className="flex items-center gap-2 mt-2 text-sm opacity-90">
                ⭐ {selectedRest.rating} • {selectedRest.deliveryTime} • {selectedRest.categories.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restMenu.map(item => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between gap-4 cursor-pointer hover:shadow-lg transition-all active:scale-95">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                  <p className="mt-4 font-black text-blue-700">{CURRENCY}{item.basePrice.toFixed(2)}</p>
                </div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                  <img src={item.image} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customization Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="h-48 relative">
                <img src={selectedItem.image} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">×</button>
              </div>
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedItem.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{selectedItem.description}</p>
                </div>

                {selectedItem.variations && (
                  <div className="space-y-3">
                    <p className="font-bold text-xs uppercase tracking-widest text-gray-400">Select Portion Size</p>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedItem.variations.map(v => (
                        <label key={v.id} className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedVar?.id === v.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="variation" className="w-5 h-5 accent-blue-600" checked={selectedVar?.id === v.id} onChange={() => setSelectedVar(v)} />
                            <span className="font-bold text-slate-700">{v.name}</span>
                          </div>
                          <span className="font-black text-blue-700">+{CURRENCY}{v.price.toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 bg-gray-50 border-t flex gap-4">
                <button onClick={handleAddToCart} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Improved Checkout Tray */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40">
            <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl ring-4 ring-slate-800/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-white font-black text-xl">Your Order</h4>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">{cart.length} Items from {selectedRest.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-2xl">{CURRENCY}{totalOrderAmount.toFixed(2)}</p>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Incl. Fees</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest px-2">Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: PaymentMethod.CARD, label: 'Card' },
                    { id: PaymentMethod.CASH, label: 'Cash on Delivery' },
                    { id: PaymentMethod.EFT_POP, label: 'EFT (Upload POP)' },
                    { id: PaymentMethod.WALLET, label: 'Wallet' }
                  ].map(method => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`py-2 px-3 rounded-xl text-[10px] font-bold border transition-all ${paymentMethod === method.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handlePlaceOrder} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors">
                Checkout & Delivery
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="relative overflow-hidden bg-blue-600 rounded-[3rem] p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-md">
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">Craving a Kota?</h1>
             <p className="text-blue-100 text-lg font-medium">Local township favorites delivered to your doorstep in minutes.</p>
             <div className="mt-8 flex gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black shadow-xl">Explore Nearby</button>
                <button className="bg-blue-500/50 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-black border border-white/20">Daily Specials</button>
             </div>
          </div>
          <div className="hidden lg:block w-72 h-72 bg-white/10 rounded-full blur-3xl absolute -right-20 -top-20 animate-pulse"></div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
        {FOOD_CATEGORIES.map(cat => (
          <div key={cat.id} className="bg-white min-w-[120px] px-6 py-4 rounded-3xl border border-gray-100 flex flex-col items-center gap-3 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <span className="text-3xl group-hover:scale-125 transition-transform">{cat.icon}</span>
            <span className="font-black text-xs uppercase text-slate-700">{cat.name}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Featured Kitchens</h2>
            <p className="text-gray-500 font-medium">Top rated in your delivery zone.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-600">Soweto Zone 📍</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map(rest => (
            <div key={rest.id} onClick={() => setSelectedRest(rest)} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group border border-gray-50">
              <div className="relative h-56 overflow-hidden">
                <img src={rest.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   {rest.isChain && <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg">National Brand</span>}
                </div>
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                  <span className="text-blue-600 font-black text-sm">⭐ {rest.rating}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-slate-900 font-bold text-xs uppercase">{rest.deliveryTime}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{rest.name}</h3>
                <p className="text-gray-500 font-medium text-sm mt-1">{rest.categories.join(' • ')}</p>
                <div className="mt-6 flex items-center justify-between border-t pt-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Open Now</span>
                  </div>
                  <span className="text-blue-600 font-black text-sm">{CURRENCY}25.00 Delivery</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerApp;
