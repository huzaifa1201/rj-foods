
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating?: number;
  numReviews?: number;
  createdAt?: any;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  number: string; // Account number or instructions
  status: 'active' | 'inactive';
  isDigital: boolean; // True for EasyPaisa, JazzCash, Bank Transfer etc.
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerPostalCode?: string;
  deliveryNotes?: string;
  floorApartment?: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  transactionId?: string; // For digital payments
  screenshotUrl?: string; // For digital payments
  createdAt: any;
}

export interface PageContent {
  id: string; // The slug, e.g., 'privacy-policy'
  title: string;
  content: string;
  updatedAt: any;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  createdAt?: any;
}

export interface AppSettings {
  deliveryFee: number;
  minOrderAmount: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
}
