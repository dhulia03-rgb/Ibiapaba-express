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
  Smartphone,
  Check
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
  city: string;
  badge?: string;
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

export interface LevaETrazItem {
  id: string;
  vehicle: string;
  pickupAddress: string;
  workshop: string;
  status: 'Agendado' | 'Em Coleta' | 'Na Oficina' | 'Devolvido';
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
  levaETrazList: LevaETrazItem[];
  addQuote: (service: string, description: string, budget: string) => void;
  addLevaETraz: (vehicle: string, pickupAddress: string, workshop: string) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('cliente');
  const [cartCount, setCartCount] = useState<number>(1);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const [orders] = useState<OrderItem[]>([
    { id: 'ORD-8921', title: 'Kit Transmissão & Óleo 20W50', store: 'AutoPeças & Mecânica Tianguá', status: 'Em Preparo', price: 185.00, date: 'Hoje, 14:20' },
    { id: 'ORD-8810', title: 'Revisão Preventiva Freios', store: 'Centro Automotivo Ibiapina', status: 'Entregue', price: 120.00, date: 'Ontem, 09:15' }
  ]);

  const [quotes, setQuotes] = useState<QuoteItem[]>([
    { id: 'COT-101', service: 'Troca de Embreagem Moto', description: 'Honda CG 160 Fan 2023 - Rangendo ao engatar', budget: 'R$ 180,00 - R$ 240,00', status: 'Respondido' },
    { id: 'COT-102', service: 'Alinhamento & Balanceamento 3D', description: 'Gol G6 - Pneus dianteiros desgastando desigual', budget: 'R$ 100,00 - R$ 150,00', status: 'Aberto' }
  ]);

