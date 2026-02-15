
export enum UserRole {
  OWNER = 'OWNER',
  RESTAURANT_ADMIN = 'RESTAURANT_ADMIN',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  RESTAURANT_ACCEPTED = 'RESTAURANT_ACCEPTED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  ACCEPTED = 'ACCEPTED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CARD = 'CARD',
  EFT_POP = 'EFT_POP',
  CASH = 'CASH',
  WALLET = 'WALLET'
}

export interface MenuItemVariation {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemModifier {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  variations?: MenuItemVariation[];
  modifiers?: MenuItemModifier[];
  isAvailable: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  banner: string;
  address: string;
  zone: string;
  rating: number;
  deliveryTime: string;
  categories: string[];
  ownerId: string;
  isChain?: boolean;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  variation?: MenuItemVariation;
  modifiers?: MenuItemModifier[];
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId?: string;
  driverId?: string;
  items?: CartItem[];
  pickupAddress: string;
  dropoffAddress: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  foodSubtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AnalyticsKPI {
  label: string;
  value: string | number;
  change: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}
