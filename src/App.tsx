import React, { useState } from 'react';
// Imports a apontar para a raiz (../) onde as pastas estão no seu GitHub
import { useApp } from '../context/AppContext';
import { CourierDashboard } from '../CourierDashboard';

import { Header } from './components/Header';
import { CartDrawer } from './components/cartdrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';

import { Star, ShoppingBag, Wrench, Store } from 'lucide-react';

// Lojas e Oficinas de Exemplo para Testar a Pesquisa
const MOCK_STORES = [
  {
    id: '1',
    name: 'TechFix Assistência Técnica',
    category: 'Reparação de Telemóveis e PCs',
    rating: 4.9,
    supportsPickupDelivery: true,
    supportsTakeaway: true,
  },
  {
    id: '2',
    name: 'Oficina do Celular',
    category: 'Troca de Ecrã e Bateria',
    rating: 4.7,
    supportsPickupDelivery: true,
    supportsTakeaway: true,
  },
  {
    id: '3',
    name: 'Restaurante Sabor Express',
    category: 'Alimentação & Marmitas',
    rating: 4.5,
    supportsPickupDelivery: false,
    supportsTakeaway: true,
  },
];

export function App() {
  const { addToCart } = useApp();
  const [activeTab, setActiveTab] = useState<'customer' | 'merchant' | 'courier'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 🔍 Filtro da Lupa de Pesquisa em tempo real
  const filteredStores = MOCK_STORES.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Cabeçalho com Lupa */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-4xl mx-auto p-4">
        {/* --- VISÃO CLIENTE --- */}
        {activeTab === 'customer' && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Lojas e Serviços ({filteredStores.length})
            </h2>

            {filteredStores.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500 font-medium">
                  Nenhuma loja ou serviço encontrado para "{searchQuery}".
                </p>
              </div>
            ) : (
              filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-800 dark:text-white">{store.name}</h3>
                      <span className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-500 mr-1" />
                        {store.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{store.category}</p>
                    <div className="flex gap-2 pt-1">
                      {store.supportsPickupDelivery && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 rounded-md flex items-center gap-1">
                          <Wrench className="w-3 h-3" /> Leva e Traz
                        </span>
                      )}
                      {store.supportsTakeaway && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 rounded-md flex items-center gap-1">
                          <Store className="w-3 h-3" /> Retirada
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        id: `item-${Date.now()}`,
                        name: `Serviço - ${store.name}`,
                        price: 150.0,
                        quantity: 1,
                      });
                      setIsCartOpen(true);
                    }}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- VISÃO LOJISTA --- */}
        {activeTab === 'merchant' && <MerchantDashboard />}

        {/* --- VISÃO ENTREGADOR --- */}
        {activeTab === 'courier' && <CourierDashboard />}
      </main>

      {/* 🛒 DRAWER DO CARRINHO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full overflow-y-auto">
            <div className="p-3 border-b flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Carrinho</span>
              <button onClick={() => setIsCartOpen(false)} className="text-xs font-bold text-slate-500 p-1">
                Fechar ✕
              </button>
            </div>
            <CartDrawer onOpenCheckout={handleOpenCheckout} />
          </div>
        </div>
      )}

      {/* 📍 MODAL DE ENDEREÇO / CEP */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => alert('Pedido realizado com sucesso!')}
      />

      {/* 📱 BARRA DE NAVEGAÇÃO DO SIMULADOR (RODAPÉ) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2.5 flex justify-around text-xs font-bold shadow-lg z-40">
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === 'customer' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'text-slate-400'
          }`}
        >
          🛒 Cliente
        </button>
        <button
          onClick={() => setActiveTab('merchant')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === 'merchant' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'text-slate-400'
          }`}
        >
          🏪 Lojista
        </button>
        <button
          onClick={() => setActiveTab('courier')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === 'courier' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'text-slate-400'
          }`}
        >
          🛵 Entregador
        </button>
      </nav>
    </div>
  );
}
