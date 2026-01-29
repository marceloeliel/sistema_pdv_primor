
import React, { useMemo } from 'react';
import { Order, OrderStatus } from '../types';

interface KitchenKDSProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const KitchenKDS: React.FC<KitchenKDSProps> = ({ orders, onUpdateStatus }) => {
  const filteredOrders = useMemo(() => orders.filter(o => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.DELIVERED), [orders]);

  const columns = [
    { title: 'RECEBIDOS', status: OrderStatus.RECEIVED, color: 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow-900' },
    { title: 'PREPARANDO', status: OrderStatus.PREPARING, color: 'bg-blue-50 border-blue-200 text-blue-900' },
    { title: 'PRONTO', status: OrderStatus.READY, color: 'bg-green-50 border-green-200 text-green-900' }
  ];

  const getUrgencyClass = (createdAt: Date) => {
    const diff = (Date.now() - new Date(createdAt).getTime()) / 1000 / 60;
    if (diff > 15) return 'bg-red-500 animate-pulse text-white';
    if (diff > 10) return 'bg-orange-500 text-white';
    return 'bg-brand-dark text-white';
  };

  return (
    <div className="h-[calc(100vh-48px)] bg-brand-dark p-4 sm:p-6 overflow-hidden flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-white text-xl sm:text-3xl font-black italic uppercase tracking-tight">KDS - Produção</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-white/60 text-[10px] sm:text-xs font-bold">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span> +15 MIN
          </div>
          <div className="flex items-center gap-2 text-white/60 text-[10px] sm:text-xs font-bold">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-brand-yellow rounded-full"></span> NORMAL
          </div>
        </div>
      </header>

      {/* Horizontal Scroll on small screens, grid on large */}
      <div className="flex-1 flex overflow-x-auto gap-4 sm:gap-6 pb-4 sm:grid sm:grid-cols-3 sm:overflow-hidden hide-scrollbar">
        {columns.map(col => (
          <div key={col.title} className="flex flex-col gap-4 min-w-[280px] sm:min-w-0 h-full overflow-hidden">
            <div className={`p-3 sm:p-4 rounded-xl border-2 font-black uppercase text-center shadow-lg text-[10px] sm:text-base ${col.color}`}>
              {col.title} ({filteredOrders.filter(o => o.status === col.status).length})
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 hide-scrollbar">
              {filteredOrders.filter(o => o.status === col.status).map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                  <div className={`p-2.5 sm:p-3 flex justify-between items-center ${getUrgencyClass(order.createdAt)}`}>
                    <span className="font-black text-[10px] sm:text-sm">{order.id}</span>
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase">{order.type}</span>
                    <span className="text-[10px] sm:text-xs font-black">{Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)}m</span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="font-black text-brand-dark uppercase text-[9px] sm:text-xs mb-3">Cliente: {order.customerName}</h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center border-b border-gray-100 pb-1">
                          <span className="text-xs sm:text-sm font-black text-brand-red">{item.quantity}x</span>
                          <span className="text-xs sm:text-sm font-bold flex-1 ml-2 uppercase truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 sm:mt-6 flex gap-2">
                      {order.status === OrderStatus.RECEIVED && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)}
                          className="flex-1 bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase"
                        >
                          PREPARAR
                        </button>
                      )}
                      {order.status === OrderStatus.PREPARING && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.READY)}
                          className="flex-1 bg-green-600 text-white py-2 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase"
                        >
                          PRONTO
                        </button>
                      )}
                      {order.status === OrderStatus.READY && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)}
                          className="flex-1 bg-brand-dark text-white py-2 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase"
                        >
                          ENTREGAR
                        </button>
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

export default KitchenKDS;
