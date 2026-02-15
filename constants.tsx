
import { UserRole } from './types';

export const APP_NAME = "SwiftDrop SA";
export const CURRENCY = "R";

export const MOCK_USERS = [
  { id: '1', name: 'Zanele Khumalo', email: 'owner@swiftdrop.co.za', role: UserRole.OWNER },
  { id: '2', name: 'Kota King Admin', email: 'kota@business.co.za', role: UserRole.RESTAURANT_ADMIN },
  { id: '3', name: 'Speedy Sipho', email: 'sipho@driver.co.za', role: UserRole.DRIVER },
  { id: '4', name: 'Thabo Mokoena', email: 'thabo@gmail.com', role: UserRole.CUSTOMER },
];

export const FOOD_CATEGORIES = [
  { id: '1', name: 'Kota', icon: '🍞' },
  { id: '2', name: 'Chips', icon: '🍟' },
  { id: '3', name: 'Braai', icon: '🔥' },
  { id: '4', name: 'Burgers', icon: '🍔' },
  { id: '5', name: 'Drinks', icon: '🥤' },
];

export const MOCK_RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'The Kota King',
    logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100&h=100&fit=crop',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=300&fit=crop',
    address: 'Vilikazi Street, Orlando West',
    zone: 'Soweto',
    rating: 4.9,
    deliveryTime: '15-25 min',
    categories: ['Kota', 'Chips'],
    ownerId: '2'
  },
  {
    id: 'rest-2',
    name: 'Debonairs Pizza - Jabulani',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
    banner: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&h=300&fit=crop',
    address: 'Jabulani Mall, Soweto',
    zone: 'Soweto',
    rating: 4.6,
    deliveryTime: '30-45 min',
    categories: ['Pizza', 'Drinks'],
    ownerId: 'deb-corp',
    isChain: true
  }
];

export const MOCK_MENU_ITEMS = [
  {
    id: 'm1',
    restaurantId: 'rest-1',
    categoryId: '1',
    name: 'The Full House Kota',
    description: 'Quarter loaf, chips, polony, cheese, egg, and special sauce',
    basePrice: 45.00,
    image: 'https://images.unsplash.com/photo-1509722747041-619f382b83bc?w=400',
    isAvailable: true,
    variations: [
      { id: 'v1', name: 'Standard', price: 0 },
      { id: 'v2', name: 'Double Cheese', price: 10.00 }
    ]
  },
  {
    id: 'm2',
    restaurantId: 'rest-1',
    categoryId: '2',
    name: 'Slap Chips',
    description: 'Freshly cut township style slap chips',
    basePrice: 20.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    isAvailable: true,
    variations: [
      { id: 's1', name: 'Small', price: 0 },
      { id: 's2', name: 'Medium', price: 15.00 },
      { id: 's3', name: 'Large', price: 25.00 },
      { id: 's4', name: 'Extra Large', price: 40.00 }
    ]
  }
];
