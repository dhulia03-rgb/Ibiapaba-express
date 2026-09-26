import React from 'react';
import { useApp } from '../../context/AppContext';
import { FulfillmentType } from '../../types';
import { ShoppingBag, Truck, Store, Wrench, ArrowRight, Trash2 } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: (address: any, isScheduled: boolean, time?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    fulfillmentType,
    setFulfillmentType,
    getDeliveryFee,
    getCartTotal,
  } = useApp();

  const options: { id: FulfillmentType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'delivery',
      label: 'Entrega Standard',
      icon: <Truck className="w-4 h-4" />,
      desc: 'Receber em casa',
    },
    {
      id: 'takeaway',
      label: 'Retirar na Loja',
      icon: <Store className="w-4 h-4" />,
      desc: 'Sem taxa (R$ 0)',
    },
    {
      id: 'pickup_delivery',
      label: 'Leva e Traz',
      icon: <Wrench className="w-4 h-4" />,
      desc: 'Buscamos e devolvemos',
    },
  ];

  const deliveryFee = getDeliveryFee();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center space-y-3">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="text-sm font-medium text-slate-500">Seu carrinho está vazio.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <span>Seu Carrinho</span>
        </h3>
        <button 
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      {/* 🛠️ Seletor Visual de Modalidade de Entrega / Serviço */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Como deseja receber / enviar o item?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {options.map((opt) => {
            const isSelected = fulfillmentType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFulfillmentType(opt.id)}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-1 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {opt.icon}
                </div>
                <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                <span className="text-[9px] opacity-75 mt-0.5">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Itens do Carrinho */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
            <div className="flex-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
              <p className="text-slate-500">{item.quantity}x • R$ {item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Resumo Financeiro com Frete Calculado */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl space-y-2 text-xs border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal dos Itens</span>
          <span>R$ {(total - deliveryFee).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Taxa Logística ({fulfillmentType === 'takeaway' ? 'Isento' : fulfillmentType === 'pickup_delivery' ? 'Ida e Volta' : 'Entrega'})</span>
          <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
            {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
          <span>Total</span>
          <span className="text-emerald-600 dark:text-emerald-400">R$ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Botão de Avançar */}
      <button
        onClick={() => onOpenCheckout({ street: 'Av. Prefeito Jaques Nunes', number: '350' }, false)}
        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Confirmar e Finalizar</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
