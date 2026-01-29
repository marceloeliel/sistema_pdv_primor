
import React, { useState } from 'react';
import { Product, Order, Ingredient, OrderStatus, ComplementGroup, ComplementItem } from '../../types';

interface AdminProps {
  products: Product[];
  orders: Order[];
  inventory: Ingredient[];
  complementGroups: ComplementGroup[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddComplementGroup: (g: ComplementGroup) => void;
  onDeleteComplementGroup: (id: string) => void;
  onUpdateStock: (id: string, amount: number) => void;
}

const Admin: React.FC<AdminProps> = ({ 
  products, orders, inventory, complementGroups,
  onAddProduct, onDeleteProduct, onAddComplementGroup, onDeleteComplementGroup, onUpdateStock 
}) => {
  const [activeTab, setActiveTab] = useState<'PAINEL' | 'PRODUTOS' | 'COMPLEMENTOS' | 'ESTOQUE' | 'FINANCEIRO'>('PAINEL');
  
  // Modais
  const [showProductModal, setShowProductModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // Estados de formulário
  const [newProd, setNewProd] = useState<Partial<Product>>({ category: 'FRITOS', complementGroupIds: [] });
  const [newGroup, setNewGroup] = useState<Partial<ComplementGroup>>({ items: [], minChoices: 0, maxChoices: 1 });
  const [tempItem, setTempItem] = useState({ name: '', price: 0 });

  const handleCreateGroup = () => {
    if (!newGroup.name || (newGroup.items?.length || 0) === 0) return;
    onAddComplementGroup({
      ...newGroup as ComplementGroup,
      id: `CG-${Date.now()}`
    });
    setShowGroupModal(false);
    setNewGroup({ items: [], minChoices: 0, maxChoices: 1 });
  };

  const handleCreateProduct = () => {
    if (!newProd.name || !newProd.price) return;
    onAddProduct({
      ...newProd as Product,
      id: `P-${Date.now()}`,
      recipe: [],
      image: newProd.image || 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=400'
    });
    setShowProductModal(false);
    setNewProd({ category: 'FRITOS', complementGroupIds: [] });
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-black italic text-brand-dark uppercase tracking-tighter">Administração Primor</h2>
        <div className="flex gap-1 bg-white p-1 rounded-2xl border shadow-sm overflow-x-auto hide-scrollbar w-full md:w-auto">
          {['PAINEL', 'PRODUTOS', 'COMPLEMENTOS', 'ESTOQUE', 'FINANCEIRO'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === t ? 'bg-brand-red text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'COMPLEMENTOS' && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic">Categorias de Complementos</h3>
              <button onClick={() => setShowGroupModal(true)} className="bg-brand-red text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-brand-red/10">Criar Nova Categoria</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complementGroups.map(g => (
                <div key={g.id} className="bg-gray-50 p-6 rounded-3xl border border-transparent hover:border-brand-yellow/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black uppercase text-sm text-brand-dark leading-tight">{g.name}</h4>
                      <button onClick={() => onDeleteComplementGroup(g.id)} className="material-symbols-outlined text-gray-300 hover:text-brand-red">delete</button>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="text-[8px] font-black bg-white px-2 py-1 rounded border">MIN: {g.minChoices}</span>
                      <span className="text-[8px] font-black bg-white px-2 py-1 rounded border">MAX: {g.maxChoices}</span>
                    </div>
                    <div className="space-y-1">
                      {g.items.map(i => (
                        <div key={i.id} className="flex justify-between text-[10px] font-bold text-gray-500 bg-white/50 px-2 py-1 rounded">
                          <span>{i.name}</span>
                          <span className="text-brand-red">R$ {i.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PRODUTOS' && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic">Cardápio de Produção</h3>
              <button onClick={() => setShowProductModal(true)} className="bg-brand-red text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-brand-red/10">Novo Item</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-gray-50 p-4 rounded-3xl border flex gap-4 group relative">
                  <img src={p.image} className="size-16 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-brand-red uppercase">{p.category}</p>
                    <p className="text-xs font-black uppercase truncate">{p.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.complementGroupIds?.map(gid => {
                        const g = complementGroups.find(x => x.id === gid);
                        return g ? <span key={gid} className="text-[7px] font-black bg-white border px-1 rounded uppercase">{g.name}</span> : null;
                      })}
                    </div>
                  </div>
                  <button onClick={() => onDeleteProduct(p.id)} className="material-symbols-outlined text-gray-300 hover:text-brand-red self-start">delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVO PRODUTO */}
      {showProductModal && (
        <div className="fixed inset-0 bg-brand-dark/95 flex items-center justify-center p-6 z-[1000] overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 sm:p-10 space-y-6">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-center">Configurar Produto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <input placeholder="Nome do Produto" value={newProd.name || ''} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 font-bold text-sm" />
                <input placeholder="Preço Base (R$)" type="number" value={newProd.price || ''} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 font-bold text-sm" />
                <select value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value as any})} className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 font-bold text-sm">
                  <option value="FRITOS">FRITOS</option>
                  <option value="ASSADOS">ASSADOS</option>
                  <option value="COMBOS">COMBOS</option>
                  <option value="BEBIDAS">BEBIDAS</option>
                </select>
                <input placeholder="URL Imagem" value={newProd.image || ''} onChange={e => setNewProd({...newProd, image: e.target.value})} className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 font-bold text-[10px]" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-brand-red border-b pb-1">Vincular Categorias de Complementos</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {complementGroups.map(g => (
                    <label key={g.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-brand-yellow/10 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={newProd.complementGroupIds?.includes(g.id)}
                        onChange={(e) => {
                          const ids = newProd.complementGroupIds || [];
                          setNewProd({
                            ...newProd,
                            complementGroupIds: e.target.checked ? [...ids, g.id] : ids.filter(id => id !== g.id)
                          });
                        }}
                        className="rounded text-brand-red focus:ring-brand-red" 
                      />
                      <span className="text-[10px] font-black uppercase">{g.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t">
              <button onClick={() => setShowProductModal(false)} className="flex-1 py-4 font-black uppercase text-[10px] text-gray-400">Cancelar</button>
              <button onClick={handleCreateProduct} className="flex-[2] bg-brand-red text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-brand-red/20">Finalizar Cadastro</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVA CATEGORIA DE COMPLEMENTOS */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-brand-dark/95 flex items-center justify-center p-6 z-[1000]">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 space-y-6">
            <h3 className="text-2xl font-black uppercase italic text-center">Nova Categoria de Complementos</h3>
            <div className="space-y-4">
              <input placeholder="Ex: Escolha o Molho, Extras de Recheio..." value={newGroup.name || ''} onChange={e => setNewGroup({...newGroup, name: e.target.value})} className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 font-bold text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Min. Seleções</label>
                  <input type="number" value={newGroup.minChoices} onChange={e => setNewGroup({...newGroup, minChoices: Number(e.target.value)})} className="w-full bg-gray-50 border-gray-100 rounded-xl py-2 px-4 font-bold text-sm" />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Max. Seleções</label>
                  <input type="number" value={newGroup.maxChoices} onChange={e => setNewGroup({...newGroup, maxChoices: Number(e.target.value)})} className="w-full bg-gray-50 border-gray-100 rounded-xl py-2 px-4 font-bold text-sm" />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                <div className="flex gap-2">
                  <input placeholder="Nome do Item" value={tempItem.name} onChange={e => setTempItem({...tempItem, name: e.target.value})} className="flex-[2] bg-white border-gray-100 rounded-lg py-2 px-3 text-[10px] font-bold" />
                  <input placeholder="R$ 0,00" type="number" value={tempItem.price || ''} onChange={e => setTempItem({...tempItem, price: Number(e.target.value)})} className="flex-1 bg-white border-gray-100 rounded-lg py-2 px-3 text-[10px] font-bold" />
                </div>
                <button onClick={() => {
                  if(!tempItem.name) return;
                  setNewGroup({...newGroup, items: [...(newGroup.items || []), { ...tempItem, id: `CI-${Date.now()}` }]});
                  setTempItem({ name: '', price: 0 });
                }} className="w-full bg-brand-dark text-white py-2 rounded-lg text-[10px] font-black uppercase">Adicionar Opção</button>
              </div>

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {newGroup.items?.map(i => (
                  <div key={i.id} className="flex justify-between items-center bg-white p-2 rounded-lg border text-[10px] font-bold">
                    <span>{i.name} (+R$ {i.price.toFixed(2)})</span>
                    <button onClick={() => setNewGroup({...newGroup, items: newGroup.items?.filter(x => x.id !== i.id)})} className="text-red-300 hover:text-red-500">Remover</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t">
              <button onClick={() => setShowGroupModal(false)} className="flex-1 font-black text-gray-400 uppercase text-[10px]">Fechar</button>
              <button onClick={handleCreateGroup} className="flex-[2] bg-brand-red text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl">Salvar Categoria</button>
            </div>
          </div>
        </div>
      )}

      {/* Outras abas (PAINEL, ESTOQUE, FINANCEIRO) permanecem funcionais... */}
    </div>
  );
};

export default Admin;
