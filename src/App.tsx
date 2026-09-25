import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Home,
  Wrench,
  Clock,
  User,
  Store,
  Bike,
  Shield,
  Database,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Lock,
  Plus,
  ShoppingBag,
  Send,
  Star,
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  Search,
  ChevronRight,
  LogOut,
  Sliders,
  Bell
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE & FALLBACK
// ============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// TIPOS E INTERFACES DA APLICAÇÃO
// ============================================================================
export type Role = 'cliente' | 'comercio' | 'entregador' | 'admin';

export interface StoreItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
}

export interface OrderItem {
  id: string;
  title: string;
  store: string;
  status: 'Pendente' | 'Em Preparo' | 'A Caminho' | 'Entregue';
  price: number;
  date: string;
}

export interface QuoteItem {
  id: string;
  service: string;
  description: string;
  budget: string;
  status: 'Aberto' | 'Respondido' | 'Finalizado';
}

// ============================================================================
// CONTEXTOS DA APLICAÇÃO (APP & ADMIN)
// ============================================================================
interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  orders: OrderItem[];
  quotes: QuoteItem[];
  addQuote: (service: string, description: string, budget: string) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('cliente');
  const [cartCount, setCartCount] = useState<number>(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const [orders] = useState<OrderItem[]>([
    { id: 'ORD-8921', title: 'Manutenção de Motocicleta', store: 'Oficina Central Tianguá', status: 'Em Preparo', price: 145.0, date: 'Hoje, 14:20' },
    { id: 'ORD-8810', title: 'Peças & Acessórios', store: 'AutoPeças Ibiapina', status: 'Entregue', price: 89.90, date: 'Ontem' }
  ]);

  const [quotes, setQuotes] = useState<QuoteItem[]>([
    { id: 'COT-101', service: 'Troca de Óleo e Filtro', description: 'Moto Honda CG 160 Fan 2022', budget: 'R$ 80 - R$ 120', status: 'Respondido' },
    { id: 'COT-102', service: 'Revisão Elétrica', description: 'Veículo com falha nos faróis', budget: 'R$ 150 - R$ 250', status: 'Aberto' }
  ]);

  const addQuote = (service: string, description: string, budget: string) => {
    const newQ: QuoteItem = {
      id: `COT-${Math.floor(100 + Math.random() * 900)}`,
      service,
      description,
      budget,
      status: 'Aberto'
    };
    setQuotes((prev) => [newQ, ...prev]);
  };

  const loginAdmin = (pass: string) => {
    if (pass === 'admin123' || pass === 'master2026') {
      setIsAdminAuthenticated(true);
      setRole('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setRole('cliente');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        cartCount,
        setCartCount,
        orders,
        quotes,
        addQuote,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
};

// ============================================================================
// MODAL DE STATUS DO SUPABASE
// ============================================================================
const SupabaseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-500" />
            <h3 className="font-extrabold text-base">Status do Banco Supabase</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isSupabaseConfigured ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
            {isSupabaseConfigured ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />}
            <div>
              <p className="font-bold text-sm">{isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Preview / Mock Ativo'}</p>
              <p className="text-xs opacity-80">{isSupabaseConfigured ? 'Variáveis VITE_SUPABASE_URL e KEY carregadas.' : 'As variáveis de ambiente não foram detectadas. Operando com dados locais.'}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-2 text-xs font-mono">
            <p><span className="font-bold">URL:</span> {supabaseUrl ? `${supabaseUrl.slice(0, 25)}...` : 'Ausente'}</p>
            <p><span className="font-bold">ANON KEY:</span> {supabaseAnonKey ? '••••••••••••••••' : 'Ausente'}</p>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition">
          Entendido
        </button>
      </div>
    </div>
  );
};
// ============================================================================
// COMPONENTES DE INTERFACE DA APLICAÇÃO
// ============================================================================

// Header Público
const AppHeader: React.FC<{ onOpenSupabase: () => void; onOpenAdminAuth: () => void }> = ({ onOpenSupabase, onOpenAdminAuth }) => {
  const { role, cartCount } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white border-b border-slate-800 px-4 py-3 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-base">
          IE
        </div>
        <div>
          <h1 className="font-black text-sm tracking-tight text-white leading-none">IbiapabaExpress</h1>
          <p className="text-[10px] text-emerald-400 font-medium">Serra da Ibiapaba • CE</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onOpenSupabase} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition" title="Status Supabase">
          <Database className="w-4 h-4" />
        </button>

        <button onClick={onOpenAdminAuth} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition">
          <Lock className="w-3.5 h-3.5" />
          <span>Painel Admin</span>
        </button>
      </div>
    </header>
  );
};

