import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CustomerAddress } from '../../types';
import { MapPin, X, ArrowRight, Building, Search } from 'lucide-react';

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
    city: 'Angra dos Reis',
    referencePoint: '',
  });

  if (!isOpen) return null;

  // Busca rápida de CEP usando a API pública ViaCEP
  const handleCepBlur = async () => {
    const cleanCep = address.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
          }));
        }
      } catch (err) {
        // Trata falha silenciosamente mantendo preenchimento manual
      }
    }
  };

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
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Endereço de {fulfillmentType === 'pickup_delivery' ? 'Coleta & Devolução' : 'Entrega'}</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Campo de CEP com busca */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">CEP</label>
            <div className="relative mt-1">
              <input
                type="text"
                required
                maxLength={9}
                placeholder="00000-000"
                value={address.cep}
                onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                onBlur={handleCepBlur}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-emerald-600 font-bold">Autopreencher</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Rua / Logradouro</label>
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
              <label className="text-[11px] font-bold text-slate-500 uppercase">Número</label>
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Bairro</label>
              <input
                type="text"
                required
                placeholder="Ex: Centro"
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Cidade</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          {/* Campo Ponto de Referência */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Ponto de Referência (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Próximo à farmácia, casa amarela"
              value={address.referencePoint}
              onChange={(e) => setAddress({ ...address, referencePoint: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirmar Endereço e Finalizar (R$ {getCartTotal().toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
