import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerAddress } from '../../types';
import { MapPin, X, ArrowRight, Tag } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createOrder, getCartTotal, getDeliveryFee, fulfillmentType } = useApp();

  const [address, setAddress] = useState<CustomerAddress>({
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: 'Tianguá',
    referencePoint: '',
  });

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  if (!isOpen) return null;

  // Correção da validação do cupom SERRA10
  const handleApplyCoupon = () => {
    const cleanCoupon = coupon.trim().toUpperCase();
    if (cleanCoupon === 'SERRA10') {
      setDiscount(10);
      alert('Cupom SERRA10 aplicado com sucesso! R$ 10,00 de desconto.');
    } else {
      alert('Cupom inválido. Use o código "SERRA10".');
    }
  };

  const total = Math.max(0, getCartTotal() + getDeliveryFee() - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder({
      customerAddress: address,
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>
              {fulfillmentType === 'pickup_delivery' 
                ? 'Endereço para Coleta & Devolução' 
                : 'Endereço de Entrega'}
            </span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Rua / Logradouro *</label>
              <input
                type="text"
                required
                placeholder="Ex: Av. Jaques Nunes"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Número *</label>
              <input
                type="text"
                required
                placeholder="123"
                value={address.number}
                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Bairro *</label>
            <input
              type="text"
              required
              placeholder="Ex: Centro"
              value={address.neighborhood}
              onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          {/* Campo de Cupom de Desconto */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>Cupom de Desconto</span>
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Ex: SERRA10"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none uppercase font-mono"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span>R$ {getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Taxa de Entrega / Coleta:</span>
              <span>R$ {getDeliveryFee().toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Desconto (SERRA10):</span>
                <span>- R$ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-1 border-t">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirmar Pedido (R$ {total.toFixed(2)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
