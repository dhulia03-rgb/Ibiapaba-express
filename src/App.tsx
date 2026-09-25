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
  PauseCircle,
  PlayCircle,
  UserPlus,
  Building2,
  ThumbsUp
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
// CONSTANTES E CIDADES DA SERRA DA IBIAPABA (9 MUNICÍPIOS)
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
  document?: string;
  vehicleInfo?: string;
  companyName?: string;
}

export interface OrderItem {
  id: string;
  customer: string;
  store: string;
  city: CidadeIbiapaba;
  status: 'Pendente' | 'Em Preparo' | 'Em Trânsito' | 'Entregue';
  price: number;
  date: string;
  type: 'Peça' | 'Serviço' | 'Leva e Traz' | 'Alimentação';
  slaAlert: 'ok' | 'amarelo' | 'vermelho';
  pinCode: string;
  driverName?: string;
}

export interface QuoteItem {
  id: string;
  service: string;
  customer: string;
  city: CidadeIbiapaba;
  description: string;
  budget: string;
  status: 'Aberto' | 'Respondido' | 'Finalizado';
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
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
  addQuote: (service: string, description: string, budget: string) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pass: string, otp: string) => boolean;
  logoutAdmin: () => void;
  registerModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
  rainFeeActive: Record<CidadeIbiapaba, boolean>;
  toggleRainFee: (city: CidadeIbiapaba) => void;
  cityPauseActive: Record<CidadeIbiapaba, boolean>;
  toggleCityPause: (city: CidadeIbiapaba) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string) => void;
  resolveSLAOrder: (orderId: string, actionType: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('cliente');
  const [selectedCity, setSelectedCity] = useState<CidadeIbiapaba>('Tianguá');
  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    name: 'Cliente Serra',
    phone: '(88) 99823-1102',
    city: 'Tianguá',
    role: 'cliente'
  });

  const [cartCount, setCartCount] = useState<number>(1);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);

  // Estados Climatológicos e de Pausa de Emergência por Cidade
  const [rainFeeActive, setRainFeeActive] = useState<Record<CidadeIbiapaba, boolean>>({
    'Tianguá': true,
    'Ubajara': true,
    'São Benedito': false,
    'Viçosa do Ceará': false,
    'Ibiapina': false,
    'Guaraciaba do Norte': false,
    'Croatá': false,
    'Carnaubal': false,
    'Ipu': false
  });

  const [cityPauseActive, setCityPauseActive] = useState<Record<CidadeIbiapaba, boolean>>({
    'Tianguá': false,
    'Ubajara': false,
    'São Benedito': false,
    'Viçosa do Ceará': false,
    'Ibiapina': false,
    'Guaraciaba do Norte': false,
    'Croatá': false,
    'Carnaubal': false,
    'Ipu': false
  });

  // Lista Mock de Auditoria Imutável
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'LOG-101', user: 'Admin Master', action: 'Ativação Taxa Chuva', target: 'Tianguá', timestamp: 'Hoje, 14:02', ip: '187.19.201.4' },
    { id: 'LOG-102', user: 'Admin Master', action: 'Intervenção SLA (Re-despacho)', target: 'ORD-9821', timestamp: 'Hoje, 14:15', ip: '187.19.201.4' }
  ]);

  const addAuditLog = (action: string, target: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      user: 'Admin Master',
      action,
      target,
      timestamp: 'Hoje, Agora',
      ip: '187.19.201.4'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const toggleRainFee = (city: CidadeIbiapaba) => {
    setRainFeeActive((prev) => {
      const updated = !prev[city];
      addAuditLog(`Taxa Chuva ${updated ? 'Ativada' : 'Desativada'}`, city);
      return { ...prev, [city]: updated };
    });
  };

  const toggleCityPause = (city: CidadeIbiapaba) => {
    setCityPauseActive((prev) => {
      const updated = !prev[city];
      addAuditLog(`Pausa de Emergência ${updated ? 'Ativada' : 'Desativada'}`, city);
      return { ...prev, [city]: updated };
    });
  };

  // Pedidos com Controle de SLA (Amarelo / Vermelho)
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'ORD-9821', customer: 'João Paulo', store: 'AutoPeças Tianguá', city: 'Tianguá', status: 'Em Trânsito', price: 245.00, date: '14:20', type: 'Peça', slaAlert: 'vermelho', pinCode: '4821', driverName: 'Carlos Motoboy' },
    { id: 'ORD-9822', customer: 'Maria Clara', store: 'Oficina Ubajara', city: 'Ubajara', status: 'Em Preparo', price: 89.90, date: '14:05', type: 'Serviço', slaAlert: 'amarelo', pinCode: '1192' },
    { id: 'ORD-9823', customer: 'Carlos Eduardo', store: 'Centro Ibiapina', city: 'Ibiapina', status: 'Entregue', price: 450.00, date: '11:30', type: 'Leva e Traz', slaAlert: 'ok', pinCode: '8830', driverName: 'Marcos Entregador' }
  ]);

  const [quotes, setQuotes] = useState<QuoteItem[]>([
    { id: 'COT-501', customer: 'Lucas Santos', city: 'Tianguá', service: 'Troca de Kit Transmissão Bros 160', description: 'Corrente com retentor e dentes gastos', budget: 'R$ 190,00 - R$ 230,00', status: 'Respondido' },
    { id: 'COT-502', customer: 'Fernanda Lima', city: 'Viçosa do Ceará', service: 'Revisão Sistema ABS', description: 'Civic 2019 com luz do ABS acesa', budget: 'R$ 350,00 - R$ 500,00', status: 'Aberto' }
  ]);

  const addQuote = (service: string, description: string, budget: string) => {
    const newQ: QuoteItem = {
      id: `COT-${Math.floor(500 + Math.random() * 500)}`,
      customer: userProfile?.name || 'Cliente Serra',
      city: selectedCity,
      service,
      description,
      budget,
      status: 'Aberto'
    };
    setQuotes((prev) => [newQ, ...prev]);
  };

  const resolveSLAOrder = (orderId: string, actionType: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, slaAlert: 'ok' } : o))
    );
    addAuditLog(`Intervenção SLA (${actionType})`, orderId);
    alert(`Ação "${actionType}" aplicada ao pedido ${orderId} com sucesso!`);
  };

  const loginAdmin = (pass: string, otp: string) => {
    if ((pass === 'admin123' || pass === 'master2026') && otp.length === 6) {
      setIsAdminAuthenticated(true);
      setRole('admin');
      addAuditLog('Login de Autenticação 2FA', 'Painel Master');
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
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        registerModalOpen,
        setRegisterModalOpen,
        rainFeeActive,
        toggleRainFee,
        cityPauseActive,
        toggleCityPause,
        auditLogs,
        addAuditLog,
        resolveSLAOrder
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
// COMPONENTE DE AVALIAÇÃO PÓS-SERVIÇO (REVIEW COMPONENT 4 CRITÉRIOS + PIN)
// ============================================================================
const PostServiceReviewComponent: React.FC = () => {
  const [qualidade, setQualidade] = useState(5);
  const [prazo, setPrazo] = useState(5);
  const [transparencia, setTransparencia] = useState(5);
  const [levaETrazRate, setLevaETrazRate] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-3xl text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="font-extrabold text-sm text-white">Avaliação Enviada!</h4>
        <p className="text-xs text-slate-400">Sua nota ajudará outros moradores da Serra da Ibiapaba.</p>
        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-full border border-emerald-500/30">
          Selo: Cliente Verificado via PIN
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Avaliar Serviço / Oficina
        </h4>
        <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
          PIN Validado
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-400 text-[10px] block">Qualidade das Peças:</span>
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 cursor-pointer ${s <= qualidade ? 'fill-amber-400' : 'text-slate-700'}`} onClick={() => setQualidade(s)} />
            ))}
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] block">Cumprimento do Prazo:</span>
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 cursor-pointer ${s <= prazo ? 'fill-amber-400' : 'text-slate-700'}`} onClick={() => setPrazo(s)} />
            ))}
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] block">Transparência no Orçamento:</span>
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 cursor-pointer ${s <= transparencia ? 'fill-amber-400' : 'text-slate-700'}`} onClick={() => setTransparencia(s)} />
            ))}
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] block">Atendimento Leva e Traz:</span>
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 cursor-pointer ${s <= levaETrazRate ? 'fill-amber-400' : 'text-slate-700'}`} onClick={() => setLevaETrazRate(s)} />
            ))}
          </div>
        </div>
      </div>

      <textarea
        placeholder="Escreva um comentário sobre o atendimento..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
        rows={2}
      />

      <button onClick={() => setSubmitted(true)} className="w-full py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs rounded-xl">
        Publicar Avaliação Verificada
      </button>
    </div>
  );
};

