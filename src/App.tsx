import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { CourierDashboard } from './components/courier/CourierDashboard';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { AdminControlPro } from './components/AdminControlPro';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { CartDrawer } from './components/home/CartDrawer';
import { Home as HomeIcon, Search, ShoppingBag, User, Bike, Store, ShieldAlert, ArrowLeft } from 'lucide-react';

export function App() {
  const { orders } = useApp();

  // Perfis possíveis: Cliente, Entregador, Lojista ou Administrador
  const [userRole, setUserRole] = useState<'customer' | 'courier' | 'merchant' | 'admin'>('customer');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile'>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Cabeçalho */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      <main className="max-w-md mx-auto">
        {/* 1. MODO ENTREGADOR */}
        {userRole === 'courier' && (
          <div>
            <div className="bg-amber-500 text-white p-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Bike className="w-4 h-4" /> Painel do Entregador
              </span>
              <button
                onClick={() => setUserRole('customer')}
                className="text-xs bg-white text-amber-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sair do Modo Entregador</span>
              </button>
            </div>
            <CourierDashboard />
          </div>
        )}

        {/* 2. MODO LOJISTA / OFICINA */}
        {userRole === 'merchant' && (
          <div>
            <div className="bg-indigo-600 text-white p-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4" /> Painel do Lojista / Oficina
              </span>
              <button
                onClick={() => setUserRole('customer')}
                className="text-xs bg-white text-indigo-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sair do Modo Lojista</span>
              </button>
            </div>
            <MerchantDashboard />
          </div>
        )}

        {/* 3. MODO ADMINISTRADOR */}
        {userRole === 'admin' && (
          <div>
            <div className="bg-rose-600 text-white p-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Painel do Administrador
              </span>
              <button
                onClick={() => setUserRole('customer')}
                className="text-xs bg-white text-rose-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sair do Modo Admin</span>
              </button>
            </div>
            <AdminControlPro />
          </div>
        )}

        {/* 4. MODO CLIENTE (ABAS INFERIORES) */}
        {userRole === 'customer' && (
          <div>
            {activeTab === 'home' && (
              <Home
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {activeTab === 'search' && (
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-bold">Buscar na Serra</h2>
                <input
                  type="text"
                  placeholder="Buscar restaurantes, autopeças ou serviços..."
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-bold">Meus Pedidos</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-medium text-slate-500">Nenhum pedido efetuado ainda.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-400">#{order.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">{order.status}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {order.fulfillmentType === 'pickup_delivery' ? '🛠️ Leva e Traz' : '🛵 Entrega'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TELA DE PERFIL DE UTILIZADOR E ACESSO AOS PAINÉIS */}
            {activeTab === 'profile' && (
              <div className="p-4 space-y-6">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center">
                    IE
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Usuário Ibiapaba</h3>
                    <p className="text-xs text-slate-500">cliente@ibiapabaexpress.com</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Alternar Perfis do App</p>

                  <button
                    onClick={() => setUserRole('courier')}
                    className="w-full p-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-between transition shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bike className="w-5 h-5" />
                      <span>Abrir Painel do Entregador</span>
                    </div>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => setUserRole('merchant')}
                    className="w-full p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-between transition shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className="w-5 h-5" />
                      <span>Abrir Painel da Loja / Oficina</span>
                    </div>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => setUserRole('admin')}
                    className="w-full p-3.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-between transition shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                      <span>Abrir Painel do Administrador</span>
                    </div>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* BARRA FIXA DE NAVEGAÇÃO INFERIOR */}
      {userRole === 'customer' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40">
          <div className="max-w-md mx-auto grid grid-cols-4 py-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'search' ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Busca</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'orders' ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Pedidos</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </button>
          </div>
        </nav>
      )}

      {/* Modais de Carrinho e Checkout */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSuccess={() => setActiveTab('orders')} />
    </div>
  );
}

export default App;
