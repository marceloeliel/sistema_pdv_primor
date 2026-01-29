
import React, { useState } from 'react';
import { Product, Order, OrderStatus, PaymentMethod } from '../types';

interface PDVProps {
  products: Product[];
  onPlaceOrder: (order: Order) => void;
}

const PDV: React.FC<PDVProps> = ({ products }) => {
  const [currentOrder, setCurrentOrder] = useState<{ [id: string]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.PIX);

  const addToOrder = (p: Product) => {
    setCurrentOrder(prev => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
  };

  const removeItem = (id: string) => {
    setCurrentOrder(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const total = (Object.entries(currentOrder) as [string, number][]).reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === id);
    return sum + (p?.price || 0) * qty;
  }, 0);

  const handleFinish = () => {
    if (Object.keys(currentOrder).length === 0) return;
    // ... logic for placing order ... (simulated as App.tsx handles state)
    alert('Pedido enviado para produção!');
    setCurrentOrder({});
    setCustomerName('');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] bg-gray-100 overflow-hidden">
      {/* Products Grid */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-black italic text-brand-red uppercase">PDV - Balcão</h2>
          <div className="flex flex-wrap gap-2">
            {['FRITOS', 'ASSADOS', 'COMBOS', 'BEBIDAS'].map(cat => (
              <button key={cat} className="bg-white border px-3 py-1 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">{cat}</button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map(p => (
            <button 
              key={p.id}
              onClick={() => addToOrder(p)}
              className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-yellow border border-transparent transition-all flex flex-col items-center text-center group"
            >
              <img src={p.image} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mb-2 group-hover:scale-110 transition-transform" alt={p.name} />
              <span className="text-[9px] font-black uppercase text-gray-400">{p.category}</span>
              <span className="text-[11px] sm:text-xs font-bold leading-tight my-1 h-8 overflow-hidden line-clamp-2">{p.name}</span>
              <span className="text-brand-red font-black text-sm sm:text-base">R$ {p.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Payment - Responsive Sidebar/Bottom Panel */}
      <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l shadow-2xl flex flex-col max-h-[50vh] lg:max-h-full">
        <div className="p-4 sm:p-6 border-b flex-1 overflow-y-auto hide-scrollbar">
          <h3 className="text-base sm:text-lg font-black uppercase italic mb-4">Pedido Atual</h3>
          {Object.entries(currentOrder).length === 0 ? (
            <div className="h-20 sm:h-40 flex items-center justify-center text-gray-300 italic text-sm">Nenhum item</div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {(Object.entries(currentOrder) as [string, number][]).map(([id, qty]) => {
                const p = products.find(x => x.id === id)!;
                return (
                  <div key={id} className="flex justify-between items-center text-xs sm:text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-black bg-brand-yellow/20 text-brand-red px-1.5 rounded flex-shrink-0">{qty}x</span>
                      <span className="font-bold truncate">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-medium">R$ {(p.price * qty).toFixed(2)}</span>
                      <button onClick={() => removeItem(id)} className="text-red-300 hover:text-red-500">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 bg-gray-50 space-y-3 sm:space-y-4">
          <input 
            type="text" 
            placeholder="Nome do Cliente" 
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="w-full rounded-xl border-gray-200 text-sm font-bold p-2.5 sm:p-3"
          />
          
          <div className="grid grid-cols-3 gap-2">
            {/* Fix: Changed PaymentMethod.CARD to PaymentMethod.CREDIT_CARD */}
            {[PaymentMethod.PIX, PaymentMethod.CREDIT_CARD, PaymentMethod.CASH].map(m => (
              <button 
                key={m} 
                onClick={() => setPayment(m)}
                className={`py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase border-2 transition-all ${payment === m ? 'border-brand-red bg-brand-red text-white' : 'border-gray-200 bg-white text-gray-400'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-500 font-bold uppercase text-[10px] sm:text-xs">Total</span>
            <span className="text-xl sm:text-3xl font-black text-brand-dark">R$ {total.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleFinish}
            disabled={Object.keys(currentOrder).length === 0}
            className="w-full bg-brand-red text-white py-3 sm:py-4 rounded-2xl font-black text-sm sm:text-lg shadow-xl active:scale-95 disabled:grayscale disabled:opacity-50"
          >
            FINALIZAR VENDA
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDV;
