import { AdminControlPro } from './components/AdminControlPro';
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
  Check,
  Printer,
  CloudRain,
  PhoneCall,
  Key,
  FileText,
  UserPlus,
  Building2,
  Navigation,
  Bell,
  CheckCheck
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO SUPABASE
// ============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// CONSTANTES E TIPOS
// ============================================================================
export const CIDADES_IBIAPABA = [
  'Tianguá',
  'Ubajara',
  'São Benedito',
  'Viçosa do Ceará',
  'Ibiapina',
  'Guaraciaba do Norte',
  'Croatá',
  'Carnaubal',
  'Ipu'
] as const;

export type CidadeIbiapaba = typeof CIDADES_IBIAPABA[number];
export type Role = 'cliente' | 'comercio' | 'entregador' | 'admin';

export interface UserProfile {
  name: string;
  phone: string;
  city: CidadeIbiapaba;
  role: Role;
  companyName?: string;
  vehicleInfo?: string;
}

export interface QuoteBid {
  id: string;
  storeName: string;
  price: number;
  warranty: string;
  estimatedTime: string;
}

export interface QuoteItem {
  id: string;
  customer: string;
  city: CidadeIbiapaba;
  service: string;
  description: string;
  status: 'Aberto' | 'Respondido' | 'Finalizado';
  bids: QuoteBid[];
}

export interface OrderItem {
  id: string;
  customer: string;
  store: string;
  city: CidadeIbiapaba;
  status: 'Pendente' | 'Em Preparo' | 'Em Trânsito' | 'Entregue';
  price: number;
  date: string;
  type: 'Peça' | 'Serviço' | 'Leva e Traz';
  slaAlert: 'ok' | 'amarelo' | 'vermelho';
  pinCode: string;
  driverName?: string;
  gpsProgress: number; // 0 a 100%
}

// ============================================================================
// CONTEXTO GLOBAL DA APLICAÇÃO
// ============================================================================
interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  selectedCity: CidadeIbiapaba;
  setSelectedCity: (city: CidadeIbiapaba) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  orders: OrderItem[];
  quotes: QuoteItem[];
  addQuote: (service: string, description: string) => void;
  submitBid: (quoteId: string, storeName: string, price: number, warranty: string, time: string) => void;
  acceptBid: (quoteId: string, bid: QuoteBid) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pass: string, otp: string) => boolean;
  logoutAdmin: () => void;
  registerModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  rainFeeActive: Record<CidadeIbiapaba, boolean>;
  toggleRainFee: (city: CidadeIbiapaba) => void;
  cityPauseActive: Record<CidadeIbiapaba, boolean>;
  toggleCityPause: (city: CidadeIbiapaba) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('cliente');
  const [selectedCity, setSelectedCity] = useState<CidadeIbiapaba>('Tianguá');
  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    name: 'João Paulo (Cliente)',
    phone: '(88) 99823-1102',
    city: 'Tianguá',
    role: 'cliente'
  });

  const [cartCount, setCartCount] = useState<number>(1);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [rainFeeActive, setRainFeeActive] = useState<Record<CidadeIbiapaba, boolean>>({
    'Tianguá': true, 'Ubajara': false, 'São Benedito': false, 'Viçosa do Ceará': false,
    'Ibiapina': false, 'Guaraciaba do Norte': false, 'Croatá': false, 'Carnaubal': false, 'Ipu': false
  });

  const [cityPauseActive, setCityPauseActive] = useState<Record<CidadeIbiapaba, boolean>>({
    'Tianguá': false, 'Ubajara': false, 'São Benedito': false, 'Viçosa do Ceará': false,
    'Ibiapina': false, 'Guaraciaba do Norte': false, 'Croatá': false, 'Carnaubal': false, 'Ipu': false
  });

  // Pedidos Ativos com Animação de Rastreamento GPS
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'ORD-9821', customer: 'João Paulo', store: 'AutoPeças Tianguá', city: 'Tianguá', status: 'Em Trânsito', price: 245.00, date: '14:20', type: 'Peça', slaAlert: 'vermelho', pinCode: '4821', driverName: 'Carlos Motoboy', gpsProgress: 65 },
    { id: 'ORD-9822', customer: 'Maria Clara', store: 'Oficina Ubajara', city: 'Ubajara', status: 'Em Preparo', price: 89.90, date: '14:05', type: 'Serviço', slaAlert: 'amarelo', pinCode: '1192', gpsProgress: 20 },
    { id: 'ORD-9823', customer: 'Carlos Eduardo', store: 'Centro Ibiapina', city: 'Ibiapina', status: 'Entregue', price: 450.00, date: '11:30', type: 'Leva e Traz', slaAlert: 'ok', pinCode: '8830', driverName: 'Marcos Entregador', gpsProgress: 100 }
  ]);

  // Cotações Vivas com Lances Reais das Oficinas
  const [quotes, setQuotes] = useState<QuoteItem[]>([
    {
      id: 'COT-501',
      customer: 'João Paulo',
      city: 'Tianguá',
      service: 'Troca de Kit Transmissão Bros 160',
      description: 'Corrente com retentor e dentes gastos',
      status: 'Respondido',
      bids: [
        { id: 'B1', storeName: 'Mecânica Central Tianguá', price: 210.00, warranty: '3 Meses', estimatedTime: '40 min' },
        { id: 'B2', storeName: 'MotoPeças Serra', price: 185.00, warranty: '6 Meses', estimatedTime: '25 min' }
      ]
    }
  ]);

  // Simulação de Movimento de GPS dos Motoboys
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.status === 'Em Trânsito' && o.gpsProgress < 95) {
            return { ...o, gpsProgress: o.gpsProgress + 5 };
          }
          return o;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);