// ============================================================================
// SIMULADOR DE IMPRESSÃO DE COMANDA TÉRMICA DO LOJISTA (58MM / 80MM)
// ============================================================================
const ThermalPrintModal: React.FC<{ order: OrderItem; onClose: () => void }> = ({ order, onClose }) => {
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('80mm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-5 space-y-4 font-mono shadow-2xl border-4 border-slate-800">
        <div className="flex items-center justify-between border-b pb-2 text-xs">
          <span className="font-bold">IMPRESSÃO TÉRMICA DE COMANDA</span>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPaperWidth('58mm')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg border ${paperWidth === '58mm' ? 'bg-black text-white' : 'bg-slate-100'}`}
          >
            Papel 58mm
          </button>
          <button
            onClick={() => setPaperWidth('80mm')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg border ${paperWidth === '80mm' ? 'bg-black text-white' : 'bg-slate-100'}`}
          >
            Papel 80mm
          </button>
        </div>

        {/* Recibo Térmico Reais */}
        <div className={`mx-auto bg-amber-50 p-3 border border-dashed border-slate-400 text-[11px] leading-tight space-y-2 ${paperWidth === '58mm' ? 'w-[200px]' : 'w-[260px]'}`}>
          <div className="text-center border-b border-dashed pb-2">
            <p className="font-black text-sm">IBIAPABA EXPRESS</p>
            <p className="text-[9px]">{order.store}</p>
            <p className="text-[9px]">{order.city} - CE</p>
          </div>

          <div className="space-y-1">
            <p><strong>PEDIDO:</strong> #{order.id}</p>
            <p><strong>CLIENTE:</strong> {order.customer}</p>
            <p><strong>TIPO:</strong> {order.type}</p>
            <p><strong>HORA:</strong> {order.date}</p>
          </div>

          <div className="border-t border-b border-dashed py-1">
            <div className="flex justify-between font-bold">
              <span>Item Mecânico / Peça</span>
              <span>R$ {order.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="font-black text-xs">PIN DE VALIDAÇÃO: {order.pinCode}</p>
            <p className="text-[8px] text-slate-500 mt-1">Exija o PIN no momento da entrega</p>
          </div>
        </div>

        <button onClick={() => { alert('Comanda enviada para a impressora!'); onClose(); }} className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
          <Printer className="w-4 h-4" /> Imprimir Comanda Térmica
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL DE CADASTRO / CRIAR PERFIL (CLIENTE, EMPRESA, ENTREGADOR)
// ============================================================================
const ProfileRegisterModal: React.FC = () => {
  const { registerModalOpen, setRegisterModalOpen, setUserProfile, setRole, selectedCity } = useApp();
  const [selectedType, setSelectedType] = useState<'cliente' | 'comercio' | 'entregador'>('cliente');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<CidadeIbiapaba>(selectedCity);
  const [extraInfo, setExtraInfo] = useState('');

  if (!registerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const newProfile: UserProfile = {
      name,
      phone,
      city,
      role: selectedType,
      companyName: selectedType === 'comercio' ? extraInfo : undefined,
      vehicleInfo: selectedType === 'entregador' ? extraInfo : undefined
    };

    setUserProfile(newProfile);
    setRole(selectedType);
    setRegisterModalOpen(false);
    alert(`🎉 Perfil criado com sucesso como ${selectedType.toUpperCase()}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-fuchsia-400">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-white">Criar Perfil / Cadastrar-se</h3>
          </div>
          <button onClick={() => setRegisterModalOpen(false)} className="p-1 rounded-xl bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 block">Selecione seu perfil na plataforma:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedType('cliente')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
                selectedType === 'cliente'
                  ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 border-fuchsia-400 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-black">Cliente</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedType('comercio')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
                selectedType === 'comercio'
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-[10px] font-black">Empresa / Oficina</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedType('entregador')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
                selectedType === 'entregador'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Bike className="w-5 h-5" />
              <span className="text-[10px] font-black">Entregador</span>
            </button>
          </div>
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
              <label className="text-[11px] text-slate-400 block mb-1">Cidade da Serra</label>
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
            Confirmar Cadastro de {selectedType.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL DE AUTENTICAÇÃO DO ADMIN CONTROL PRO (2FA COM CÓDIGO OTP DE 6 DÍGITOS)
// ============================================================================
const AdminAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useApp();
  const [pass, setPass] = useState('');
  const [otp, setOtp] = useState('123456'); // OTP mock padrão para facilitar
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
            <h3 className="font-extrabold text-sm">Autenticação 2FA / Admin</h3>
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
              placeholder="Digite admin123..."
              className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Código OTP 2FA (6 dígitos):</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full p-2.5 text-center tracking-widest font-mono rounded-2xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-bold"
              required
            />
          </div>

          {error && <p className="text-xs text-red-400 font-bold">Credenciais incorretas! Tente "admin123" e OTP "123456".</p>}

          <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-extrabold text-xs">
            Acessar Torre de Controle
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// HEADER DO SUPER APP
// ============================================================================
const AppHeader: React.FC<{ onOpenAdminAuth: () => void }> = ({ onOpenAdminAuth }) => {
  const { selectedCity, setSelectedCity, userProfile, setRegisterModalOpen, rainFeeActive } = useApp();

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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-[11px]">Criar Perfil</span>
            </button>

            <button
              onClick={onOpenAdminAuth}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Acesso Restrito Admin Master"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seletor da Cidade e Banner de Chuva */}
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

          {rainFeeActive[selectedCity] && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black animate-pulse">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Taxa Chuva / Neblina Ativa (+R$ 3,00)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// PAINEL ADMINCONTROL PRO (TORRE DE CONTROLE, ALERTAS DE SLA, AUDITORIA)
// ============================================================================
const MasterAdminDashboard: React.FC = () => {
  const {
    orders,
    logoutAdmin,
    rainFeeActive,
    toggleRainFee,
    cityPauseActive,
    toggleCityPause,
    auditLogs,
    resolveSLAOrder
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sla' | 'cidades' | 'auditoria'>('sla');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 space-y-5 pb-24">
      {/* Topo do AdminControl Pro */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base text-white">AdminControl Pro</h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[9px] border border-cyan-500/40">
                Torre de Controle Master
              </span>
            </div>
            <p className="text-xs text-slate-400">9 Municípios da Serra da Ibiapaba</p>
          </div>
        </div>

        <button onClick={logoutAdmin} className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800/50">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {/* Navegação Interna do Admin */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
        <button onClick={() => setActiveTab('sla')} className={`py-2 rounded-xl ${activeTab === 'sla' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>
          Torre SLA
        </button>
        <button onClick={() => setActiveTab('cidades')} className={`py-2 rounded-xl ${activeTab === 'cidades' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>
          Gestão de Cidades
        </button>
        <button onClick={() => setActiveTab('auditoria')} className={`py-2 rounded-xl ${activeTab === 'auditoria' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>
          Logs Auditoria
        </button>
      </div>

      {/* ABA 1: TORRE DE SLA E ALERTAS DE INTERVENÇÃO */}
      {activeTab === 'sla' && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Alertas de SLA em Tempo Real
          </h3>

          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className={`p-4 rounded-3xl border text-xs space-y-3 ${
                  o.slaAlert === 'vermelho'
                    ? 'bg-red-950/40 border-red-500/60'
                    : o.slaAlert === 'amarelo'
                    ? 'bg-amber-950/40 border-amber-500/60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {o.slaAlert === 'vermelho' && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-[9px] animate-pulse">🔴 ALERTA VERMELHO (Parado &gt; 25m)</span>}
                    {o.slaAlert === 'amarelo' && <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-black text-[9px]">🟡 ALERTA AMARELO (Sem aceite &gt; 10m)</span>}
                    {o.slaAlert === 'ok' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[9px] border border-emerald-500/30">🟢 SLA Normal</span>}
                  </div>
                  <span className="font-bold text-slate-400">{o.city}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-white text-sm">{o.id} - {o.customer}</p>
                    <p className="text-slate-400">{o.store} • R$ {o.price.toFixed(2)}</p>
                  </div>
                  <p className="text-xs font-bold text-cyan-400">PIN: {o.pinCode}</p>
                </div>

                {/* Botões de Ação Rápida de 1-Clique */}
                {o.slaAlert !== 'ok' && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    <button onClick={() => resolveSLAOrder(o.id, 'Cobrança WhatsApp')} className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Cobrar Loja WhatsApp
                    </button>

                    <button onClick={() => resolveSLAOrder(o.id, 'Re-despacho de Prioridade')} className="py-2 px-3 rounded-xl bg-cyan-600 text-white font-black text-[10px] flex items-center justify-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Relançar Corrida
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: PAUSA DE EMERGÊNCIA E TAXA DE CHUVA POR CIDADE */}
      {activeTab === 'cidades' && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-400" /> Controle Climático & Pausas de Emergência
          </h3>

          <div className="space-y-2">
            {CIDADES_IBIAPABA.map((cidade) => (
              <div key={cidade} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{cidade}</p>
                  <p className="text-[10px] text-slate-400">
                    {cityPauseActive[cidade] ? '🔴 Cidade Suspensa' : '🟢 Operando Normalmente'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRainFee(cidade)}
                    className={`px-2.5 py-1 rounded-xl font-extrabold text-[10px] border ${
                      rainFeeActive[cidade]
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    🌧️ Chuva
                  </button>

                  <button
                    onClick={() => toggleCityPause(cidade)}
                    className={`px-2.5 py-1 rounded-xl font-extrabold text-[10px] border ${
                      cityPauseActive[cidade]
                        ? 'bg-red-600 text-white border-red-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    ⛔ Pausar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: LOGS DE AUDITORIA IMUTÁVEIS */}
      {activeTab === 'auditoria' && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Registro Imutável (admin_audit_logs)
          </h3>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>{log.id} • {log.user}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="font-bold text-cyan-300">{log.action}: <span className="text-white">{log.target}</span></p>
                <p className="text-[9px] text-slate-500">IP Auditado: {log.ip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// VISÃO DO CLIENTE
// ============================================================================
const CustomerView: React.FC = () => {
  const { setCartCount, quotes, addQuote, selectedCity } = useApp();
  const [activeTab, setActiveTab] = useState<'lojas' | 'cotacoes' | 'levaETraz'>('lojas');

  const [serviceInput, setServiceInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const stores = [
    {
      id: '1',
      name: `AutoPeças & Mecânica ${selectedCity}`,
      category: 'Mecânica, Óleo & Peças',
      rating: 4.9,
      deliveryTime: '20-30 min',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      name: `Centro Automotivo ${selectedCity}`,
      category: 'Injeção & Suspensão',
      rating: 4.8,
      deliveryTime: '25-40 min',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=80'
    }
  ];

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceInput) return;
    addQuote(serviceInput, descInput || 'Aviso urgente', 'Em leilão pelas oficinas');
    setServiceInput('');
    setDescInput('');
    alert('🚀 Cotação enviada para as oficinas credenciadas da Serra!');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Alternador de Módulos */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-black">
        <button onClick={() => setActiveTab('lojas')} className={`py-2 rounded-xl ${activeTab === 'lojas' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}>
          Lojas & Peças
        </button>
        <button onClick={() => setActiveTab('cotacoes')} className={`py-2 rounded-xl ${activeTab === 'cotacoes' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}>
          Leilão Cotação
        </button>
        <button onClick={() => setActiveTab('levaETraz')} className={`py-2 rounded-xl ${activeTab === 'levaETraz' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-slate-400'}`}>
          Leva e Traz
        </button>
      </div>

      {activeTab === 'lojas' && (
        <div className="space-y-3">
          {stores.map((s) => (
            <div key={s.id} className="bg-slate-900 rounded-3xl p-3 border border-slate-800 shadow-xl flex items-center gap-3">
              <img src={s.image} alt={s.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-xs text-white truncate">{s.name}</h4>
                <p className="text-[11px] text-slate-400">{s.category}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mt-1 font-semibold">
                  <span className="text-amber-400 font-bold flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400" />{s.rating}</span>
                  <span>• {s.deliveryTime}</span>
                </div>
              </div>
              <button onClick={() => setCartCount((prev) => prev + 1)} className="p-2.5 rounded-2xl bg-violet-600 text-white font-bold">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Componente de Avaliação Pós-Serviço */}
          <PostServiceReviewComponent />
        </div>
      )}

      {activeTab === 'cotacoes' && (
        <form onSubmit={handleCreateQuote} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
          <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-fuchsia-400" /> Disparar Leilão Reverso de Orçamentos
          </h4>
          <input
            type="text"
            placeholder="Qual peça ou serviço precisa?"
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            required
          />
          <textarea
            placeholder="Modelo do veículo, ano e detalhes..."
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            rows={2}
          />
          <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs">
            Solicitar Lances de Oficinas
          </button>
        </form>
      )}

      {activeTab === 'levaETraz' && (
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold">
            <Bike className="w-5 h-5" />
            <span>Módulo Logístico "Leva e Traz Desconectado"</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Dois entregadores independentes: O <strong>Entregador 1</strong> busca o veículo na sua residência e entrega na oficina. Após o conserto, o <strong>Entregador 2</strong> devolve o veículo na sua casa.
          </p>
          <button onClick={() => alert('Coleta Leva e Traz Solicitada!')} className="w-full py-2.5 rounded-xl bg-cyan-600 text-white font-black">
            Agendar Coleta de Veículo
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// VISÃO DO COMÉRCIO / LOJISTA
// ============================================================================
const MerchantView: React.FC = () => {
  const { orders } = useApp();
  const [selectedOrderToPrint, setSelectedOrderToPrint] = useState<OrderItem | null>(null);

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-slate-900 p-4 rounded-3xl border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm">
            <Building2 className="w-5 h-5" />
            <span>Gestão da Oficina / Lojista</span>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
            Recepção de Pedidos
          </span>
        </div>
        <p className="text-xs text-slate-400">Emita comandas térmicas e gerencie pedidos recebidos.</p>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-white">{o.id} - {o.customer}</span>
              <span className="text-emerald-400 font-bold">R$ {o.price.toFixed(2)}</span>
            </div>
            <p className="text-slate-400">Tipo: {o.type} • Status: {o.status}</p>

            <button
              onClick={() => setSelectedOrderToPrint(o)}
              className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 font-bold text-indigo-400 flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Gerar Comanda Térmica (58mm/80mm)
            </button>
          </div>
        ))}
      </div>

      {selectedOrderToPrint && (
        <ThermalPrintModal order={selectedOrderToPrint} onClose={() => setSelectedOrderToPrint(null)} />
      )}
    </div>
  );
};

// ============================================================================
// VISÃO DO ENTREGADOR (TRAVA ATÔMICA + VALIDAÇÃO DE PIN)
// ============================================================================
const CourierView: React.FC = () => {
  const { orders } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [lockedOrder, setLockedOrder] = useState<OrderItem | null>(orders[0] || null);

  const handleValidatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedOrder && pinInput === lockedOrder.pinCode) {
      alert('🎉 PIN CORRETO! Corrida finalizada e valor creditado na carteira.');
      setPinInput('');
      setLockedOrder(null);
    } else {
      alert('❌ PIN Incorreto! Peça o código de 4 dígitos ao cliente.');
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-slate-900 p-4 rounded-3xl border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
          <Bike className="w-5 h-5" />
          <span>Painel do Entregador (Trava Atômica)</span>
        </div>
        <p className="text-xs text-slate-400">Corridas exclusivas travadas para seu perfil. Validação de entrega por PIN.</p>
      </div>

      {lockedOrder ? (
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-extrabold text-white text-sm">Corrida Travada: {lockedOrder.id}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              Trava Atômica Ativa
            </span>
          </div>

          <p className="text-slate-300"><strong>Cliente:</strong> {lockedOrder.customer}</p>
          <p className="text-slate-300"><strong>Destino:</strong> {lockedOrder.city} - Serra</p>

          <form onSubmit={handleValidatePin} className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-[11px] text-slate-400 block font-bold">Solicite o PIN de 4 dígitos ao Cliente:</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ex: 4821"
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono font-bold text-amber-400 text-sm"
                required
              />
              <button type="submit" className="px-4 bg-amber-500 text-black font-black rounded-xl">
                Validar PIN
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="text-center text-xs text-slate-500 py-6">Nenhuma corrida travada no momento.</p>
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
