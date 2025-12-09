
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
  createdAt?: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  number: string; // Account number or instructions
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: string; // 'COD' or PaymentMethod ID/Name
  transactionId?: string;
  screenshotUrl?: string;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  createdAt: any;
}

export interface PageContent {
  id: string; // The slug, e.g., 'privacy-policy'
  title: string;
  content: string;
  updatedAt: any;
}
