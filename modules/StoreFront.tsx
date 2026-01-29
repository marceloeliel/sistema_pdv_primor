
import React, { useState } from 'react';
import { Product, Order, OrderStatus, PaymentMethod } from '../types';

interface StoreFrontProps {
  products: Product[];
  onPlaceOrder: (order: Order) => void;
}

const StoreFront: React.FC<StoreFrontProps> = ({ products, onPlaceOrder }) => {
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if ((newCart[productId] as number) > 1) (newCart[productId] as number)--;
      else delete newCart[productId];
      return newCart;
    });
  };

  const totalItems = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);
  const totalPrice = (Object.entries(cart) as [string, number][]).reduce((sum, [id, qty]) => {
    const p = products.find(prod => prod.id === id);
    return sum + (p?.price || 0) * qty;
  }, 0);

  const handleCheckout = () => {
    const order: Order = {
      id: `WEB-${Math.floor(Math.random() * 1000)}`,
      customerName: "Cliente Digital",
      // Fix: Correct mapping for OrderItem interface
      items: (Object.entries(cart) as [string, number][]).map(([id, qty]) => {
        const p = products.find(prod => prod.id === id)!;
        return { 
          productId: id, 
          name: p.name, 
          quantity: qty, 
          unitPrice: p.price, 
          totalPrice: p.price * qty 
        };
      }),
      total: totalPrice,
      status: OrderStatus.RECEIVED,
      paymentMethod: PaymentMethod.PIX,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'DELIVERY',
      // Added missing properties to satisfy Order interface if needed
      orderNumber: `${Math.floor(Math.random() * 900) + 100}`,
      subtotal: totalPrice,
      tax: 0
    };
    onPlaceOrder(order);
    setCart({});
    alert('Pedido realizado com sucesso via WhatsApp!');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg pb-32">
      {/* Header */}
      <div className="bg-brand-red p-6 sm:p-10 text-white text-center rounded-b-[2rem] sm:rounded-b-[3rem] shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold italic tracking-tighter">PRIMOR</h1>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow">Salgados de Qualidade</p>
      </div>

      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-black text-brand-dark uppercase tracking-tighter italic">Nossas Delícias</h2>
          <span className="text-brand-red font-bold text-xs sm:text-sm cursor-pointer hover:underline">Ver Menu Completo</span>
        </div>

        {/* Grid - Adaptive 1 or 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {products.map(product => (
            <div key={product.id} className="flex gap-3 sm:gap-4 items-center bg-brand-light/30 p-3 sm:p-4 rounded-2xl border border-gray-100 hover:border-brand-yellow transition-all group">
              <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                <img src={product.image} className="w-20 h-20 sm:w-24 sm:h-24 object-cover shadow-md group-hover:scale-110 transition-transform duration-500" alt={product.name} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-brand-dark uppercase text-[11px] sm:text-xs truncate">{product.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 h-6 sm:h-8">{product.description}</p>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <span className="text-brand-red font-black text-base sm:text-xl italic">R$ {product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {cart[product.id] && (
                      <button onClick={() => removeFromCart(product.id)} className="bg-white border text-brand-dark size-7 sm:size-8 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-50 transition-colors">-</button>
                    )}
                    {cart[product.id] && <span className="font-black text-xs sm:text-sm w-4 text-center">{cart[product.id]}</span>}
                    <button 
                      onClick={() => addToCart(product.id)}
                      className={`bg-brand-yellow text-brand-red size-7 sm:size-8 rounded-lg font-black shadow-md active:scale-95 transition-all text-xs sm:text-sm hover:bg-yellow-400`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Call to Action - Responsive Width */}
      {totalItems > 0 && (
        <div className="fixed bottom-10 left-0 right-0 p-4 flex justify-center z-[90]">
          <button 
            onClick={handleCheckout}
            className="bg-brand-red text-white flex items-center justify-between w-full max-w-lg h-14 sm:h-16 px-6 rounded-2xl shadow-2xl animate-bounce-short border-b-4 border-black/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="bg-brand-yellow text-brand-red px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-black text-xs sm:text-sm">{totalItems}</span>
              <span className="font-black uppercase italic tracking-tight text-sm sm:text-base">Finalizar Pedido</span>
            </div>
            <span className="font-black text-lg sm:text-xl italic">R$ {totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreFront;
