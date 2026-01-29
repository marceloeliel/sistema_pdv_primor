

import React, { useState } from 'react';
import { Product, Order, OrderStatus, PaymentMethod, ComplementGroup, ComplementItem, OrderItem } from '../../types';

interface StoreFrontProps {
  products: Product[];
  complementGroups: ComplementGroup[];
  onCreateOrder: (o: Order) => void;
}

const StoreFront: React.FC<StoreFrontProps> = ({ products, complementGroups, onCreateOrder }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customizing, setCustomizing] = useState<{ product: Product; selected: { [groupId: string]: ComplementItem[] } } | null>(null);

  const handleProductClick = (p: Product) => {
    if (p.complementGroupIds && p.complementGroupIds.length > 0) {
      setCustomizing({ product: p, selected: {} });
    } else {
      addToCartDirect(p, []);
    }
  };

  const toggleItem = (group: ComplementGroup, item: ComplementItem) => {
    if (!customizing) return;
    const current = customizing.selected[group.id] || [];
    const exists = current.find(x => x.id === item.id);
    
    let next;
    if (exists) {
      next = current.filter(x => x.id !== item.id);
    } else {
      if (current.length >= group.maxChoices && group.maxChoices === 1) {
        next = [item];
      } else if (current.length < group.maxChoices) {
        next = [...current, item];
      } else {
        return; // Atingiu o máximo
      }
    }
    
    setCustomizing({ ...customizing, selected: { ...customizing.selected, [group.id]: next } });
  };

  const addToCartDirect = (p: Product, selections: { groupName: string; items: ComplementItem[] }[]) => {
    const extraPrice = selections.reduce((s, g) => s + g.items.reduce((si, i) => si + i.price, 0), 0);
    const unitPrice = p.price + extraPrice;
    setCart(prev => [...prev, {
      productId: p.id,
      name: p.name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
      selectedComplements: selections.length > 0 ? selections : undefined
    }]);
  };

  const finalizeCustomization = () => {
    if (!customizing) return;
    
    // Validar mínimos
    for (const gid of customizing.product.complementGroupIds || []) {
      const group = complementGroups.find(x => x.id === gid);
      const selected = customizing.selected[gid] || [];
      if (group && selected.length < group.minChoices) {
        alert(`Selecione no mínimo ${group.minChoices} opção(ões) em "${group.name}"`);
        return;
      }
    }

    // Cast Object.entries to ensure items is recognized as ComplementItem[]
    const selections = (Object.entries(customizing.selected) as [string, ComplementItem[]][]).map(([gid, items]) => ({
      groupName: complementGroups.find(x => x.id === gid)?.name || 'Opção',
      items
    })).filter(s => s.items.length > 0);

    addToCartDirect(customizing.product, selections);
    setCustomizing(null);
  };

  const total = cart.reduce((s, i) => s + i.totalPrice, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-40">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black italic text-brand-red tracking-tighter">PRIMOR SALGADOS</h2>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">Peça agora e retire na hora</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(p => (
          <div key={p.id} onClick={() => handleProductClick(p)} className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-6 cursor-pointer hover:shadow-xl transition-all group">
            <div className="size-28 rounded-[2rem] overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={p.image} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black uppercase italic leading-tight">{p.name}</h3>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-brand-red font-black text-xl italic">R$ {p.price.toFixed(2)}</span>
                <span className="bg-brand-yellow text-brand-dark text-[8px] font-black px-3 py-1 rounded-full uppercase">Adicionar</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CUSTOMIZAÇÃO */}
      {customizing && (
        <div className="fixed inset-0 bg-brand-dark/90 z-[200] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] p-8 sm:p-10 space-y-8 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-6">
              <img src={customizing.product.image} className="size-20 rounded-2xl object-cover" />
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{customizing.product.name}</h3>
                <p className="text-xs font-bold text-brand-red">Personalize seu pedido</p>
              </div>
            </div>

            <div className="space-y-8">
              {customizing.product.complementGroupIds?.map(gid => {
                const group = complementGroups.find(x => x.id === gid);
                if (!group) return null;
                const selected = customizing.selected[gid] || [];
                return (
                  <div key={gid} className="space-y-3">
                    <div className="flex justify-between items-end border-b-2 border-brand-yellow/20 pb-2">
                      <h4 className="font-black uppercase text-sm">{group.name}</h4>
                      <span className="text-[9px] font-black text-gray-400 uppercase">
                        {group.minChoices > 0 ? `Obrigatório (${selected.length}/${group.maxChoices})` : `Opcional (Máx ${group.maxChoices})`}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {group.items.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => toggleItem(group, item)}
                          className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected.find(x => x.id === item.id) ? 'border-brand-red bg-brand-red/5' : 'border-gray-50 hover:border-gray-100'}`}
                        >
                          <span className="text-xs font-bold uppercase">{item.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-brand-red">+ R$ {item.price.toFixed(2)}</span>
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${selected.find(x => x.id === item.id) ? 'bg-brand-red border-brand-red text-white' : 'border-gray-300'}`}>
                              {selected.find(x => x.id === item.id) && <span className="material-symbols-outlined text-xs">check</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 border-t flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Preço Final</p>
                <p className="text-3xl font-black italic text-brand-dark">
                  {/* Cast Object.values and flat results to ComplementItem[] to fix unknown property access */}
                  R$ {(customizing.product.price + (Object.values(customizing.selected) as ComplementItem[][]).flat().reduce((s, i) => s + i.price, 0)).toFixed(2)}
                </p>
              </div>
              <button onClick={finalizeCustomization} className="bg-brand-red text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs shadow-xl shadow-brand-red/20 active:scale-95 transition-all">Confirmar Escolha</button>
            </div>
            <button onClick={() => setCustomizing(null)} className="w-full text-center text-[10px] font-black uppercase text-gray-300">Cancelar e Sair</button>
          </div>
        </div>
      )}

      {/* CARRINHO FIXO */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-[100]">
          <button onClick={() => {
            const order: Order = {
              id: `W-${Date.now()}`,
              orderNumber: `${Math.floor(Math.random()*900)+100}`,
              customerName: 'Cliente Digital',
              items: cart,
              subtotal: total,
              tax: 0,
              total,
              status: OrderStatus.RECEIVED,
              paymentMethod: PaymentMethod.PIX,
              type: 'PICKUP',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            onCreateOrder(order);
            setCart([]);
            alert('Pedido enviado para a cozinha! Acompanhe no balcão.');
          }} className="bg-brand-dark text-white flex items-center justify-between w-full h-20 px-10 rounded-[2.5rem] shadow-2xl border-b-[8px] border-black/30 active:scale-95 transition-all">
            <span className="font-black uppercase italic tracking-tighter">Finalizar Pedido • {cart.length} itens</span>
            <span className="text-2xl font-black italic text-brand-yellow">R$ {total.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreFront;