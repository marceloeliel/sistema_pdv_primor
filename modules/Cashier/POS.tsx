
import React, { useState, useMemo } from 'react';
import { Product, Order, OrderStatus, PaymentMethod } from '../../types';

interface POSProps {
  products: Product[];
  onCreateOrder: (o: Order) => void;
}

const POS: React.FC<POSProps> = ({ products, onCreateOrder }) => {
  const [currentOrder, setCurrentOrder] = useState<{ [id: string]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');

  const categories = useMemo(() => ['TODOS', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'TODOS') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const addItem = (p: Product) => {
    setCurrentOrder(prev => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
  };

  const removeItem = (id: string) => {
    setCurrentOrder(prev => {
      const next = { ...prev };
      const current = next[id] || 0;
      if (current > 1) next[id] = current - 1;
      else delete next[id];
      return next;
    });
  };

  const total = (Object.entries(currentOrder) as [string, number][]).reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === id);
    return sum + (p?.price || 0) * qty;
  }, 0);

  const handleFinish = () => {
    if (Object.keys(currentOrder).length === 0) return;
    const order: Order = {
      id: `PDV-${Date.now()}`,
      orderNumber: `${Math.floor(Math.random() * 900) + 100}`,
      customerName: customerName || 'Balcão',
      items: (Object.entries(currentOrder) as [string, number][]).map(([id, qty]) => {
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
      paymentMethod: payment,
      type: 'DINE_IN',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onCreateOrder(order);
    setCurrentOrder({});
    setCustomerName('');
    alert('Pedido enviado para a cozinha com sucesso!');
  };

  const translatePayment = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.PIX: return 'PIX';
      case PaymentMethod.CREDIT_CARD: return 'CARTÃO CRÉDITO';
      case PaymentMethod.DEBIT_CARD: return 'CARTÃO DÉBITO';
      case PaymentMethod.CASH: return 'DINHEIRO';
      default: return method;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] bg-gray-100 overflow-hidden">
      {/* Grid de Produtos */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-6 sticky top-0 bg-gray-100 z-10 py-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase shadow-sm border-2 transition-all ${activeCategory === cat ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-white text-gray-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 pb-10">
          {filteredProducts.map(p => (
            <button
              key={p.id}
              onClick={() => addItem(p)}
              className="bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-3xl shadow-sm hover:shadow-xl hover:ring-2 hover:ring-brand-yellow transition-all flex flex-col items-center text-center group active:scale-95"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 sm:mb-3 border-4 border-gray-50 group-hover:border-brand-yellow/20">
                <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase text-brand-dark line-clamp-2 h-7 sm:h-8 leading-tight">{p.name}</span>
              <span className="text-brand-red font-black text-sm sm:text-base mt-1 sm:mt-2">R$ {p.price.toFixed(2)}</span>
              {p.category === 'COMBOS' && (
                <div className="mt-2 text-[8px] font-bold text-green-500 uppercase tracking-tighter">Super Oferta</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Painel Lateral de Checkout */}
      <div className="w-full lg:w-[420px] bg-white border-t lg:border-t-0 lg:border-l shadow-2xl flex flex-col max-h-[60vh] lg:max-h-full">
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto border-b hide-scrollbar">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase">Itens do Pedido</h3>
            <button onClick={() => setCurrentOrder({})} className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase">Limpar Tudo</button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {(Object.entries(currentOrder) as [string, number][]).length === 0 ? (
              <div className="text-center py-10 text-gray-300 font-bold italic text-sm">Nenhum item adicionado</div>
            ) : (
              (Object.entries(currentOrder) as [string, number][]).map(([id, qty]) => {
                const p = products.find(x => x.id === id)!;
                return (
                  <div key={id} className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-brand-yellow/30 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); addItem(p); }} className="text-[10px] font-black text-gray-300 hover:text-brand-red">▲</button>
                        <span className="bg-brand-red text-white size-7 sm:size-8 rounded-lg flex items-center justify-center font-black text-xs">{qty}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeItem(id); }} className="text-[10px] font-black text-gray-300 hover:text-brand-red">▼</button>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] sm:text-xs font-black uppercase leading-tight truncate">{p.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400">R$ {p.price.toFixed(2)} un.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-black text-sm text-brand-dark">R$ {(p.price * qty).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="p-4 sm:p-8 bg-gray-50/50 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Nome do Cliente / Mesa"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="flex-1 bg-white border-gray-100 rounded-2xl py-3 px-5 text-sm font-bold shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[PaymentMethod.PIX, PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD, PaymentMethod.CASH].map(m => (
              <button
                key={m}
                onClick={() => setPayment(m)}
                className={`py-2 rounded-xl text-[8px] font-black uppercase border-2 transition-all flex flex-col items-center justify-center gap-1 ${payment === m ? 'border-brand-red bg-brand-red text-white' : 'border-white bg-white text-gray-400 shadow-sm hover:border-brand-yellow/20'}`}
              >
                <span className="material-symbols-outlined text-base">
                  {m === PaymentMethod.PIX ? 'qr_code' : m === PaymentMethod.CASH ? 'payments' : 'credit_card'}
                </span>
                {translatePayment(m)}
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-dashed border-gray-300">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400">Total a Pagar</p>
              <h4 className="text-2xl sm:text-4xl font-black italic text-brand-dark tracking-tighter">R$ {total.toFixed(2)}</h4>
            </div>
            <button
              onClick={handleFinish}
              disabled={Object.keys(currentOrder).length === 0}
              className="bg-brand-yellow text-brand-dark px-6 sm:px-10 py-3 sm:py-5 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-brand-yellow/20 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all uppercase italic"
            >
              Concluir Venda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