  const [levaETrazList, setLevaETrazList] = useState<LevaETrazItem[]>([
    { id: 'LT-301', vehicle: 'Titan 160 Prata', pickupAddress: 'Rua Coronel Antonino, Centro - Tianguá', workshop: 'Oficina Central Tianguá', status: 'Em Coleta' }
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

  const addLevaETraz = (vehicle: string, pickupAddress: string, workshop: string) => {
    const newLT: LevaETrazItem = {
      id: `LT-${Math.floor(100 + Math.random() * 900)}`,
      vehicle,
      pickupAddress,
      workshop,
      status: 'Agendado'
    };
    setLevaETrazList((prev) => [newLT, ...prev]);
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
        levaETrazList,
        addQuote,
        addLevaETraz,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">Cluster Supabase</h3>
              <p className="text-[11px] text-cyan-400 font-semibold">Serra da Ibiapaba • PostgreSQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${isSupabaseConfigured ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' : 'bg-amber-950/50 border-amber-500/50 text-amber-200'}`}>
            {isSupabaseConfigured ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />}
            <div>
              <p className="font-bold text-sm">{isSupabaseConfigured ? 'Conexão Supabase Ativa' : 'Modo Preview / Local Mock'}</p>
              <p className="text-xs opacity-80 leading-relaxed">{isSupabaseConfigured ? 'Variáveis VITE_SUPABASE_URL e KEY sincronizadas com sucesso.' : 'O sistema está em modo fallback com dados simulados para navegação fluida.'}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400">
              <span>VITE_SUPABASE_URL:</span>
              <span className={supabaseUrl ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{supabaseUrl ? 'ONLINE' : 'AUSENTE'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 break-all text-[11px]">
              {supabaseUrl || 'https://seu-projeto-ibiapaba.supabase.co'}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-violet-600/30 hover:opacity-95 transition">
          Concluir Visualização
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// HEADER VIBRANTE COM GRADIENTE NEON
// ============================================================================
const AppHeader: React.FC<{ onOpenSupabase: () => void; onOpenAdminAuth: () => void }> = ({ onOpenSupabase, onOpenAdminAuth }) => {
  const { role, cartCount } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-violet-500/20 px-4 py-3 shadow-xl">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Marca / Logo Super App */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-0.5 shadow-lg shadow-violet-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-fuchsia-400 fill-fuchsia-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-fuchsia-200 bg-clip-text text-transparent">
                Ibiapaba<span className="text-fuchsia-500">Express</span>
              </h1>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" /> Tianguá, Ubajara, Viçosa & Região
            </p>
          </div>
        </div>

        {/* Botões de Ação Topo */}
        <div className="flex items-center gap-2">
          <button onClick={onOpenSupabase} className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition shadow-sm" title="Status Supabase">
            <Database className="w-4 h-4" />
          </button>

          <button onClick={onOpenAdminAuth} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold text-xs shadow-md shadow-violet-600/30 transition border border-violet-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// VISÃO DO CLIENTE (DESIGN ESTILOSO & IMPACTANTE)
// ============================================================================
const CustomerView: React.FC = () => {
  const { setCartCount, quotes, addQuote, levaETrazList, addLevaETraz } = useApp();
  const [activeTab, setActiveTab] = useState<'lojas' | 'cotacoes' | 'levaETraz' | 'indique'>('lojas');

  // Forms
  const [serviceInput, setServiceInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const [vehicleInput, setVehicleInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [workshopInput, setWorkshopInput] = useState('AutoPeças & Mecânica Tianguá');

  const stores: StoreItem[] = [
    {
      id: '1',
      name: 'AutoPeças & Mecânica Tianguá',
      category: 'Mecânica, Óleo & Acessórios',
      rating: 4.9,
      deliveryTime: '20-30 min',
      deliveryFee: 5.0,
      city: 'Tianguá - Centro',
      badge: 'Super Parceiro',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      name: 'Centro Automotivo Ibiapina',
      category: 'Injeção, Freios & Suspensão',
      rating: 4.8,
      deliveryTime: '25-40 min',
      deliveryFee: 7.0,
      city: 'Ibiapina',
      badge: 'Destaque',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      name: 'Ubajara MotoPeças & Oficina 24h',
      category: 'Peças de Moto & Socorro',
      rating: 5.0,
      deliveryTime: '15-25 min',
      deliveryFee: 4.5,
      city: 'Ubajara',
      badge: '24 Horas',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80'
    }
  ];

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceInput) return;
    addQuote(serviceInput, descInput || 'Solicitação urgente via App', 'Aguardando propostas');
    setServiceInput('');
    setDescInput('');
    alert('🚀 Cotação enviada! As oficinas parceiras da Serra da Ibiapaba foram notificadas.');
  };

  const handleCreateLevaETraz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleInput || !addressInput) return;
    addLevaETraz(vehicleInput, addressInput, workshopInput);
    setVehicleInput('');
    setAddressInput('');
    alert('🛵 Solicitação de Leva e Traz registrada! O entregador buscará seu veículo no endereço fornecido.');
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Banner Principal Promocional */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-slate-900 to-fuchsia-950 p-5 border border-violet-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-fuchsia-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
            <Sparkles className="w-3 h-3" /> Super App Regional
          </span>
          <h2 className="text-xl font-black text-white leading-tight">
            Tudo para seu Veículo na <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">Serra da Ibiapaba</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Peças, mecânicos credenciados, leilão de preços e serviço exclusivo <strong className="text-fuchsia-400">Leva e Traz</strong> na sua porta.
          </p>
        </div>
      </div>

      {/* Menu de Abas Estilosas com Efeito Glowing */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
        <button
          onClick={() => setActiveTab('lojas')}
          className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-extrabold transition-all ${
            activeTab === 'lojas'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Lojas</span>
        </button>

        <button
          onClick={() => setActiveTab('cotacoes')}
          className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-extrabold transition-all ${
            activeTab === 'cotacoes'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Cotações</span>
        </button>

        <button
          onClick={() => setActiveTab('levaETraz')}
          className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-extrabold transition-all ${
            activeTab === 'levaETraz'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Leva/Traz</span>
        </button>

        <button
          onClick={() => setActiveTab('indique')}
          className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-extrabold transition-all ${
            activeTab === 'indique'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Indique</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: LOJAS & OFICINAS */}
      {activeTab === 'lojas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-fuchsia-400" /> Oficinas & Autopeças Destaque
            </h3>
            <span className="text-[11px] text-cyan-400 font-bold">{stores.length} Ativas</span>
          </div>

          <div className="space-y-3.5">
            {stores.map((s) => (
              <div
                key={s.id}
                className="group relative bg-slate-900/90 rounded-3xl p-3.5 border border-slate-800 hover:border-violet-500/50 transition-all duration-300 shadow-xl flex items-center gap-3.5 overflow-hidden"
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-700/50">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {s.badge && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-fuchsia-600 text-white text-[9px] font-black">
                      {s.badge}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-extrabold text-sm text-white truncate">{s.name}</h4>
                  <p className="text-xs text-slate-400 truncate">{s.category}</p>
                  
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300 pt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {s.rating}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-300">{s.deliveryTime}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-emerald-400">R$ {s.deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartCount((prev) => prev + 1);
                    alert(`Item de "${s.name}" adicionado ao carrinho!`);
                  }}
                  className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-600/30 transition active:scale-95"
                  title="Adicionar ao Carrinho"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: COTAÇÃO / LEILÃO */}
      {activeTab === 'cotacoes' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateQuote} className="bg-slate-900/90 p-5 rounded-3xl border border-violet-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-fuchsia-400 font-extrabold text-sm">
              <div className="p-2 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40">
                <Wrench className="w-4 h-4" />
              </div>
              <span>Leilão Reverso de Preços (Mecânica)</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Qual o serviço ou peça que precisa?</label>
                <input
                  type="text"
                  placeholder="Ex: Troca de pastilhas de freio Civic 2018"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-fuchsia-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Detalhes do veículo / Especificações</label>
                <textarea
                  placeholder="Descreva o ano, modelo ou sintoma do problema..."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-fuchsia-500"
                  rows={2}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-fuchsia-600/30 hover:opacity-95 transition"
            >
              Disparar Cotação para Oficinas
            </button>
          </form>

          {/* Histórico de Cotações */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Suas Cotações Ativas</h4>
            {quotes.map((q) => (
              <div key={q.id} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-extrabold text-white">
                  <span>{q.service}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${q.status === 'Respondido' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">{q.description}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-300">
                  <span>Proposta estimada:</span>
                  <span className="font-extrabold text-fuchsia-400">{q.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: LEVA E TRAZ DE VEÍCULOS */}
      {activeTab === 'levaETraz' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateLevaETraz} className="bg-slate-900/90 p-5 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400 font-extrabold text-sm">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40">
                <Bike className="w-4 h-4" />
              </div>
              <span>Agendar Leva e Traz na Porta</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Não tem tempo de ir à oficina? Nosso entregador credenciado busca o seu veículo na sua casa/trabalho e devolve revisado!
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Modelo do Veículo / Placa</label>
                <input
                  type="text"
                  placeholder="Ex: Honda Bros 160 Vermelha - Placa XXX-0000"
                  value={vehicleInput}
                  onChange={(e) => setVehicleInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Endereço Completo de Coleta</label>
                <input
                  type="text"
                  placeholder="Rua, número, bairro e cidade na Serra"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Oficina Destino</label>
                <select
                  value={workshopInput}
                  onChange={(e) => setWorkshopInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="AutoPeças & Mecânica Tianguá">AutoPeças & Mecânica Tianguá</option>
                  <option value="Centro Automotivo Ibiapina">Centro Automotivo Ibiapina</option>
                  <option value="Ubajara MotoPeças & Oficina 24h">Ubajara MotoPeças & Oficina 24h</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/30 hover:opacity-95 transition"
            >
              Solicitar Motoboy Leva e Traz
            </button>
          </form>

          {/* Lista de Leva e Traz */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Histórico de Coletas</h4>
            {levaETrazList.map((lt) => (
              <div key={lt.id} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-extrabold text-white">
                  <span>{lt.vehicle}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black">
                    {lt.status}
                  </span>
                </div>
                <p className="text-slate-400"><strong>Coleta:</strong> {lt.pickupAddress}</p>
                <p className="text-slate-400"><strong>Destino:</strong> {lt.workshop}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 4: PROGRAMA INDIQUE E GANHE */}
      {activeTab === 'indique' && (
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4 text-center">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-500 to-fuchsia-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
              <Award className="w-7 h-7" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-white">Indique Amigos na Serra da Ibiapaba</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ganhe <strong className="text-amber-400">R$ 15,00 em saldo</strong> no app para cada amigo que realizar a primeira cotação ou pedido!
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-fuchsia-400 font-bold">IBIAPABA-EXPRESS-2026</span>
            <button
              onClick={() => alert('Código de Indicação copiado!')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition"
            >
              Copiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// VISÃO DO LOJISTA / OFICINA
// ============================================================================
const MerchantView: React.FC = () => (
  <div className="space-y-5 pb-24">
    <div className="bg-slate-900/90 p-5 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-extrabold text-base text-white">Painel da Oficina / Lojista</h2>
          <p className="text-xs text-slate-400">Gestão de Peças, Pedidos & Cotações Recebidas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-slate-400 font-medium">Pedidos Hoje</p>
          <p className="text-lg font-black text-indigo-400">12 chamados</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-slate-400 font-medium">Faturamento Estimado</p>
          <p className="text-lg font-black text-emerald-400">R$ 1.840,00</p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// VISÃO DO ENTREGADOR
// ============================================================================
const CourierView: React.FC = () => (
  <div className="space-y-5 pb-24">
    <div className="bg-slate-900/90 p-5 rounded-3xl border border-amber-500/30 shadow-2xl space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
          <Bike className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-extrabold text-base text-white">Painel do Entregador</h2>
          <p className="text-xs text-slate-400">Rotas de Entrega & Corridas Leva e Traz</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-slate-400 font-medium">Coletas Ativas</p>
          <p className="text-lg font-black text-amber-400">3 rotas</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-slate-400 font-medium">Ganhos do Dia</p>
          <p className="text-lg font-black text-emerald-400">R$ 145,00</p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// PAINEL ADMINISTRADOR MASTER (PROTEGIDO)
// ============================================================================
const MasterAdminDashboard: React.FC = () => {
  const { logoutAdmin } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-3xl border border-violet-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">Administrador Master</h2>
            <p className="text-xs text-slate-400">Controle Plataforma IbiapabaExpress</p>
          </div>
        </div>
        <button
          onClick={logoutAdmin}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800/50 transition"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">GMV Total Processado</p>
          <p className="text-xl font-black text-emerald-400">R$ 48.920,00</p>
        </div>
        <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Corridas Leva e Traz</p>
          <p className="text-xl font-black text-cyan-400">312 concluídas</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL DE AUTENTICAÇÃO DO ADMIN MASTER
// ============================================================================
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-fuchsia-400" />
            <h3 className="font-extrabold text-sm">Painel Restrito Admin</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Senha de Acesso Master:</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Digite admin123..."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-fuchsia-500"
              autoFocus
              required
            />
          </div>

          {error && <p className="text-xs text-red-400 font-bold">Senha incorreta. Tente "admin123".</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-extrabold text-xs transition shadow-lg shadow-violet-600/30"
          >
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AppHeader onOpenSupabase={() => setSupabaseOpen(true)} onOpenAdminAuth={() => setAdminAuthOpen(true)} />

      <main className="flex-1 max-w-md w-full mx-auto p-4">
        {role === 'cliente' && <CustomerView />}
        {role === 'comercio' && <MerchantView />}
        {role === 'entregador' && <CourierView />}
      </main>

      {/* Navegação Inferior (Mobile Bar Glassmorphism) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-6 py-2.5 flex items-center justify-between z-40 shadow-2xl">
        <button
          onClick={() => setRole('cliente')}
          className={`flex flex-col items-center gap-1 text-[10px] font-extrabold transition ${
            role === 'cliente' ? 'text-fuchsia-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </button>

        <button
          onClick={() => setRole('comercio')}
          className={`flex flex-col items-center gap-1 text-[10px] font-extrabold transition ${
            role === 'comercio' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Store className="w-5 h-5" />
          <span>Lojista</span>
        </button>

        <button
          onClick={() => setRole('entregador')}
          className={`flex flex-col items-center gap-1 text-[10px] font-extrabold transition ${
            role === 'entregador' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Bike className="w-5 h-5" />
          <span>Entregador</span>
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
