
import React, { useState, useEffect } from 'react';
import { User, UserRole, Order, OrderStatus, Product, Ingredient, ComplementGroup } from './types';
import { SYSTEM_USERS, PRODUCTS, INGREDIENTS } from './constants';
import Login from './modules/Auth/Login';
import StoreFront from './modules/Customer/StoreFront';
import POS from './modules/Cashier/POS';
import KDS from './modules/Kitchen/KDS';
import Admin from './modules/Admin/Admin';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Ingredient[]>(INGREDIENTS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [complementGroups, setComplementGroups] = useState<ComplementGroup[]>([
    {
      id: 'cg1',
      name: 'Escolha seu Molho',
      minChoices: 0,
      maxChoices: 2,
      items: [
        { id: 'ci1', name: 'Maionese Caseira', price: 0 },
        { id: 'ci2', name: 'Ketchup Defumado', price: 0 },
        { id: 'ci3', name: 'Mostarda e Mel', price: 2.50 }
      ]
    }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('primor_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('primor_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('primor_user');
  };

  const createOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, updatedAt: new Date() } : o));
  };

  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const addComplementGroup = (g: ComplementGroup) => setComplementGroups(prev => [...prev, g]);
  const deleteComplementGroup = (id: string) => setComplementGroups(prev => prev.filter(g => g.id !== id));

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'ADMINISTRADOR';
      case UserRole.CASHIER: return 'CAIXA';
      case UserRole.KITCHEN: return 'COZINHA';
      case UserRole.CUSTOMER: return 'CLIENTE';
      default: return role;
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <header className="bg-brand-dark text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black italic tracking-tighter text-brand-yellow">PRIMOR OS</h1>
          <span className="bg-brand-red px-2 py-0.5 rounded text-[10px] font-bold uppercase">{getRoleLabel(user.role)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400">Olá, {user.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-1 hover:text-brand-red transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="text-[10px] font-bold uppercase">Sair</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {user.role === UserRole.CUSTOMER && (
          <StoreFront 
            products={products} 
            complementGroups={complementGroups} 
            onCreateOrder={createOrder} 
          />
        )}
        {user.role === UserRole.CASHIER && <POS products={products} onCreateOrder={createOrder} />}
        {user.role === UserRole.KITCHEN && <KDS orders={orders} onUpdateStatus={updateOrderStatus} />}
        {user.role === UserRole.ADMIN && (
          <Admin 
            products={products} 
            orders={orders} 
            inventory={inventory}
            complementGroups={complementGroups}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            onAddComplementGroup={addComplementGroup}
            onDeleteComplementGroup={deleteComplementGroup}
            onUpdateStock={(id, amt) => setInventory(prev => prev.map(inv => inv.id === id ? {...inv, currentStock: inv.currentStock + amt} : inv))}
          />
        )}
      </main>

      <div className="fixed bottom-4 left-4 flex gap-2 z-[9999] opacity-30 hover:opacity-100 transition-opacity">
        {Object.values(UserRole).map(role => (
          <button
            key={role}
            onClick={() => setUser(SYSTEM_USERS.find(u => u.role === role) || { id: 'temp', username: 'guest', role, name: 'Demo ' + role })}
            className={`px-3 py-1 rounded-full text-[9px] font-black border ${user.role === role ? 'bg-brand-yellow text-brand-dark border-brand-yellow' : 'bg-white text-gray-400 border-gray-200'}`}
          >
            {getRoleLabel(role)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
