
import React, { useState, useEffect } from 'react';
import { User, UserRole, Order, OrderStatus, Product, Ingredient } from './types';
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
  const [products] = useState<Product[]>(PRODUCTS);

  // Persistence Simulation
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
    // Simulate real-time update logic
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        // If delivered, deduct stock
        if (status === OrderStatus.DELIVERED && o.status !== OrderStatus.DELIVERED) {
          deductStockForOrder(o);
        }
        return { ...o, status, updatedAt: new Date() };
      }
      return o;
    }));
  };

  const deductStockForOrder = (order: Order) => {
    setInventory(prevInv => {
      const newInv = [...prevInv];
      order.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        prod?.recipe.forEach(recipeItem => {
          const idx = newInv.findIndex(i => i.id === recipeItem.ingredientId);
          if (idx !== -1) {
            newInv[idx].currentStock -= recipeItem.quantity * item.quantity;
          }
        });
      });
      return newInv;
    });
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <header className="bg-brand-dark text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black italic tracking-tighter text-brand-yellow">PRIMOR OS</h1>
          <span className="bg-brand-red px-2 py-0.5 rounded text-[10px] font-bold uppercase">{user.role}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400">Olá, {user.name}</span>
          <button onClick={handleLogout} className="material-symbols-outlined text-sm hover:text-brand-red">logout</button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {user.role === UserRole.CUSTOMER && <StoreFront products={products} onCreateOrder={createOrder} />}
        {user.role === UserRole.CASHIER && <POS products={products} onCreateOrder={createOrder} />}
        {user.role === UserRole.KITCHEN && <KDS orders={orders} onUpdateStatus={updateOrderStatus} />}
        {user.role === UserRole.ADMIN && <Admin products={products} orders={orders} inventory={inventory} />}
      </main>

      {/* Global Module Switcher for Demo Purposes */}
      <div className="fixed bottom-4 left-4 flex gap-2 z-[9999] opacity-50 hover:opacity-100 transition-opacity">
        {Object.values(UserRole).map(role => (
          <button
            key={role}
            onClick={() => setUser(SYSTEM_USERS.find(u => u.role === role) || { id: 'temp', username: 'guest', role, name: 'Guest ' + role })}
            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${user.role === role ? 'bg-brand-yellow text-brand-dark border-brand-yellow' : 'bg-white text-gray-400 border-gray-200'}`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
