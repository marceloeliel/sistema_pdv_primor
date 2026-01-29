
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">KDS - Fluxo de Produção</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-white/40 uppercase">
            <span className="w-3 h-3 bg-brand-yellow rounded-full"></span> {activeOrders.filter(o => o.status === OrderStatus.RECEIVED).length} Aguardando
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-white/40 uppercase">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span> {activeOrders.filter(o => o.status === OrderStatus.PREPARING).length} No Fogo
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
        {columns.map(col => (
          <div key={col.title} className="flex flex-col gap-6 overflow-hidden">
            <div className={`${col.bg} ${col.border} ${col.text} border-2 p-4 rounded-2xl font-black uppercase text-center text-sm shadow-xl`}>
              {col.title}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pb-12 hide-scrollbar">
              {activeOrders.filter(o => o.status === col.status).map(order => (
                <div key={order.id} className="bg-white rounded-3xl overflow-hidden shadow-2xl border-b-8 border-gray-100 animate-fade-in">
                  <div className="bg-brand-dark p-3 flex justify-between items-center">
                    <span className="text-brand-yellow font-black italic text-lg">#{order.orderNumber}</span>
                    <span className="text-[8px] font-black text-white/40 uppercase">{order.type}</span>
                    <span className="text-[10px] font-black text-white bg-white/10 px-2 py-0.5 rounded">
                      {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xs font-black uppercase text-gray-400">Cliente: {order.customerName}</h4>
                    </div>
                    
                    <div className="space-y-2 mb-8">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-xl">
                          <span className="bg-brand-red text-white size-6 rounded flex items-center justify-center font-black text-[10px]">{item.quantity}x</span>
                          <span className="flex-1 ml-3 text-xs font-bold uppercase truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {order.status === OrderStatus.RECEIVED && (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">Começar</button>
                      )}
                      {order.status === OrderStatus.PREPARING && (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.READY)} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">Finalizar</button>
                      )}
                      {order.status === OrderStatus.READY && (
                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)} className="flex-1 bg-brand-dark text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">Entregar</button>
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