// Visão do Cliente
const CustomerView: React.FC = () => {
  const { setCartCount, quotes, addQuote } = useApp();
  const [activeTab, setActiveTab] = useState<'lojas' | 'cotacoes' | 'levaETraz'>('lojas');
  const [serviceInput, setServiceInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const stores: StoreItem[] = [
    { id: '1', name: 'AutoPeças & Mecânica Tianguá', category: 'Oficina & Peças', rating: 4.9, deliveryTime: '20-35 min', deliveryFee: 5.0, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=60' },
    { id: '2', name: 'Centro Automotivo Ibiapina', category: 'Serviços Mecânicos', rating: 4.8, deliveryTime: '30-45 min', deliveryFee: 7.0, image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&auto=format&fit=crop&q=60' }
  ];

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceInput) return;
    addQuote(serviceInput, descInput || 'Solicitação via App', 'A definir');
    setServiceInput('');
    setDescInput('');
    alert('Cotação enviada para as oficinas parceiras com sucesso!');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Abas Super App */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm">
        <button onClick={() => setActiveTab('lojas')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'lojas' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}>
          Lojas & Serviços
        </button>
        <button onClick={() => setActiveTab('cotacoes')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'cotacoes' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}>
          Cotação / Leilão
        </button>
        <button onClick={() => setActiveTab('levaETraz')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'levaETraz' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}>
          Leva e Traz
        </button>
      </div>

      {activeTab === 'lojas' && (
        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Parceiros em Destaque</h2>
          {stores.map((s) => (
            <div key={s.id} className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <img src={s.image} alt={s.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{s.name}</h3>
                <p className="text-xs text-slate-500">{s.category}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold"><Star className="w-3 h-3 fill-amber-500" />{s.rating}</span>
                  <span>• {s.deliveryTime}</span>
                  <span>• R$ {s.deliveryFee.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => setCartCount((prev) => prev + 1)} className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 transition">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cotacoes' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateQuote} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-500" /> Solicitar Cotação para Oficinas
            </h3>
            <input type="text" placeholder="Qual serviço ou peça precisa?" value={serviceInput} onChange={(e) => setServiceInput(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-transparent" required />
            <textarea placeholder="Detalhes do veículo ou especificação da peça..." value={descInput} onChange={(e) => setDescInput(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-transparent" rows={2} />
            <button type="submit" className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-500 transition">
              Enviar para Leilão de Preços
            </button>
          </form>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Cotações em Andamento</h4>
            {quotes.map((q) => (
              <div key={q.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>{q.service}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">{q.status}</span>
                </div>
                <p className="text-slate-500">{q.description}</p>
                <p className="font-semibold text-emerald-600">Estimativa: {q.budget}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'levaETraz' && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Bike className="w-4 h-4 text-emerald-500" /> Serviço Leva e Traz de Veículos
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Coletamos a sua moto ou veículo no seu endereço na Serra da Ibiapaba, levamos até a oficina credenciada e devolvemos pronto!
          </p>
          <button onClick={() => alert('Solicitação de Coleta registrada! Um entregador entrará em contato.')} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-500 transition">
            Agendar Coleta de Veículo
          </button>
        </div>
      )}
    </div>
  );
};

// Visão do Lojista
const MerchantView: React.FC = () => (
  <div className="space-y-4 pb-20">
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="font-bold text-base flex items-center gap-2"><Store className="w-5 h-5 text-indigo-600" /> Painel da Oficina / Lojista</h2>
      <p className="text-xs text-slate-500 mt-1">Gerencie os seus serviços, produtos e cotações recebidas.</p>
    </div>
  </div>
);

// Visão do Entregador
const CourierView: React.FC = () => (
  <div className="space-y-4 pb-20">
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="font-bold text-base flex items-center gap-2"><Bike className="w-5 h-5 text-amber-600" /> Painel do Entregador</h2>
      <p className="text-xs text-slate-500 mt-1">Sua rota de entregas e coletas "Leva e Traz" na região.</p>
    </div>
  </div>
);

// Visão do Administrador Master (Protegida)
const MasterAdminDashboard: React.FC = () => {
  const { logoutAdmin } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 space-y-6">
      {/* Topo do Admin */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="font-black text-base text-white">Painel Administrador Master</h2>
            <p className="text-xs text-slate-400">Controle Operacional & Financeiro IbiapabaExpress</p>
          </div>
        </div>
        <button onClick={logoutAdmin} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800/50 transition">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {/* Cards Financeiros */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">GMV Total Processado</p>
          <p className="text-xl font-black text-emerald-400">R$ 24.890,00</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Corridas Leva e Traz</p>
          <p className="text-xl font-black text-indigo-400">142 concluidas</p>
        </div>
      </div>
    </div>
  );
};

// Modal de Autenticação do Admin Master
const AdminAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useApp();
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pass)) {
      setError(false);
      setPass('');
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Acesso Restrito Admin</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Senha do Administrador Master:</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Digite a senha..." className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" autoFocus required />
          </div>

          {error && <p className="text-xs text-red-400 font-bold">Senha incorreta. Tente novamente.</p>}

          <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs transition">
            Autenticar
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// CONTEÚDO PRINCIPAL DO APP
// ============================================================================
const MainContent: React.FC = () => {
  const { role, setRole, isAdminAuthenticated } = useApp();
  const [supabaseOpen, setSupabaseOpen] = useState(false);
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);

  if (role === 'admin' && isAdminAuthenticated) {
    return <MasterAdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <AppHeader onOpenSupabase={() => setSupabaseOpen(true)} onOpenAdminAuth={() => setAdminAuthOpen(true)} />

      <main className="flex-1 max-w-md w-full mx-auto p-4">
        {role === 'cliente' && <CustomerView />}
        {role === 'comercio' && <MerchantView />}
        {role === 'entregador' && <CourierView />}
      </main>

      {/* Navegação Inferior (Mobile Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-between z-40">
        <button onClick={() => setRole('cliente')} className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${role === 'cliente' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <Home className="w-5 h-5" /> Início
        </button>
        <button onClick={() => setRole('comercio')} className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${role === 'comercio' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Store className="w-5 h-5" /> Lojista
        </button>
        <button onClick={() => setRole('entregador')} className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${role === 'entregador' ? 'text-amber-600' : 'text-slate-400'}`}>
          <Bike className="w-5 h-5" /> Entregador
        </button>
      </nav>

      <SupabaseModal isOpen={supabaseOpen} onClose={() => setSupabaseOpen(false)} />
      <AdminAuthModal isOpen={adminAuthOpen} onClose={() => setAdminAuthOpen(false)} />
    </div>
  );
};

// ============================================================================
// COMPONENTE RAIZ (EXPORT DEFAULT APP)
// ============================================================================
export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
