import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import CategoryCarousel from './components/CategoryCarousel';
import MerchantCard from './components/MerchantCard';
import ProductCatalogModal from './components/ProductCatalogModal';
import CheckoutModal from './components/CheckoutModal';
import CourierDashboard from './components/CourierDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import AdminControlPro from './components/AdminControlPro';
import { Home, Search, ShoppingBag, User, Store, Bike, ShieldCheck } from 'lucide-react';

export default function App() {
  const { merchants, selectedMerchant, setSelectedMerchant, orders } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'customer' | 'courier' | 'merchant' | 'admin'>('customer');

  // Filtragem de Lojas/Serviços
  const filteredMerchants = merchants.filter(m => {
    const matchesCategory = selectedCategory ? m.category === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Se o usuário alternou para o painel de Entregador
  if (viewMode === 'courier') {
    return <CourierDashboard onSwitchToCustomer={() => setViewMode('customer')} />;
  }

  // Se o usuário alternou para o painel de Lojista
  if (viewMode === 'merchant') {
    return <MerchantDashboard onSwitchToCustomer={() => setViewMode('customer')} />;
  }

  // Se o usuário alternou para o painel Admin
  if (viewMode === 'admin') {
    return <AdminControlPro onSwitchToCustomer={() => setViewMode('customer')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo Aba Início */}
      {activeTab === 'home' && (
        <main className="max-w-7xl mx-auto px-4 py-4 space-y-6">
          <CategoryCarousel 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Lojas e Serviços na Serra</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMerchants.map((merchant) => (
                <MerchantCard key={merchant.id} merchant={merchant} />
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Aba de Busca */}
      {activeTab === 'search' && (
        <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estabelecimentos, peças, pratos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        </main>
      )}

      {/* Aba Meus Pedidos */}
      {activeTab === 'orders' && (
        <main className="max-w-3xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold text-white mb-4">Seus Pedidos Ativos</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Você ainda não fez nenhum pedido.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        {order.status.toUpperCase()}
                      </span>
                      <p className="text-xs text-slate-500 mt-2">ID: {order.id.slice(0, 8)}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">R$ {order.total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 mt-3">
                    <p>📍 {order.delivery_address.street}, {order.delivery_address.number} - {order.delivery_address.neighborhood}</p>
                    {order.pickup_pin && <p className="text-amber-400 font-mono">🔑 PIN Retirada: {order.pickup_pin}</p>}
                    {order.delivery_pin && <p className="text-emerald-400 font-mono">🔑 PIN Entrega: {order.delivery_pin}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Aba Perfil (Painel de Alternância de Perfil) */}
      {activeTab === 'profile' && (
        <main className="max-w-md mx-auto px-4 py-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Modo de Visualização</h2>
            <p className="text-xs text-slate-400 mt-1">Escolha qual painel deseja acessar no Ibiapaba Express:</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setViewMode('merchant')}
              className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Store className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Painel da Loja / Oficina</p>
                  <p className="text-xs text-slate-400">Gerenciar catálogo, pedidos e cotações</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setViewMode('courier')}
              className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Bike className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Painel do Entregador</p>
                  <p className="text-xs text-slate-400">Aceitar corridas e validação por PIN</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Painel do Administrador</p>
                  <p className="text-xs text-slate-400">Visão geral do ecossistema e taxas</p>
                </div>
              </div>
            </button>
          </div>
        </main>
      )}

      {/* Modal de Catálogo do Estabelecimento */}
      {selectedMerchant && <ProductCatalogModal />}

      {/* Modal de Finalizar Pedido / Checkout */}
      <CheckoutModal />

      {/* Navegação Inferior (Bottom Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-6 py-2.5 z-40">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              activeTab === 'home' ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Início</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              activeTab === 'search' ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Busca</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              activeTab === 'orders' ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Pedidos</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              activeTab === 'profile' ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