<div className="min-h-screen bg-slate-950 text-white p-4">
  {/* O teu cabeçalho ou conteúdo normal */}
  <header className="mb-6">
    <h1 className="text-xl font-bold">IbiapabaExpress</h1>
  </header>

  {/* O nosso Painel de Controlo do Administrador */}
  <AdminControlPro />
</div>

  const addQuote = (service: string, description: string) => {
    const newQ: QuoteItem = {
      id: `COT-${Math.floor(500 + Math.random() * 500)}`,
      customer: userProfile?.name || 'Cliente Ibiapaba',
      city: selectedCity,
      service,
      description,
      status: 'Aberto',
      bids: []
    };
    setQuotes((prev) => [newQ, ...prev]);
    showToast('🚀 Cotação lançada no leilão para as oficinas da Serra!');
  };

  const submitBid = (quoteId: string, storeName: string, price: number, warranty: string, time: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          const newBid: QuoteBid = { id: `B-${Date.now()}`, storeName, price, warranty, estimatedTime: time };
          return { ...q, status: 'Respondido', bids: [...q.bids, newBid] };
        }
        return q;
      })
    );
    showToast(`💰 Proposta de R$ ${price.toFixed(2)} enviada com sucesso!`);
  };

  const acceptBid = (quoteId: string, bid: QuoteBid) => {
    const newOrder: OrderItem = {
      id: `ORD-${Math.floor(9000 + Math.random() * 900)}`,
      customer: userProfile?.name || 'Cliente',
      store: bid.storeName,
      city: selectedCity,
      status: 'Em Preparo',
      price: bid.price,
      date: 'Agora',
      type: 'Serviço',
      slaAlert: 'ok',
      pinCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      gpsProgress: 10
    };
    setOrders((prev) => [newOrder, ...prev]);
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    showToast(`🎉 Proposta da ${bid.storeName} aceita! Pedido #${newOrder.id} gerado.`);
  };

  const toggleRainFee = (city: CidadeIbiapaba) => {
    setRainFeeActive((prev) => {
      const state = !prev[city];
      showToast(`🌧️ Taxa de Chuva ${state ? 'Ativada' : 'Desativada'} para ${city}`);
      return { ...prev, [city]: state };
    });
  };

  const toggleCityPause = (city: CidadeIbiapaba) => {
    setCityPauseActive((prev) => {
      const state = !prev[city];
      showToast(`⛔ Pausa de Operação ${state ? 'Ativada' : 'Desativada'} para ${city}`);
      return { ...prev, [city]: state };
    });
  };

  const loginAdmin = (pass: string, otp: string) => {
    if ((pass === 'admin123' || pass === 'master2026') && otp.length === 6) {
      setIsAdminAuthenticated(true);
      setRole('admin');
      showToast('🛡️ Acesso Master Autenticado via 2FA');
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
        selectedCity,
        setSelectedCity,
        userProfile,
        setUserProfile,
        cartCount,
        setCartCount,
        orders,
        quotes,
        addQuote,
        submitBid,
        acceptBid,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        registerModalOpen,
        setRegisterModalOpen,
        toastMessage,
        showToast,
        rainFeeActive,
        toggleRainFee,
        cityPauseActive,
        toggleCityPause
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
// COMPONENTE DE NOTIFICAÇÃO (TOAST REATIVO)
// ============================================================================
const NotificationToast: React.FC = () => {
  const { toastMessage } = useApp();
  if (!toastMessage) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl border border-fuchsia-400 flex items-center justify-between animate-bounce">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE DE RASTREAMENTO GPS COMPACTO COM RADAR ANIMAÇÃO
// ============================================================================
const LiveGpsTracker: React.FC<{ order: OrderItem }> = ({ order }) => {
  return (
    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 font-sans">
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold text-cyan-400 flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 animate-spin" /> Rastreamento ao Vivo (GPS)
        </span>
        <span className="text-[10px] text-slate-400 font-mono">{order.gpsProgress}% do Percurso</span>
      </div>

      {/* Barra de Progresso do Percurso */}
      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-emerald-400 transition-all duration-1000"
          style={{ width: `${order.gpsProgress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1">
        <span>🏪 {order.store}</span>
        <span className="text-emerald-400">🏍️ {order.driverName || 'Atribuindo Motoboy'}</span>
        <span>🏠 Seu Endereço</span>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL DE REGISTRO E PERFIL
// ============================================================================
const ProfileRegisterModal: React.FC = () => {
  const { registerModalOpen, setRegisterModalOpen, setUserProfile, setRole, selectedCity, showToast } = useApp();
  const [selectedType, setSelectedType] = useState<'cliente' | 'comercio' | 'entregador'>('cliente');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<CidadeIbiapaba>(selectedCity);
  const [extraInfo, setExtraInfo] = useState('');

  if (!registerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setUserProfile({
      name,
      phone,
      city,
      role: selectedType,
      companyName: selectedType === 'comercio' ? extraInfo : undefined,
      vehicleInfo: selectedType === 'entregador' ? extraInfo : undefined
    });

    setRole(selectedType);
    setRegisterModalOpen(false);
    showToast(`🎉 Perfil ativado como ${selectedType.toUpperCase()}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-fuchsia-400">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-white">Criar Perfil no Super App</h3>
          </div>
          <button onClick={() => setRegisterModalOpen(false)} className="p-1 rounded-xl bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('cliente')}
            className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
              selectedType === 'cliente' ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 border-fuchsia-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-black">Cliente</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('comercio')}
            className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
              selectedType === 'comercio' ? 'bg-gradient-to-br from-indigo-600 to-blue-600 border-indigo-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-black">Empresa</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('entregador')}
            className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
              selectedType === 'entregador' ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Bike className="w-5 h-5" />
            <span className="text-[10px] font-black">Entregador</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Nome Completo *</label>
            <input
              type="text"
              placeholder="Digite seu nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                placeholder="(88) 9..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Cidade na Serra</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as CidadeIbiapaba)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                {CIDADES_IBIAPABA.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedType === 'comercio' && (
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Nome Fantasia da Oficina / Loja</label>
              <input
                type="text"
                placeholder="Ex: AutoPeças Tianguá"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          )}

          {selectedType === 'entregador' && (
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Veículo / Placa</label>
              <input
                type="text"
                placeholder="Ex: Moto Bros 160 - Placa XXX-0000"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          )}

          <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-black text-xs">
            Concluir Cadastro de {selectedType.toUpperCase()}
          </button>
        </form>
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
  const [otp, setOtp] = useState('123456');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pass, otp)) {
      setError(false);
      setPass('');
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-sm">Autenticação 2FA Admin</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Senha Master de Controle:</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="admin123"
              className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Código OTP 2FA:</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full p-2.5 text-center font-mono rounded-2xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-bold"
              required
            />
          </div>

          {error && <p className="text-xs text-red-400 font-bold">Incorreto! Tente "admin123" e OTP "123456".</p>}

          <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-extrabold text-xs">
            Acessar Torre de Controle
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// HEADER
// ============================================================================
const AppHeader: React.FC<{ onOpenAdminAuth: () => void }> = ({ onOpenAdminAuth }) => {
  const { selectedCity, setSelectedCity, userProfile, setRegisterModalOpen, rainFeeActive, cityPauseActive } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-fuchsia-400 text-xs">
                IE
              </div>
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight text-white leading-none">
                Ibiapaba<span className="text-fuchsia-500">Express</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Super App Regional</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:border-fuchsia-500 transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-[11px]">Perfil</span>
            </button>

            <button onClick={onOpenAdminAuth} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs text-cyan-400 font-bold">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as CidadeIbiapaba)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none"
            >
              {CIDADES_IBIAPABA.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
              ))}
            </select>
          </div>

          {cityPauseActive[selectedCity] ? (
            <span className="px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black">
              ⛔ Operação Pausada na Cidade
            </span>
          ) : rainFeeActive[selectedCity] ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black animate-pulse">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Taxa Chuva Ativa (+R$ 3,00)</span>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// PAINEL ADMINCONTROL PRO (TORRE DE CONTROLE & GESTÃO)
// ============================================================================
const MasterAdminDashboard: React.FC = () => {
  const { orders, logoutAdmin, rainFeeActive, toggleRainFee, cityPauseActive, toggleCityPause } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 space-y-5 pb-24">
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-base text-white">AdminControl Pro</h1>
            <p className="text-xs text-slate-400">Torre Reservada de Operações</p>
          </div>
        </div>

        <button onClick={logoutAdmin} className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800/50">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
        <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-400" /> Pausa de Emergência & Clima por Cidade
        </h3>

        <div className="space-y-2">
          {CIDADES_IBIAPABA.map((cidade) => (
            <div key={cidade} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">{cidade}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRainFee(cidade)}
                  className={`px-2.5 py-1 rounded-xl font-black text-[10px] ${rainFeeActive[cidade] ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                >
                  🌧️ Chuva
                </button>
                <button
                  onClick={() => toggleCityPause(cidade)}
                  className={`px-2.5 py-1 rounded-xl font-black text-[10px] ${cityPauseActive[cidade] ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                >
                  ⛔ Pausar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VISÃO DO CLIENTE (COM LEILÃO DE COTAÇÕES VIVO)
// ============================================================================
const CustomerView: React.FC = () => {
  const { setCartCount, quotes, addQuote, acceptBid, orders } = useApp();
  const [activeTab, setActiveTab] = useState<'lojas' | 'cotacoes' | 'pedidos'>('lojas');

  const [serviceInput, setServiceInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceInput) return;
    addQuote(serviceInput, descInput);
    setServiceInput('');
    setDescInput('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Abas */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-black">
        <button onClick={() => setActiveTab('lojas')} className={`py-2 rounded-xl ${activeTab === 'lojas' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}>
          Lojas & Peças
        </button>
        <button onClick={() => setActiveTab('cotacoes')} className={`py-2 rounded-xl ${activeTab === 'cotacoes' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}>
          Leilão Cotação ({quotes.length})
        </button>
        <button onClick={() => setActiveTab('pedidos')} className={`py-2 rounded-xl ${activeTab === 'pedidos' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}>
          Acompanhar ({orders.length})
        </button>
      </div>

      {activeTab === 'lojas' && (
        <div className="space-y-3">
          <div className="bg-slate-900 rounded-3xl p-3.5 border border-slate-800 shadow-xl flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80" alt="Oficina" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs text-white truncate">AutoPeças & Mecânica Tianguá</h4>
              <p className="text-[11px] text-slate-400">Mecânica, Óleo & Peças</p>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400 mt-1 font-bold">
                <Star className="w-3 h-3 fill-amber-400" /> 4.9 • 20-30 min
              </div>
            </div>
            <button onClick={() => setCartCount((prev) => prev + 1)} className="p-2.5 rounded-2xl bg-violet-600 text-white font-bold">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'cotacoes' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateQuote} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-fuchsia-400" /> Criar Cotação para Leilão
            </h4>
            <input
              type="text"
              placeholder="Ex: Troca de Kit Transmissão Bros 160"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              required
            />
            <textarea
              placeholder="Detalhes ou ano do veículo..."
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              rows={2}
            />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs">
              Disparar Cotação no Leilão
            </button>
          </form>

          {/* Cotações Ativas com Propostas das Oficinas */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Suas Cotações em Andamento</h4>
            {quotes.map((q) => (
              <div key={q.id} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{q.id} - {q.service}</span>
                  <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-bold text-[9px]">
                    {q.status} ({q.bids.length} Lances)
                  </span>
                </div>
                <p className="text-slate-400">{q.description}</p>

                {/* Lista de Lances de Oficinas */}
                {q.bids.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="font-extrabold text-emerald-400 text-[10px]">Propostas Recebidas:</p>
                    {q.bids.map((bid) => (
                      <div key={bid.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{bid.storeName}</p>
                          <p className="text-[10px] text-slate-400">Garantia: {bid.warranty} • Tempo: {bid.estimatedTime}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-black text-emerald-400 text-sm">R$ {bid.price.toFixed(2)}</p>
                          <button
                            onClick={() => acceptBid(q.id, bid)}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-lg"
                          >
                            Aceitar Proposta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pedidos' && (
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Seus Pedidos em Andamento</h4>
          {orders.map((o) => (
            <div key={o.id} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-white text-sm">{o.id} - {o.store}</p>
                  <p className="text-slate-400">{o.type} • R$ {o.price.toFixed(2)}</p>
                </div>
                <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-black rounded-full text-[10px]">
                  {o.status}
                </span>
              </div>

              {/* Componente Rastreamento GPS ao vivo */}
              <LiveGpsTracker order={o} />

              <div className="p-2.5 bg-slate-950 rounded-xl text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SEU PIN DE CONFIRMAÇÃO DE ENTREGA:</span>
                <span className="font-mono text-base font-black text-fuchsia-400 tracking-widest">{o.pinCode}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// VISÃO DA EMPRESA / OFICINA (DAR LANCES NAS COTAÇÕES)
// ============================================================================
const MerchantView: React.FC = () => {
  const { quotes, submitBid, userProfile } = useApp();
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  const [priceInput, setPriceInput] = useState('');
  const [warrantyInput, setWarrantyInput] = useState('3 Meses');
  const [timeInput, setTimeInput] = useState('30 min');

  const handleSendBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteId || !priceInput) return;

    const storeName = userProfile?.companyName || 'AutoPeças & Mecânica Serra';
    submitBid(selectedQuoteId, storeName, parseFloat(priceInput), warrantyInput, timeInput);
    setSelectedQuoteId(null);
    setPriceInput('');
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-slate-900 p-4 rounded-3xl border border-indigo-500/30 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm">
          <Building2 className="w-5 h-5" />
          <span>Painel de Lances do Lojista</span>
        </div>
        <p className="text-xs text-slate-400">Envie propostas de preços diretamente para as cotações dos clientes.</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Cotações Abertas na Serra</h4>
        {quotes.map((q) => (
          <div key={q.id} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">{q.id} - {q.service}</span>
              <span className="text-cyan-400 font-bold">{q.city}</span>
            </div>
            <p className="text-slate-400">{q.description}</p>

            <button
              onClick={() => setSelectedQuoteId(q.id)}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-xs rounded-xl"
            >
              Dar Lance / Enviar Proposta
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Envio de Lance */}
      {selectedQuoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs">Enviar Proposta ({selectedQuoteId})</span>
              <button onClick={() => setSelectedQuoteId(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBid} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Valor do Serviço / Peça (R$):</label>
                <input
                  type="number"
                  placeholder="Ex: 190.00"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Garantia:</label>
                  <input
                    type="text"
                    value={warrantyInput}
                    onChange={(e) => setWarrantyInput(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Prazo Estimado:</label>
                  <input
                    type="text"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl">
                Confirmar Lance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// VISÃO DO ENTREGADOR (VALIÇÃO DE PIN DE ENTREGA)
// ============================================================================
const CourierView: React.FC = () => {
  const { orders, showToast } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [activeOrder, setActiveOrder] = useState<OrderItem | null>(orders[0] || null);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrder && pinInput === activeOrder.pinCode) {
      showToast('🎉 PIN VÁLIDO! Entrega concluída e valor creditado.');
      setPinInput('');
      setActiveOrder(null);
    } else {
      showToast('❌ PIN Incorreto! Peça o código ao cliente.');
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-slate-900 p-4 rounded-3xl border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
          <Bike className="w-5 h-5" />
          <span>Painel do Entregador Credenciado</span>
        </div>
        <p className="text-xs text-slate-400">Valide o PIN do cliente ao finalizar a corrida no destino.</p>
      </div>

      {activeOrder ? (
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-extrabold text-white">{activeOrder.id} - {activeOrder.customer}</span>
            <span className="text-amber-400 font-bold">{activeOrder.city}</span>
          </div>

          <form onSubmit={handleValidate} className="space-y-2">
            <label className="text-[11px] text-slate-400 block font-bold">Digite o PIN do Cliente:</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="4 dígitos"
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono font-bold text-amber-400 text-sm"
                required
              />
              <button type="submit" className="px-4 bg-amber-500 text-black font-black text-xs rounded-xl">
                Validar PIN
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="text-center text-xs text-slate-500 py-6">Nenhuma corrida pendente no momento.</p>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const MainContent: React.FC = () => {
  const { role, setRole, isAdminAuthenticated } = useApp();
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);

  if (role === 'admin' && isAdminAuthenticated) {
    return <MasterAdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NotificationToast />
      <AppHeader onOpenAdminAuth={() => setAdminAuthOpen(true)} />

      <main className="flex-1 max-w-md w-full mx-auto p-4">
        {role === 'cliente' && <CustomerView />}
        {role === 'comercio' && <MerchantView />}
        {role === 'entregador' && <CourierView />}
      </main>

      {/* Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-6 py-2.5 flex items-center justify-between z-40">
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
          <Building2 className="w-5 h-5" />
          <span>Empresa</span>
        </button>

        <button
          onClick={() => setRole('entregador')}
          className={`flex flex-col items-center gap-1 text-[10px] font-extrabold ${role === 'entregador' ? 'text-amber-400' : 'text-slate-500'}`}
        >
          <Bike className="w-5 h-5" />
          <span>Entregador</span>
        </button>
      </nav>

      <ProfileRegisterModal />
      <AdminAuthModal isOpen={adminAuthOpen} onClose={() => setAdminAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
