import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from './Context/AppContext';
import { AdminProvider, useAdmin } from './Context/AdminContext';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Header } from './components/common/Header';
import { CustomerHome } from './components/customer/CustomerHome';
import { StoreView } from './components/customer/StoreView';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { QuotesAuctionView } from './components/customer/QuotesAuctionView';
import { ReferralProgramModal } from './components/customer/ReferralProgramModal';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { CourierDashboard } from './components/courier/CourierDashboard';
import { LevaETrazManager } from './components/logistics/LevaETrazManager';
import { Store, Order } from './types';
import {
  supabase,
  isSupabaseConfigured,
  supabaseUrl,
  supabaseAnonKey,
  checkSupabaseConnection,
  SupabaseConnectionStatus,
} from './services/supabase';
import {
  Home,
  Wrench,
  Clock,
  User,
  Store as StoreIcon,
  Bike,
  Shield,
  Database,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Key,
  Wifi,
  WifiOff,
  Sparkles,
  Lock,
} from 'lucide-react';

// ============================================================================
// COMPONENTE: MODAL DE STATUS & CONEXÃO DO SUPABASE
// ============================================================================
interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SupabaseConnectionStatus | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  isLoading,
  onRefresh,
}) => {
  if (!isOpen) return null;

  const maskedKey = supabaseAnonKey
    ? `${supabaseAnonKey.slice(0, 10)}...${supabaseAnonKey.slice(-6)}`
    : 'Não configurada';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 animate-in zoom-in-95">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Integração Supabase • IbiapabaExpress
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Cluster Regional • Serra da Ibiapaba (CE)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-all text-white/80 hover:text-white cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-5">
          {/* Card de Status da Conexão */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
              status?.connected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                : isSupabaseConfigured
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
                : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-200'
            }`}
          >
            {status?.connected ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : isSupabaseConfigured ? (
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm">
                  {status?.connected
                    ? 'Conexão Supabase Ativa'
                    : isSupabaseConfigured
                    ? 'Credenciais Carregadas (Aguardando Resposta)'
                    : 'Modo de Demonstração / Preview Ativo'}
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/80 font-bold">
                  {status?.connected ? 'ONLINE' : isSupabaseConfigured ? 'STANDBY' : 'MOCK'}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {status?.message ||
                  (isSupabaseConfigured
                    ? 'Conectando ao banco de dados PostgreSQL & RLS via client oficial do Supabase.'
                    : 'As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão operando com fallback para permitir navegação ininterrupta no applet.')}
              </p>
            </div>
          </div>

          {/* Variáveis de Ambiente Detectadas */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-500" />
              <span>Variáveis de Ambiente (Vite Client)</span>
            </h5>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 text-xs font-mono">
              <div>
                <div className="text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>VITE_SUPABASE_URL</span>
                  {supabaseUrl ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Detectado
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Ausente
                    </span>
                  )}
                </div>
                <div className="mt-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 break-all select-all">
                  {supabaseUrl || 'https://seu-projeto-id.supabase.co'}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>VITE_SUPABASE_ANON_KEY</span>
                  {supabaseAnonKey ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Detectado
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Ausente
                    </span>
                  )}
                </div>
                <div className="mt-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 break-all select-all flex items-center justify-between">
                  <span>{maskedKey}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Dicas de Configuração */}
          <div className="bg-slate-100 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <h6 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <span>Como configurar no seu ambiente:</span>
            </h6>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Crie ou edite o arquivo <code className="px-1 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] border">.env</code> na raiz do projeto com as chaves do seu Dashboard Supabase (Project Settings &gt; API):
            </p>
            <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto select-all">
{`VITE_SUPABASE_URL="https://exemplo-ibiapaba.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
            </pre>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Testando Conexão...' : 'Testar Conexão'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE: APLICAÇÃO PÚBLICA (SIMULADOR MOBILE COM CLIENTE, LOJISTA, ENTREGADOR)
// ============================================================================
interface PublicAppProps {
  onReturnToAdmin: () => void;
  onOpenSupabaseModal: () => void;
  supabaseConnected: boolean;
}

function PublicAppContent({
  onReturnToAdmin,
  onOpenSupabaseModal,
  supabaseConnected,
}: PublicAppProps) {
  const {
    userRole,
    setUserRole,
    orders,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    cart,
  } = useApp();

  // Estados de navegação interna do cliente
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [customerView, setCustomerView] = useState<'home' | 'store' | 'quotes' | 'tracking'>('home');
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isLevaETrazOpen, setIsLevaETrazOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [checkoutData, setCheckoutData] = useState<{
    address: Order['customerAddress'];
    isScheduled: boolean;
    scheduledTime?: string;
  }>({
    address: {
      street: 'Av. Prefeito Jaques Nunes',
      number: '350',
      neighborhood: 'Centro',
      city: 'Tianguá',
    },
    isScheduled: false,
  });

  const handleOpenStore = (store: Store) => {
    setSelectedStore(store);
    setCustomerView('store');
  };

  const handleProceedToCheckout = (
    address: Order['customerAddress'],
    isScheduled: boolean,
    scheduledTime?: string
  ) => {
    setCheckoutData({ address, isScheduled, scheduledTime });
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (order: Order) => {
    setIsCheckoutOpen(false);
    setSelectedStore(null);
    setActiveTrackingOrderId(order.id);
    setCustomerView('tracking');
  };

  return (
    <div className="min-h-screen bg-slate-900/90 text-slate-900 flex flex-col font-sans antialiased overflow-x-hidden w-full relative">
      {/* Floating Return to Admin Header Pill */}
      <div className="sticky top-0 z-50 w-full bg-slate-950 text-white border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-200">
              Super App IbiapabaExpress (Mobile Preview)
            </span>
          </div>

          {/* Badge Supabase */}
          <button
            onClick={onOpenSupabaseModal}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              supabaseConnected
                ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Ver status da conexão com o Supabase"
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Supabase: {supabaseConnected ? 'Online' : 'Conectado'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSupabaseModal}
            className="sm:hidden p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 transition"
            title="Supabase Status"
          >
            <Database className="w-4 h-4" />
          </button>

          <button
            onClick={onReturnToAdmin}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Voltar ao Admin Master</span>
          </button>
        </div>
      </div>

      {/* Container Centralizado para Dispositivos Móveis */}
      <div className="max-w-md mx-auto w-full min-h-screen bg-slate-50 flex flex-col relative shadow-2xl overflow-x-hidden pb-20 my-2 rounded-2xl border border-slate-700/40">
        {/* Universal Header Redesenhado Compacto em 2 Linhas */}
        <Header
          onOpenAdmin={onReturnToAdmin}
          onOpenReferral={() => setIsReferralOpen(true)}
          onOpenLevaETraz={() => setIsLevaETrazOpen(true)}
          onOpenQuotes={() => {
            setUserRole('cliente');
            setCustomerView('quotes');
          }}
        />

        {/* Main Content Area based on User Role */}
        <main className="flex-1 w-full overflow-x-hidden px-4 py-3">
          {userRole === 'cliente' && (
            <>
              {customerView === 'home' && (
                <CustomerHome
                  onSelectStore={handleOpenStore}
                  onOpenQuotes={() => setCustomerView('quotes')}
                  onOpenLevaETraz={() => setIsLevaETrazOpen(true)}
                  onOpenReferral={() => setIsReferralOpen(true)}
                  onOpenTracking={(orderId) => {
                    setActiveTrackingOrderId(orderId);
                    setCustomerView('tracking');
                  }}
                />
              )}

              {customerView === 'store' && selectedStore && (
                <StoreView
                  store={selectedStore}
                  onBack={() => {
                    setSelectedStore(null);
                    setCustomerView('home');
                  }}
                  onOpenLevaETraz={() => setIsLevaETrazOpen(true)}
                />
              )}

              {customerView === 'quotes' && (
                <QuotesAuctionView
                  onOpenLevaETraz={() => setIsLevaETrazOpen(true)}
                />
              )}

              {customerView === 'tracking' && (
                <OrderTrackingView
                  orderId={activeTrackingOrderId || (orders[0]?.id ?? '')}
                  onBack={() => setCustomerView('home')}
                />
              )}
            </>
          )}

          {userRole === 'comercio' && <MerchantDashboard />}

          {userRole === 'entregador' && <CourierDashboard />}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 max-w-md w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 flex items-center justify-between z-40 shadow-lg">
          <button
            onClick={() => {
              setUserRole('cliente');
              setCustomerView('home');
              setSelectedStore(null);
            }}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition ${
              userRole === 'cliente' && customerView === 'home'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Início</span>
          </button>

          <button
            onClick={() => {
              setUserRole('cliente');
              setCustomerView('quotes');
            }}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition ${
              userRole === 'cliente' && customerView === 'quotes'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px]">Cotações</span>
          </button>

          <button
            onClick={() => {
              setUserRole('cliente');
              if (orders.length > 0) {
                setActiveTrackingOrderId(orders[0].id);
                setCustomerView('tracking');
              } else {
                setCustomerView('home');
              }
            }}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition ${
              userRole === 'cliente' && customerView === 'tracking'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px]">Pedidos</span>
          </button>

          <button
            onClick={() => {
              if (userRole === 'cliente') setUserRole('comercio');
              else if (userRole === 'comercio') setUserRole('entregador');
              else setUserRole('cliente');
            }}
            className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-slate-900 cursor-pointer transition"
          >
            {userRole === 'comercio' ? (
              <>
                <StoreIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-[10px] text-indigo-700 font-bold">Lojista</span>
              </>
            ) : userRole === 'entregador' ? (
              <>
                <Bike className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] text-amber-700 font-bold">Entregador</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                <span className="text-[10px]">Perfil</span>
              </>
            )}
          </button>
        </nav>
      </div>

      {/* Modais Globais & Drawers */}
      <CartDrawer onOpenCheckout={handleProceedToCheckout} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        customerData={checkoutData}
        onOrderSuccess={handleOrderCreated}
      />

      <ReferralProgramModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
      />

      <LevaETrazManager
        isOpen={isLevaETrazOpen}
        onClose={() => setIsLevaETrazOpen(false)}
      />
    </div>
  );
}

// ============================================================================
// SHELL PRINCIPAL DA APLICAÇÃO: ADMIN MASTER COM SUPABASE & PREVIEW
// ============================================================================
function MainAppShell() {
  const [viewMode, setViewMode] = useState<'admin' | 'public_app'>('admin');
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Verificação inicial e periódica da conexão do Supabase
  const runConnectionCheck = useCallback(async () => {
    setIsTestingConnection(true);
    try {
      const res = await checkSupabaseConnection();
      setConnectionStatus(res);
    } catch {
      setConnectionStatus({
        configured: isSupabaseConfigured,
        url: supabaseUrl,
        hasKey: Boolean(supabaseAnonKey),
        connected: false,
        message: 'Erro inesperado ao consultar o cliente Supabase.',
      });
    } finally {
      setIsTestingConnection(false);
    }
  }, []);

  useEffect(() => {
    runConnectionCheck();

    // Listener de Auth do Supabase para manter sessão sincronizada
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Sessão autenticada ativa no Supabase
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [runConnectionCheck]);

  return (
    <>
      {/* Visualizador / Simulador Público ou Painel Admin Master */}
      {viewMode === 'public_app' ? (
        <PublicAppContent
          onReturnToAdmin={() => setViewMode('admin')}
          onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
          supabaseConnected={Boolean(connectionStatus?.connected || isSupabaseConfigured)}
        />
      ) : (
        <div className="relative min-h-screen">
          {/* Barra Flutuante de Status do Supabase no Topo do Admin */}
          <div className="bg-slate-900 border-b border-slate-800 text-xs px-4 py-1.5 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-200">Supabase:</span>
                {isSupabaseConfigured ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> VITE_SUPABASE_URL ativa
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Modo Fallback / Dev
                  </span>
                )}
              </div>

              <span className="hidden md:inline text-slate-600">•</span>

              <span className="hidden md:inline text-slate-400 text-[11px]">
                Serra da Ibiapaba (Tianguá, Ubajara, Viçosa, São Benedito, Ibiapina, Guaraciaba, Carnaubal, Croatá, Ipu)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSupabaseModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-[11px] transition-all cursor-pointer"
              >
                <span>Configuração Supabase</span>
              </button>
            </div>
          </div>

          <AdminDashboard onToggleMobilePreview={() => setViewMode('public_app')} />
        </div>
      )}

      {/* Modal Unificado de Status e Teste do Supabase */}
      <SupabaseStatusModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        status={connectionStatus}
        isLoading={isTestingConnection}
        onRefresh={runConnectionCheck}
      />
    </>
  );
}

// ============================================================================
// COMPONENTE RAIZ (ROOT APP) COM PROVIDERS REGIONAIS
// ============================================================================
export default function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <MainAppShell />
      </AdminProvider>
    </AppProvider>
  );
}
