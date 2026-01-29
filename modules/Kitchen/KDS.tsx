
import React from 'react';
import { Order, OrderStatus } from '../../types';

interface KDSProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const KDS: React.FC<KDSProps> = ({ orders, onUpdateStatus }) => {
  const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);

  const columns = [
    { title: 'RECEBIDO', status: OrderStatus.RECEIVED, bg: 'bg-brand-yellow/10', border: 'border-brand-yellow', text: 'text-brand-yellow-900' },
    { title: 'PREPARANDO', status: OrderStatus.PREPARING, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
    { title: 'PRONTO', status: OrderStatus.READY, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' }
  ];

  return (
    <div className="h-[calc(100vh-48px)] bg-brand-dark p-6 overflow-hidden flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Fluxo de Produção</h2>
        <div className="flex items-center gap-2 bg-white/5 px-6 py-2 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Sistema Primor Inteligente
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
        {columns.map(col => (
          <div key={col.title} className="flex flex-col gap-6 overflow-hidden">
            <div className={`${col.bg} ${col.border} ${col.text} border-2 p-4 rounded-2xl font-black uppercase text-center text-xs shadow-xl`}>
              {col.title} ({activeOrders.filter(o => o.status === col.status).length})
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pb-12 hide-scrollbar">
              {activeOrders.filter(o => o.status === col.status).map(order => (
                <div key={order.id} className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border-b-8 border-gray-100 animate-fade-in">
                  <div className="bg-brand-dark p-4 flex justify-between items-center">
                    <span className="text-brand-yellow font-black italic text-xl">#{order.orderNumber}</span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">{order.customerName}</span>
                    <span className="text-[9px] font-black text-white bg-white/10 px-2 py-1 rounded">
                      {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)}m
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4 mb-8">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border-l-4 border-brand-red">
                          <div className="flex items-center gap-3">
                            <span className="bg-brand-red text-white size-7 rounded-lg flex items-center justify-center font-black text-xs">{item.quantity}x</span>
                            <span className="flex-1 text-xs font-black uppercase truncate">{item.name}</span>
                          </div>
                          {item.selectedComplements && item.selectedComplements.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                              <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Com extras:</p>
                              <div className="flex flex-wrap gap-1">
                                {item.selectedComplements.map(c => (
                                  <span key={c.id} className="bg-white px-2 py-0.5 rounded text-[9px] font-bold text-brand-dark border shadow-sm">
                                    + {c.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {order.status === OrderStatus.RECEIVED && (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all">Iniciar Preparo</button>
                      )}
                      {order.status === OrderStatus.PREPARING && (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.READY)} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all">Item Pronto</button>
                      )}
                      {order.status === OrderStatus.READY && (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)} className="flex-1 bg-brand-dark text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all">Entregar Pedido</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KDS;
