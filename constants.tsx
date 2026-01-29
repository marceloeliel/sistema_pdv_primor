
import { Product, Ingredient, UserRole, User } from './types';

export const SYSTEM_USERS: User[] = [
  { id: 'u1', username: 'admin', role: UserRole.ADMIN, name: 'Gerente Primor' },
  { id: 'u2', username: 'caixa1', role: UserRole.CASHIER, name: 'Operador 01' },
  { id: 'u3', username: 'cozinha1', role: UserRole.KITCHEN, name: 'Chef de Produção' }
];

export const INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Massa Base', unit: 'KG', currentStock: 50, minStock: 10, costPrice: 5.50 },
  { id: 'i2', name: 'Frango Desfiado', unit: 'KG', currentStock: 30, minStock: 5, costPrice: 18.00 },
  { id: 'i3', name: 'Óleo Vegetal', unit: 'LT', currentStock: 20, minStock: 4, costPrice: 8.00 },
  { id: 'i4', name: 'Embalagem Combo', unit: 'UN', currentStock: 500, minStock: 100, costPrice: 0.45 },
  { id: 'i5', name: 'Carne Bovina', unit: 'KG', currentStock: 25, minStock: 5, costPrice: 32.00 }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Coxinha Suprema',
    description: 'Massa de batata especial com recheio de frango e catupiry.',
    price: 8.50,
    category: 'FRITOS',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400',
    recipe: [{ ingredientId: 'i1', quantity: 0.1 }, { ingredientId: 'i2', quantity: 0.05 }]
  },
  {
    id: 'p2',
    name: 'Combo Galera (100 Salgados)',
    description: '100 salgados mini variados + 2 Refrigerantes 2L.',
    price: 119.90,
    category: 'COMBOS',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=400',
    recipe: [{ ingredientId: 'i4', quantity: 1 }],
    comboItems: ['50 Mini Coxinhas', '50 Mini Quibes', '2L Coca-Cola', '2L Guaraná']
  },
  {
    id: 'p3',
    name: 'Kibe com Queijo',
    description: 'Kibe tradicional frito recheado com mussarela argentina.',
    price: 7.90,
    category: 'FRITOS',
    image: 'https://images.unsplash.com/photo-1606331123988-97bc1b2a7439?auto=format&fit=crop&q=80&w=400',
    recipe: [{ ingredientId: 'i1', quantity: 0.1 }]
  },
  {
    id: 'p4',
    name: 'Suco Natural Laranja',
    description: 'Suco de laranja 100% natural espremido na hora.',
    price: 9.00,
    category: 'BEBIDAS',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400',
    recipe: []
  },
  {
    id: 'p5',
    name: 'Combo Duplo Snack',
    description: '2 Salgados Grandes + 1 Suco 300ml.',
    price: 24.90,
    category: 'COMBOS',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
    recipe: [{ ingredientId: 'i4', quantity: 1 }],
    comboItems: ['1 Coxinha', '1 Kibe', '1 Suco Laranja']
  },
  {
    id: 'p6',
    name: 'Pão de Queijo Mineiro',
    description: 'O verdadeiro pão de queijo com queijo canastra.',
    price: 4.50,
    category: 'ASSADOS',
    image: 'https://images.unsplash.com/photo-1598143102012-4097b059a7a7?auto=format&fit=crop&q=80&w=400',
    recipe: [{ ingredientId: 'i1', quantity: 0.05 }]
  }
];
