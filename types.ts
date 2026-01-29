
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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'FRITOS' | 'ASSADOS' | 'COMBOS' | 'BEBIDAS' | 'SOBREMESAS';
  image: string;
  recipe: { ingredientId: string; quantity: number }[]; // Ficha técnica
  comboItems?: string[]; // Names of items included in the combo
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
