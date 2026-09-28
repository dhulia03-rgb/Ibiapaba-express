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
import { Home, Search, ShoppingBag, User, Store, Bike, ShieldCheck, ArrowRight, Mail, Lock, Phone, Building, CheckCircle2 } from 'lucide-react';

const SERRAN_CITIES = [
  'Tianguá',
  'Ubajara',
  'São Benedito',
  'Ibiapina',
  'Guaraciaba do Norte',
  'Carnaubal',
  'Croatá',
  'Ipu'
];

export default function App() {
  const { merchants, selectedMerchant, orders } = useApp();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<'customer' | 'merchant' | 'courier'>('customer');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    // Cidades que o comércio escolhe atender
    serviceCities: ['Tianguá'] as string[]
  });

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'customer' | 'courier' | 'merchant' | 'admin'>('customer');

  const toggleCitySelection = (city: string) => {
    if (formData.serviceCities.includes(city)) {
      if (formData.serviceCities.length > 1) {
        setFormData({
          ...formData,
          serviceCities: formData.serviceCities.filter(c => c !== city)
        });
      }
    } else {
      setFormData({
        ...formData,
        serviceCities: [...formData.serviceCities, city]
      });
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setViewMode(role);
  };

  const filteredMerchants = merchants.filter(m => {
    const matchesCategory = selectedCategory ? m.category === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 rounded-2xl text-white font-black text-2xl shadow-lg shadow-red-600/30">
              IE
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Ibiapaba Express</h1>
            <p className="text-xs text-slate-400">O ecossistema completo da Serra da Ibiapaba</p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-lg transition ${authMode === 'register' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Criar Conta
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg transition ${authMode === 'login' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Já tenho conta
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Como deseja atuar no app?</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition text-center ${
                        role === 'customer' 
                          ? 'border-red-500 bg-red-500/10 text-white' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <User className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold">Cliente</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('merchant')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition text-center ${
                        role === 'merchant' 
                          ? 'border-amber-500 bg-amber-500/10 text-white' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Store className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold">Comércio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('courier')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition text-center ${
                        role === 'courier' 
                          ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Bike className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold">Entregador</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'merchant' ? 'Nome do Responsável' : 'Seu Nome Completo'}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {role === 'merchant' && (
                  <>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Nome da Loja / Oficina / Lanchonete"
                        value={formData.storeName}
                        onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* SELETOR DE CIDADES DE ATUAÇÃO DO COMÉRCIO */}
                    <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <label className="text-xs font-semibold text-amber-400 block">
                        Cidades de Atuação (Selecione onde sua loja entrega/atende):
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                        {SERRAN_CITIES.map((city) => {
                          const isSelected = formData.serviceCities.includes(city);
                          return (
                            <button
                              key={city}
                              type="button"
                              onClick={() => toggleCitySelection(city)}
                              className={`flex items-center justify-between p-2 rounded-lg border text-xs transition ${
                                isSelected 
                                  ? 'bg-amber-500/10 border-amber-500 text-white font-medium' 
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span>{city}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp / Telemóvel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="Seu E-mail"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Palavra-passe / Senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-red-600/20 mt-2"
            >
              <span>{authMode === 'register' ? 'Concluir Cadastro e Entrar' : 'Acessar Conta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    );
  }

  if (viewMode === 'courier') {
    return <CourierDashboard onSwitchToCustomer={() => setViewMode('customer')} />;
  }

  if (viewMode === 'merchant') {
    return <MerchantDashboard onSwitchToCustomer={() => setViewMode('customer')} />;
  }

  if (viewMode === 'admin') {
    return <AdminControlPro onSwitchToCustomer={() => setViewMode('customer')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <Header />

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
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === 'profile' && (
        <main className="max-w-md mx-auto px-4 py-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">{formData.storeName || formData.name || 'Usuário Ibiapaba'}</h2>
            <p className="text-xs text-slate-400 mt-1">{formData.email}</p>
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
                  <p className="text-xs text-slate-400">Gerenciar catálogo e pedidos</p>
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
                  <p className="text-xs text-slate-400">Aceitar corridas e entregas</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-bold text-xs hover:bg-red-500/20 transition"
            >
              Sair da Conta
            </button>
          </div>
        </main>
      )}

      {selectedMerchant && <ProductCatalogModal />}
      <CheckoutModal />

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
