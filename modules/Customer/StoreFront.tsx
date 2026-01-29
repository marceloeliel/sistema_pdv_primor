
import React, { useState, useMemo } from 'react';
import { Product, Order, OrderStatus, PaymentMethod } from '../../types';

interface StoreFrontProps {
  products: Product[];
  onCreateOrder: (o: Order) => void;
}

const StoreFront: React.FC<StoreFrontProps> = ({ products, onCreateOrder }) => {
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');

  const categories = useMemo(() => ['TODOS', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'TODOS') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const next = { ...prev };
      const current = next[id] || 0;
      const val = current + delta;
      if (val <= 0) delete next[id];
      else next[id] = val;
      return next;
    });
  };

  const total = (Object.entries(cart) as [string, number][]).reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === id);
    return sum + (p?.price || 0) * qty;
  }, 0);

  const handleCheckout = () => {
    const order: Order = {
      id: `WEB-${Date.now()}`,
      orderNumber: `${Math.floor(Math.random() * 900) + 100}`,
      customerName: 'Cliente Digital',
      items: (Object.entries(cart) as [string, number][]).map(([id, qty]) => {
        const p = products.find(x => x.id === id)!;
        return { 
          productId: id, 
          name: p.name, 
          quantity: qty, 
          unitPrice: p.price, 
          totalPrice: p.price * qty 
        };
      }),
      subtotal: total,
      tax: 0,
      total,
      status: OrderStatus.RECEIVED,
      paymentMethod: PaymentMethod.PIX,
      type: 'DELIVERY',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onCreateOrder(order);
    setCart({});
    alert('Pedido recebido! Acompanhe o progresso no painel.');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-40">
      <div className="mb-8 sm:mb-12 text-center">
        <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter text-brand-dark uppercase">Cardápio Digital</h2>
        <p className="text-brand-red font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mt-2">Sabores que Primam pela Qualidade</p>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto gap-2 pb-6 hide-scrollbar mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all border-2 ${activeCategory === cat ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-gray-100 text-gray-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
              <div className="absolute top-4 right-4 bg-brand-yellow text-brand-dark px-3 py-1 rounded-full font-black text-sm shadow-lg">
                R$ {p.price.toFixed(2)}
              </div>
              {p.category === 'COMBOS' && (
                <div className="absolute top-4 left-4 bg-brand-red text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">
                  ECONOMIZE +
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-black text-brand-dark uppercase italic truncate">{p.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-2 line-clamp-2">{p.description}</p>
                
                {p.comboItems && p.comboItems.length > 0 && (
                  <div className="mt-4 p-3 bg-brand-light/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-[9px] font-black text-brand-red uppercase mb-2">Incluso no Combo:</p>
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {p.comboItems.map((item, i) => (
                        <li key={i} className="text-[10px] text-gray-500 font-bold flex items-center gap-1 truncate">
                          <span className="text-brand-yellow">★</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{p.category}</span>
                <div className="flex items-center gap-3">
                  {cart[p.id] && (
                    <button onClick={() => updateCart(p.id, -1)} className="bg-gray-100 size-8 sm:size-10 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base">-</button>
                  )}
                  {cart[p.id] && <span className="font-black w-4 text-center text-sm sm:text-base">{cart[p.id]}</span>}
                  <button onClick={() => updateCart(p.id, 1)} className="bg-brand-red text-white size-8 sm:size-10 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-brand-red/10 text-sm sm:text-base active:scale-90 transition-transform">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 sm:px-6 z-50">
          <button 
            onClick={handleCheckout}
            className="bg-brand-dark text-white flex items-center justify-between w-full h-16 sm:h-20 px-6 sm:px-8 rounded-2xl sm:rounded-3xl shadow-2xl border-b-4 border-black active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="bg-brand-yellow text-brand-dark px-2 py-1 rounded-lg font-black text-xs sm:text-sm">{(Object.values(cart) as number[]).reduce((a, b) => a + b, 0)}</span>
              <span className="font-black uppercase italic text-sm sm:text-lg tracking-tighter">Finalizar Pedido</span>
            </div>
            <span className="text-xl sm:text-2xl font-black italic">R$ {total.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreFront;
