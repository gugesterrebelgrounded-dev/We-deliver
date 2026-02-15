
import { create } from 'zustand';
import { User, Order, UserRole, OrderStatus, Restaurant, MenuItem, CartItem } from './types';
import { MOCK_USERS, MOCK_RESTAURANTS, MOCK_MENU_ITEMS } from './constants';

interface AppState {
  currentUser: User | null;
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  login: (email: string) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, driverId?: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  restaurants: MOCK_RESTAURANTS,
  menuItems: MOCK_MENU_ITEMS,
  orders: [],
  cart: [],
  login: (email) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) set({ currentUser: user });
  },
  logout: () => set({ currentUser: null, cart: [] }),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (index) => set((state) => ({ cart: state.cart.filter((_, i) => i !== index) })),
  clearCart: () => set({ cart: [] }),
  placeOrder: (order) => set((state) => ({ 
    orders: [order, ...state.orders],
    cart: []
  })),
  updateOrderStatus: (orderId, status, driverId) => set((state) => ({
    orders: state.orders.map(o => 
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString(), ...(driverId ? { driverId } : {}) } : o
    )
  })),
}));
