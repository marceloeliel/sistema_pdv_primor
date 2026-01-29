

export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  KITCHEN = 'KITCHEN',
  CUSTOMER = 'CUSTOMER'
}

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH'
}

export interface Ingredient {
  id: string;
  name: string;
  unit: 'KG' | 'UN' | 'LT';
  currentStock: number;
  minStock: number;
  costPrice: number;
}

export interface ComplementItem {
  id: string;
  name: string;
  price: number;
}

export interface ComplementGroup {
  id: string;
  name: string;
  minChoices: number;
  maxChoices: number;
  items: ComplementItem[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'FRITOS' | 'ASSADOS' | 'COMBOS' | 'BEBIDAS' | 'SOBREMESAS';
  image: string;
  recipe: { ingredientId: string; quantity: number }[];
  complementGroupIds?: string[]; // IDs dos grupos vinculados
  // Added optional properties to fix type errors in constants.tsx and AdminDashboard.tsx
  comboItems?: string[];
  stock?: number;
  minStock?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedComplements?: { groupName: string; items: ComplementItem[] }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  type: 'DELIVERY' | 'PICKUP' | 'DINE_IN';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}