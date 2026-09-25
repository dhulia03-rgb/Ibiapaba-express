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
  Sparkles,
  Zap,
  Gift,
  Package,
  Award,
  BarChart3,
  Activity,
  Layers,
  ArrowUpRight,
  Filter,
  Eye,
  Check
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE
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
  city: string;
  badge?: string;
}

export interface OrderItem {
  id: string;
  customer: string;
  store: string;
  status: 'Pendente' | 'Em Preparo' | 'Em Trânsito' | 'Entregue';
  price: number;
  date: string;
  type: 'Peça' | 'Serviço' | 'Leva e Traz';
}

export interface QuoteItem {
  id: string;
  service: string;
  customer: string;
  description: string;
  budget: string;
  status: 'Aberto' | 'Respondido' | 'Finalizado';
}

// ============================================================================
// CONTEXTO GLOBAL DA APLICAÇÃO
// ============================================================================
interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  viewMode: 'public' | 'admin_control_pro';
  setViewMode: (mode: 'public' | 'admin_control_pro') => void;
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
  const [viewMode, setViewMode] = useState<'public' | 'admin_control_pro'>('public');
  const [cartCount, setCartCount] = useState<number>(2);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true); // Ativo por padrão no preview

  const [orders] = useState<OrderItem[]>([
    { id: 'ORD-9821', customer: 'João Paulo (Tianguá)', store: 'AutoPeças & Mecânica Tianguá', status: 'Em Trânsito', price: 245.00, date: 'Hoje, 14:20', type: 'Peça' },
    { id: 'ORD-9822', customer: 'Maria Clara (Ubajara)', store: 'Ubajara MotoPeças', status: 'Em Preparo', price: 89.90, date: 'Hoje, 14:05', type: 'Serviço' },
    { id: 'ORD-9823', customer: 'Carlos Eduardo (Ibiapina)', store: 'Centro Automotivo Ibiapina', status: 'Entregue', price: 450.00, date: 'Hoje, 11:30', type: 'Leva e Traz' },
    { id: 'ORD-9824', customer: 'Antônio Silva (Viçosa)', store: 'AutoPeças Tianguá', status: 'Pendente', price: 130.00, date: 'Hoje, 10:15', type: 'Peça' }
  ]);

  const [quotes, setQuotes] = useState<QuoteItem[]>([
    { id: 'COT-501', customer: 'Lucas Santos', service: 'Troca de Kit Transmissão Bros 160', description: 'Corrente com retentor e dentes gastos', budget: 'R$ 190,00 - R$ 230,00', status: 'Respondido' },
    { id: 'COT-502', customer: 'Fernanda Lima', service: 'Revisão Sistema de Freios ABS', description: 'Civic 2019 com luz do ABS acesa', budget: 'R$ 350,00 - R$ 500,00', status: 'Aberto' }
  ]);

  const addQuote = (service: string, description: string, budget: string) => {
    const newQ: QuoteItem = {
      id: `COT-${Math.floor(500 + Math.random() * 500)}`,
      customer: 'Você (Usuário)',
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
      setViewMode('admin_control_pro');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setViewMode('public');
    setRole('cliente');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        viewMode,
        setViewMode,
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
// BARRA DE MUDANÇA RÁPIDA DE VISÃO (TOP NAVIGATION SWITCHER)
// ============================================================================
const EnvironmentSwitcher: React.FC = () => {
  const { viewMode, setViewMode, role, setRole } = useApp();

  return (
    <div className="bg-slate-950 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-lg z-50 sticky top-0">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-extrabold text-white tracking-wide">IbiapabaExpress Pro</span>
        <span className="text-[10px] text-slate-400 hidden sm:inline">• Serra da Ibiapaba (CE)</span>
      </div>

      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setViewMode('public')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] transition ${
            viewMode === 'public'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>App Público</span>
        </button>

        <button
          onClick={() => setViewMode('admin_control_pro')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] transition ${
            viewMode === 'admin_control_pro'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>AdminControl Pro</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// PAINEL ADMINCONTROL PRO (TORRE DE CONTROLE, MÉTRICAS E OPERAÇÃO)
// ============================================================================
const AdminControlProView: React.FC = () => {
  const { orders, quotes, logoutAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<'kpis' | 'pedidos' | 'cotacoes' | 'usuarios'>('kpis');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 space-y-6 pb-20">
      {/* Topo do AdminControl Pro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-3xl border border-cyan-500/30 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-white">AdminControl Pro</h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[10px] border border-cyan-500/40">
                Torre de Controle
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Métricas globais, leilões e logística em tempo real</p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800/50 transition shadow-md"
        >
          <LogOut className="w-4 h-4" /> Encerrar Sessão Master
        </button>
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>GMV Processado</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-400">R$ 54.890,00</p>
          <p className="text-[10px] text-emerald-500 flex items-center gap-0.5 font-bold">
            <ArrowUpRight className="w-3 h-3" /> +18.4% este mês
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pedidos Ativos</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-black text-cyan-400">{orders.length} operando</p>
          <p className="text-[10px] text-cyan-500 font-bold">Tianguá, Ubajara & Viçosa</p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Leilões de Cotações</span>
            <Wrench className="w-4 h-4 text-fuchsia-400" />
          </div>
          <p className="text-xl font-black text-fuchsia-400">{quotes.length} ativas</p>
          <p className="text-[10px] text-fuchsia-400 font-bold">Taxa de resposta: 92%</p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Leva e Traz</span>
            <Bike className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-black text-amber-400">18 corridas hoje</p>
          <p className="text-[10px] text-amber-500 font-bold">Frota 100% alocada</p>
        </div>
      </div>

      {/* Gráfico Visual de Operações */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Volume Operacional por Cidade (Ibiapaba)
          </h3>
          <span className="text-[10px] font-bold text-slate-400">Atualizado ao vivo</span>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-300">Tianguá (Polo Principal)</span>
              <span className="text-cyan-400">45% do volume</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-300">Ubajara & Viçosa</span>
              <span className="text-fuchsia-400">30% do volume</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-300">Ibiapina, São Benedito & Guaraciaba</span>
              <span className="text-amber-400">25% do volume</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Gestão de Pedidos em Tempo Real */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-fuchsia-400" /> Monitoramento em Tempo Real
          </h3>
          <span className="text-[11px] font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-1 rounded-xl border border-fuchsia-500/30">
            {orders.length} Registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">ID / Cliente</th>
                <th className="p-3">Oficina / Lojista</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Valor</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <p className="font-bold text-white">{o.id}</p>
                    <p className="text-[10px] text-slate-400">{o.customer}</p>
                  </td>
                  <td className="p-3 text-slate-300">{o.store}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">
                      {o.type}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-emerald-400">R$ {o.price.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      o.status === 'Entregue'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : o.status === 'Em Trânsito'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REACT APP ARCHITECT: SUPER APP PÚBLICO (CLIENTE, COMÉRCIO E ENTREGADOR)
// ============================================================================
const ReactAppArchitectPublicView: React.FC = () => {
  const { role, setRole, cartCount, setCartCount, quotes, addQuote } = useApp();
  const [customerTab, setCustomerTab] = useState<'lojas' | 'cotacoes' | 'levaETraz'>('lojas');

  const [serviceInput, setServiceInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const stores: StoreItem[] = [
    {
      id: '1',
      name: 'AutoPeças & Mecânica Tianguá',
      category: 'Mecânica, Óleo & Peças',
      rating: 4.9,
      deliveryTime: '20-30 min',
      deliveryFee: 5.0,
      city: 'Tianguá - Centro',
      badge: 'Mais Vendido',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      name: 'Centro Automotivo Ibiapina',
      category: 'Injeção & Suspensão',
      rating: 4.8,
      deliveryTime: '25-40 min',
      deliveryFee: 7.0,
      city: 'Ibiapina',
      badge: 'Recomendado',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      name: 'Ubajara MotoPeças & Oficina',
      category: 'Peças para Moto',
      rating: 5.0,
      deliveryTime: '15-25 min',
      deliveryFee: 4.5,
      city: 'Ubajara',
      badge: 'Atendimento 24h',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80'
    }
  ];

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceInput) return;
    addQuote(serviceInput, descInput || 'Solicitado via Super App', 'Em análise pelas oficinas');
    setServiceInput('');
    setDescInput('');
    alert('Cotação enviada! As oficinas parceiras enviarão propostas em instantes.');
  };

  return (
    <div className="max-w-md mx-auto bg-slate-950 min-h-screen text-slate-100 flex flex-col font-sans pb-24 border-x border-slate-800 shadow-2xl">
      {/* Header do App Público */}
      <header className="p-4 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-[41px] z-40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-fuchsia-400">
              IE
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white leading-none">IbiapabaExpress</h2>
            <p className="text-[10px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" /> Tianguá & Região
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-slate-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-fuchsia-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo dinâmico por Papel (Cliente, Comércio, Entregador) */}
      <main className="p-4 space-y-4 flex-1">
        {role === 'cliente' && (
          <>
            {/* Banner Promocional */}
            <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-fuchsia-900 p-4 rounded-3xl border border-violet-500/30 space-y-2 shadow-xl">
              <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-black text-[9px] border border-fuchsia-500/40 uppercase">
                Leilão de Preços
              </span>
              <h3 className="font-black text-base text-white">Economize na Manutenção do seu Veículo</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Envie o que precisa e receba orçamentos de diversas oficinas da Serra da Ibiapaba.
              </p>
            </div>

            {/* Abas Internas */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setCustomerTab('lojas')}
                className={`py-2 rounded-xl transition ${customerTab === 'lojas' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}
              >
                Parceiros
              </button>
              <button
                onClick={() => setCustomerTab('cotacoes')}
                className={`py-2 rounded-xl transition ${customerTab === 'cotacoes' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}
              >
                Cotações
              </button>
              <button
                onClick={() => setCustomerTab('levaETraz')}
                className={`py-2 rounded-xl transition ${customerTab === 'levaETraz' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}
              >
                Leva e Traz
              </button>
            </div>

            {customerTab === 'lojas' && (
              <div className="space-y-3">
                {stores.map((s) => (
                  <div key={s.id} className="bg-slate-900/90 rounded-3xl p-3 border border-slate-800 shadow-xl flex items-center gap-3">
                    <img src={s.image} alt={s.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-white truncate">{s.name}</h4>
                      <p className="text-[11px] text-slate-400">{s.category}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mt-1 font-semibold">
                        <span className="text-amber-400 font-bold flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400" />{s.rating}</span>
                        <span>• {s.deliveryTime}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCartCount((prev) => prev + 1)}
                      className="p-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {customerTab === 'cotacoes' && (
              <form onSubmit={handleSendQuote} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-fuchsia-400" /> Nova Cotação / Pedido de Peça
                </h4>
                <input
                  type="text"
                  placeholder="Ex: Troca de pastilhas de freio Moto Bros 160"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
                <textarea
                  placeholder="Observações ou ano do veículo..."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  rows={2}
                />
                <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs">
                  Disparar Cotação
                </button>
              </form>
            )}

            {customerTab === 'levaETraz' && (
              <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-cyan-400" /> Coleta e Devolução de Veículos
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Buscamos sua moto ou carro no seu endereço e levamos até a oficina credenciada.
                </p>
                <button onClick={() => alert('Coleta agendada!')} className="w-full py-2.5 rounded-xl bg-cyan-600 text-white font-black">
                  Agendar Coleta
                </button>
              </div>
            )}
          </>
        )}

        {role === 'comercio' && (
          <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-indigo-400" /> Painel da Oficina / Lojista
            </h3>
            <p className="text-slate-400">Sua loja está visível para clientes de toda a Serra da Ibiapaba.</p>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-bold text-emerald-400">
              Faturamento do Dia: R$ 1.250,00
            </div>
          </div>
        )}

        {role === 'entregador' && (
          <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Bike className="w-4 h-4 text-amber-400" /> Painel do Entregador Credenciado
            </h3>
            <p className="text-slate-400">Você possui 2 entregas de peças e 1 corrida Leva e Traz em aberto.</p>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-bold text-cyan-400">
              Ganhos Previstos: R$ 120,00
            </div>
          </div>
        )}
      </main>

      {/* Navegação Inferior de Perfis do App */}
      <nav className="fixed bottom-0 max-w-md w-full bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-6 py-2.5 flex items-center justify-between z-40">
        <button
          onClick={() => setRole('cliente')}
          className={`flex flex-col items-center gap-1 text-[10px] font-extrabold ${role === 'cliente' ? 'text-fuchsia-400' : 'text-slate-500'}`}
        >
          <Home className="w-5 h-5" />
          <span>Cliente</span>
        </button>

        <button
          onClick={() => setRole('comercio')}
          className={`flex flex-col items-center gap-1 text-[10px] font-extrabold ${role === 'comercio' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Store className="w-5 h-5" />
          <span>Lojista</span>
        </button>

        <button
          onClick={() => setRole('entregador')}
          className={`flex flex-col items-center gap-1 text-[10px] font-extrabold ${role === 'entregador' ? 'text-amber-400' : 'text-slate-500'}`}
        >
          <Bike className="w-5 h-5" />
          <span>Entregador</span>
        </button>
      </nav>
    </div>
  );
};

// ============================================================================
// COMPONENTE RAIZ
// ============================================================================
const MainShell: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <EnvironmentSwitcher />
      {viewMode === 'admin_control_pro' ? <AdminControlProView /> : <ReactAppArchitectPublicView />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
