
import React, { useState } from 'react';
import { Product, Order, Ingredient, OrderStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminProps {
  products: Product[];
  orders: Order[];
  inventory: Ingredient[];
}

const Admin: React.FC<AdminProps> = ({ products, orders, inventory }) => {
  // Alterado para português para manter consistência com a UI
  const [activeTab, setActiveTab] = useState<'PAINEL' | 'PRODUTOS' | 'ESTOQUE' | 'FINANCEIRO'>('PAINEL');

  const totalRevenue = orders.reduce((sum, o) => o.status === OrderStatus.DELIVERED ? sum + o.total : sum, 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const chartData = inventory.map(i => ({
    name: i.name.split(' ')[0],
    stock: i.currentStock,
    min: i.minStock
  }));

  const tabs = [
    { id: 'PAINEL', label: 'PAINEL' },
    { id: 'PRODUTOS', label: 'PRODUTOS' },
    { id: 'ESTOQUE', label: 'ESTOQUE' },
    { id: 'FINANCEIRO', label: 'FINANCEIRO' }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black italic text-brand-dark uppercase tracking-tighter">Backoffice Corporativo</h2>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Primor OS • Gerenciamento Global</p>
        </div>
        
        {/* Menu de Sub-abas Traduzido */}
        <div className="bg-white p-1 rounded-2xl shadow-sm border flex gap-1 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-brand-red text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'PAINEL' && (
        <div className="space-y-8 animate-fade-in">
          {/* Seção de KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Receita Realizada', value: `R$ ${totalRevenue.toFixed(2)}`, icon: 'monetization_on', color: 'text-green-500' },
              { label: 'Volume de Pedidos', value: totalOrders, icon: 'receipt_long', color: 'text-blue-500' },
              { label: 'Ticket Médio', value: `R$ ${avgTicket.toFixed(2)}`, icon: 'analytics', color: 'text-purple-500' },
              { label: 'Ruptura de Estoque', value: inventory.filter(i => i.currentStock <= i.minStock).length, icon: 'inventory_2', color: 'text-brand-red' }
            ].map(kpi => (
              <div key={kpi.label} className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-6">
                <div className={`size-12 sm:size-14 rounded-2xl bg-gray-50 flex items-center justify-center ${kpi.color}`}>
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">{kpi.icon}</span>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">{kpi.label}</p>
                  <p className="text-xl sm:text-2xl font-black text-brand-dark">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monitor de Inventário */}
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter">Status de Insumos</h3>
                <span className="bg-gray-50 px-3 py-1 rounded-lg text-[9px] font-black text-gray-400">VISTA GERAL</span>
              </div>
              <div className="space-y-6 flex-1">
                {inventory.slice(0, 5).map(item => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-black uppercase text-brand-dark">{item.name}</span>
                      <span className={`text-[9px] font-black ${item.currentStock <= item.minStock ? 'text-brand-red' : 'text-gray-400'}`}>
                        {item.currentStock.toFixed(1)} {item.unit} / Mín {item.minStock} {item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${item.currentStock <= item.minStock ? 'bg-brand-red' : 'bg-brand-yellow'}`}
                        style={{ width: `${Math.min((item.currentStock / (item.minStock * 2.5)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Distribuição */}
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
              <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter mb-8">Estoque vs Pedidos</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold', fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} style={{ fontSize: '9px', fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      cursor={{ fill: '#f8fafc' }}
                      labelStyle={{ fontWeight: 'bold', color: '#272727' }}
                    />
                    <Bar dataKey="stock" name="Estoque Atual" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.stock <= entry.min ? '#E31837' : '#FFBC0D'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PRODUTOS' && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Gerenciamento de Cardápio</h3>
              <button className="bg-brand-red text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-brand-red/10 hover:scale-105 transition-transform">Novo Produto / Combo</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex gap-4 hover:border-brand-yellow transition-all group">
                  <img src={p.image} className="size-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={p.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-brand-red uppercase mb-1">{p.category}</p>
                    <p className="text-xs font-black text-brand-dark uppercase truncate">{p.name}</p>
                    <p className="text-sm font-black text-brand-dark mt-1">R$ {p.price.toFixed(2)}</p>
                    {p.category === 'COMBOS' && (
                      <div className="mt-2 flex gap-1 overflow-hidden">
                        {p.comboItems?.slice(0, 2).map((ci, idx) => (
                          <span key={idx} className="bg-white px-1.5 py-0.5 rounded text-[7px] font-bold text-gray-400 border border-gray-100 whitespace-nowrap">
                            {ci}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="material-symbols-outlined text-gray-300 hover:text-blue-500 text-lg transition-colors">edit</button>
                    <button className="material-symbols-outlined text-gray-300 hover:text-brand-red text-lg transition-colors">delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'FINANCEIRO' && (
        <div className="animate-fade-in">
          <div className="bg-brand-dark rounded-[2.5rem] p-6 sm:p-10 shadow-2xl overflow-hidden border-b-[12px] border-brand-red">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-8">Fluxo de Caixa Consolidado</h3>
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 text-[9px] font-black uppercase text-white/30 px-2 tracking-widest">Documento</th>
                    <th className="py-4 text-[9px] font-black uppercase text-white/30 px-2 tracking-widest">Entidade</th>
                    <th className="py-4 text-[9px] font-black uppercase text-white/30 px-2 tracking-widest">Valor Operacional</th>
                    <th className="py-4 text-[9px] font-black uppercase text-white/30 px-2 tracking-widest">Método</th>
                    <th className="py-4 text-[9px] font-black uppercase text-white/30 px-2 tracking-widest text-right">Liquidação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-white/20 font-bold italic text-xs">Nenhuma transação registrada no período</td></tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="text-white hover:bg-white/5 transition-colors">
                        <td className="py-5 px-2 font-black italic text-brand-yellow text-sm">#{order.orderNumber}</td>
                        <td className="py-5 px-2 text-xs font-bold text-white/80">{order.customerName}</td>
                        <td className="py-5 px-2 text-sm font-black">R$ {order.total.toFixed(2)}</td>
                        <td className="py-5 px-2 text-[10px] font-black uppercase text-white/50 tracking-tighter">{order.paymentMethod.replace('_', ' ')}</td>
                        <td className="py-5 px-2 text-right">
                          <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tight ${
                            order.status === OrderStatus.DELIVERED ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 
                            order.status === OrderStatus.CANCELLED ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/20'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ESTOQUE' && (
        <div className="animate-fade-in bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Inventário Detalhado</h3>
              <div className="flex gap-2">
                <button className="bg-gray-50 border text-[9px] font-black px-4 py-2 rounded-xl uppercase hover:bg-gray-100">Ajuste Manual</button>
                <button className="bg-brand-red text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-brand-red/10">Registrar Compra</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {inventory.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl group border border-transparent hover:border-brand-yellow/20 transition-all">
                  <div className={`size-12 rounded-xl flex items-center justify-center font-black text-xs ${item.currentStock <= item.minStock ? 'bg-red-100 text-brand-red' : 'bg-brand-yellow/10 text-brand-dark'}`}>
                    {item.unit}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-xs font-black uppercase text-brand-dark">{item.name}</p>
                       <p className="text-[10px] font-bold text-gray-400">Custo: R$ {item.costPrice.toFixed(2)}/{item.unit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white h-2 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${item.currentStock <= item.minStock ? 'bg-brand-red' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((item.currentStock / (item.minStock * 2)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-black min-w-[60px] text-right ${item.currentStock <= item.minStock ? 'text-brand-red' : 'text-brand-dark'}`}>
                        {item.currentStock.toFixed(1)} {item.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
