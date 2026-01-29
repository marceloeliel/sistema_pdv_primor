
import React from 'react';
import { Product, Order, OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders }) => {
  const totalRevenue = orders.reduce((sum, o) => o.status === OrderStatus.DELIVERED || o.status === OrderStatus.READY ? sum + o.total : sum, 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const data = products.map(p => ({
    name: p.name.split(' ')[0],
    stock: p.stock,
    min: p.minStock
  }));

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-brand-red tracking-tight">Painel Administrativo</h2>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-widest">
          Hoje, {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Faturamento', value: `R$ ${totalRevenue.toFixed(2)}`, icon: 'payments', color: 'text-green-600' },
          { label: 'Pedidos Total', value: totalOrders, icon: 'receipt', color: 'text-blue-600' },
          { label: 'Ticket Médio', value: `R$ ${avgTicket.toFixed(2)}`, icon: 'analytics', color: 'text-purple-600' },
          { label: 'Alerta Estoque', value: products.filter(p => p.stock <= p.minStock).length, icon: 'warning', color: 'text-brand-red' }
        ].map(kpi => (
          <div key={kpi.label} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4">
            <div className={`size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center ${kpi.color}`}>
              <span className="material-symbols-outlined text-2xl sm:text-3xl">{kpi.icon}</span>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 tracking-wider">{kpi.label}</p>
              <p className="text-lg sm:text-2xl font-black text-brand-dark">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections - Stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Inventory Table */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight">Controle de Insumos</h3>
            <button className="bg-brand-red text-white text-[9px] sm:text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">Repor Tudo</button>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <img src={p.image} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-cover" />
                  <div>
                    <p className="text-[11px] sm:text-sm font-bold text-brand-dark truncate max-w-[120px] sm:max-w-none">{p.name}</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">{p.category}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className={`text-[11px] sm:text-sm font-black ${p.stock <= p.minStock ? 'text-brand-red' : 'text-brand-dark'}`}>
                      {p.stock} un.
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Mín: {p.minStock}</p>
                  </div>
                  {p.stock <= p.minStock && (
                    <div className="bg-red-100 text-brand-red px-2 py-1 rounded text-[8px] sm:text-[10px] font-black animate-pulse hidden sm:block">ALERTA</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
          <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight mb-6">Nível de Estoque Real</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '8px', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '8px' }} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} />
                <Bar dataKey="stock" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stock <= entry.min ? '#E31837' : '#FFBC0D'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t text-[8px] sm:text-[10px] text-gray-400 uppercase font-black text-center italic">
            Gráfico atualizado em tempo real.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
