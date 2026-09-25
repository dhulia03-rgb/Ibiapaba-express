import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  DollarSign,
  Package,
  Bike,
  Store as StoreIcon,
  Phone,
  RotateCcw,
  CloudRain,
  Lock,
  LogOut,
  RefreshCw,
  X,
  Database,
  Star,
  ShoppingBag,
  Wrench,
  Send,
  Home,
  User
} from 'lucide-react';

// ============================================================================
// 1. SUPABASE CLIENT & CONFIGURAÇÃO INLINE
// ============================================================================
export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// ============================================================================
// 2. TIPOS E MODELOS DE DADOS DA SERRA DA IBIAPABA (CE)
// ============================================================================
export type CityIbiapaba =
  | 'Tianguá'
  | 'Ubajara'
  | 'São Benedito'
  | 'Viçosa do Ceará'
  | 'Ibiapina'
  | 'Guaraciaba do Norte'
  | 'Carnaubal'
  | 'Croatá'
  | 'Ipu';

export type UserRole = 'cliente' | 'comercio' | 'entregador' | 'admin';

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  ip: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'ops_admin';
  token: string;
  twoFactorVerified: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  storeId: string;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  city: CityIbiapaba;
  neighborhood: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  deliveryFee: number;
  rainFee: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'em_entrega' | 'entregue' | 'cancelado';
  courierId?: string;
  courierName?: string;
  courierPhone?: string;
  courierStaticMinutes?: number;
  createdAt: string;
  minutesInCurrentStatus: number;
  slaAlert?: 'amarelo' | 'vermelho' | null;
  slaReason?: string;
  paymentMethod: 'pix' | 'cartao' | 'dinheiro';
  review?: {
    stars: number;
    speedRating: string;
    priceFairness: string;
    mechanicCare: string;
    comment: string;
    createdAt: string;
  };
}

export interface Store {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  city: CityIbiapaba;
  category: 'Oficina' | 'Restaurante' | 'Farmácia' | 'Supermercado';
  rating: number;
  status: 'ativo' | 'pendente' | 'bloqueado';
  emergencyPaused: boolean;
  totalOrders: number;
  balance: number;
  isOpen: boolean;
}

export interface CourierPartner {
  id: string;
  name: string;
  phone: string;
  city: CityIbiapaba;
  vehicle: 'Moto' | 'Bicicleta' | 'Carro';
  plate?: string;
  rating: number;
  status: 'ativo' | 'pendente' | 'bloqueado';
  isOnline: boolean;
  activeDeliveries: number;
  totalDeliveries: number;
  balance: number;
}

export interface CityConfig {
  city: CityIbiapaba;
  rainFeeActive: boolean;
  rainFeeAmount: number;
  emergencyPaused: boolean;
  activeOrdersCount: number;
  couriersOnlineCount: number;
}

export const CITIES_IBIAPABA: CityIbiapaba[] = [
  'Tianguá',
  'Ubajara',
  'São Benedito',
  'Viçosa do Ceará',
  'Ibiapina',
  'Guaraciaba do Norte',
  'Carnaubal',
  'Croatá',
  'Ipu',
];

const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Auto Mecânica Serrana & Peças',
    ownerName: 'Cláudio Albuquerque',
    phone: '88997213455',
    city: 'Tianguá',
    category: 'Oficina',
    rating: 4.9,
    status: 'ativo',
    emergencyPaused: false,
    totalOrders: 312,
    balance: 4890.5,
    isOpen: true,
  },
  {
    id: 'store-2',
    name: 'Churrascaria Serra Grill',
    ownerName: 'Marcelo Pires',
    phone: '88998124433',
    city: 'Ubajara',
    category: 'Restaurante',
    rating: 4.8,
    status: 'ativo',
    emergencyPaused: false,
    totalOrders: 480,
    balance: 7420.0,
    isOpen: true,
  },
  {
    id: 'store-3',
    name: 'Drogaria do Povo Ibiapaba',
    ownerName: 'Carla Vasconcelos',
    phone: '88988341122',
    city: 'São Benedito',
    category: 'Farmácia',
    rating: 4.7,
    status: 'ativo',
    emergencyPaused: false,
    totalOrders: 195,
    balance: 2310.0,
    isOpen: true,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    storeId: 'store-1',
    name: 'Troca de Óleo Sintético 5W30',
    description: 'Com revisão de 21 itens de segurança.',
    price: 180.0,
    category: 'Serviços',
  },
  {
    id: 'prod-2',
    storeId: 'store-1',
    name: 'Pastilha de Freio Dianteira Cerâmica',
    description: 'Segurança em descidas e curvas da serra.',
    price: 145.0,
    category: 'Peças',
  },
  {
    id: 'prod-3',
    storeId: 'store-2',
    name: 'Picanha na Brasa (2 Pessoas)',
    description: 'Acompanha arroz biro-biro e feijão tropeiro.',
    price: 89.9,
    category: 'Refeições',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'PED-9481',
    storeId: 'store-1',
    storeName: 'Auto Mecânica Serrana & Peças',
    customerName: 'Antônio Ferreira',
    customerPhone: '88996551122',
    city: 'Tianguá',
    neighborhood: 'Centro',
    items: [{ name: 'Troca de Óleo Sintético 5W30', quantity: 1, price: 180.0 }],
    total: 195.5,
    deliveryFee: 12.0,
    rainFee: 3.5,
    status: 'pendente',
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    minutesInCurrentStatus: 14,
    slaAlert: 'amarelo',
    slaReason: 'Loja não aceitou o pedido há mais de 10 min (+14m)',
    paymentMethod: 'pix',
  },
  {
    id: 'PED-9480',
    storeId: 'store-3',
    storeName: 'Drogaria do Povo Ibiapaba',
    customerName: 'Renato Sales',
    customerPhone: '88988112299',
    city: 'São Benedito',
    neighborhood: 'Rodoviária',
    items: [{ name: 'Kit Primeiros Socorros', quantity: 1, price: 49.9 }],
    total: 60.9,
    deliveryFee: 7.0,
    rainFee: 4.0,
    status: 'em_entrega',
    courierName: 'Francisco Elano',
    courierPhone: '88998112233',
    courierStaticMinutes: 12,
    createdAt: new Date(Date.now() - 32 * 60000).toISOString(),
    minutesInCurrentStatus: 27,
    slaAlert: 'vermelho',
    slaReason: 'Entregador parado na serra há mais de 10 min (+12m)',
    paymentMethod: 'pix',
  },
  {
    id: 'PED-9472',
    storeId: 'store-1',
    storeName: 'Auto Mecânica Serrana & Peças',
    customerName: 'Mariana Duarte',
    customerPhone: '88994556677',
    city: 'Tianguá',
    neighborhood: 'Planalto',
    items: [{ name: 'Pastilha de Freio Dianteira', quantity: 1, price: 145.0 }],
    total: 157.0,
    deliveryFee: 12.0,
    rainFee: 0,
    status: 'entregue',
    courierName: 'Davi Linhares',
    createdAt: new Date(Date.now() - 75 * 60000).toISOString(),
    minutesInCurrentStatus: 50,
    slaAlert: null,
    paymentMethod: 'pix',
  },
];

const INITIAL_CITY_CONFIGS: CityConfig[] = CITIES_IBIAPABA.map((city, idx) => ({
  city,
  rainFeeActive: idx === 0 || idx === 2,
  rainFeeAmount: idx === 0 ? 3.5 : idx === 2 ? 4.0 : 3.0,
  emergencyPaused: false,
  activeOrdersCount: [14, 8, 11, 6, 4, 7, 3, 2, 5][idx],
  couriersOnlineCount: [22, 12, 18, 9, 7, 11, 4, 3, 8][idx],
}));

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'adm-001',
    adminEmail: 'master.admin@ibiapabaexpress.com.br',
    ip: '177.136.214.88 (Tianguá, CE)',
    action: 'LOGIN_2FA_SUCCESS',
    details: 'Autenticação 2FA validada com sucesso via OTP.',
    timestamp: new Date().toLocaleString('pt-BR'),
  },
];

// ============================================================================
// 3. CONTEXTO PÚBLICO (AppProvider)
// ============================================================================
export interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedCity: CityIbiapaba;
  setSelectedCity: (city: CityIbiapaba) => void;
  stores: Store[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  addReviewToOrder: (orderId: string, review: Order['review']) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('cliente');
  const [selectedCity, setSelectedCity] = useState<CityIbiapaba>('Tianguá');
  const [stores] = useState<Store[]>(INITIAL_STORES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, { product, quantity: 1, storeId: product.storeId }]);
  };

  const addReviewToOrder = (orderId: string, review: Order['review']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, review } : o))
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        selectedCity,
        setSelectedCity,
        stores,
        products,
        orders,
        cart,
        addToCart,
        addReviewToOrder,
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
// 4. CONTEXTO ADMINISTRATIVO MASTER (AdminProvider)
// ============================================================================
export interface AdminContextType {
  adminUser: AdminUser | null;
  orders: Order[];
  stores: Store[];
  cityConfigs: CityConfig[];
  auditLogs: AuditLog[];
  logout: () => void;
  toggleRainFee: (city: CityIbiapaba) => void;
  toggleEmergencyPauseCity: (city: CityIbiapaba) => void;
  relaunchDelivery: (orderId: string) => void;
  notifyStoreWhatsApp: (orderId: string) => void;
  cancelAndRefundOrder: (orderId: string, reason: string) => void;
  updateStoreStatus: (storeId: string, status: 'ativo' | 'bloqueado') => void;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>({
    id: 'adm-001',
    name: 'Super Administrador Ibiapaba',
    email: 'master.admin@ibiapabaexpress.com.br',
    role: 'super_admin',
    token: 'jwt-adm-ibiapaba',
    twoFactorVerified: true,
  });
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [cityConfigs, setCityConfigs] = useState<CityConfig[]>(INITIAL_CITY_CONFIGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = useCallback((action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: adminUser?.id || 'adm-001',
      adminEmail: adminUser?.email || 'admin@ibiapabaexpress.com.br',
      ip: '177.136.214.88 (Tianguá, CE)',
      action,
      details,
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [adminUser]);

  const logout = () => {
    addAuditLog('LOGOUT', 'Sessão encerrada');
    setAdminUser(null);
  };

  const toggleRainFee = (city: CityIbiapaba) => {
    setCityConfigs((prev) =>
      prev.map((c) => {
        if (c.city === city) {
          const nextState = !c.rainFeeActive;
          addAuditLog('TAXA_CHUVA_ALTERADA', `Taxa de Chuva em ${city} alterada para ${nextState ? 'ATIVA (+R$ 3,50)' : 'DESATIVADA'}`);
          return { ...c, rainFeeActive: nextState };
        }
        return c;
      })
    );
  };

  const toggleEmergencyPauseCity = (city: CityIbiapaba) => {
    setCityConfigs((prev) =>
      prev.map((c) => {
        if (c.city === city) {
          const nextState = !c.emergencyPaused;
          addAuditLog('PAUSA_EMERGENCIA', `Pausa em ${city} ${nextState ? 'ACIONADA' : 'LIBERADA'}`);
          return { ...c, emergencyPaused: nextState };
        }
        return c;
      })
    );
  };

  const relaunchDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'pronto', slaAlert: null } : o))
    );
    addAuditLog('RELANCAR_CORRIDA', `Pedido ${orderId} relançado para motoboys.`);
  };

  const notifyStoreWhatsApp = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    addAuditLog('WHATSAPP_LOJA', `Cobrança de agilidade para ${order.storeName}`);
    window.open(
      `https://wa.me/5588999999999?text=${encodeURIComponent(
        `[IbiapabaExpress] Atenção! O pedido ${order.id} precisa de despacho urgente.`
      )}`,
      '_blank'
    );
  };

  const cancelAndRefundOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelado', slaAlert: null, slaReason: reason } : o))
    );
    addAuditLog('CANCELAR_REEMBOLSAR_PEDIDO', `Pedido ${orderId} estornado via Pix. Motivo: ${reason}`);
  };

  const updateStoreStatus = (storeId: string, status: 'ativo' | 'bloqueado') => {
    setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, status } : s)));
    addAuditLog('STATUS_LOJA', `Loja ${storeId} alterada para ${status}`);
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        orders,
        stores,
        cityConfigs,
        auditLogs,
        logout,
        toggleRainFee,
        toggleEmergencyPauseCity,
        relaunchDelivery,
        notifyStoreWhatsApp,
        cancelAndRefundOrder,
        updateStoreStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin deve ser usado dentro de AdminProvider');
  return ctx;
};

// ============================================================================
// 5. COMPONENTE: AVALIAÇÃO DE OFICINAS / SERVIÇOS (ReviewComponent)
// ============================================================================
export const ReviewComponent: React.FC<{
  orderId: string;
  storeName: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}> = ({ orderId, storeName, onClose, onSubmitSuccess }) => {
  const { addReviewToOrder } = useApp();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReviewToOrder(orderId, {
      stars,
      speedRating: 'rápido',
      priceFairness: 'justo',
      mechanicCare: 'impecável',
      comment: comment || 'Excelente serviço prestado na serra!',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    });
    onSubmitSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-800 dark:text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-extrabold text-sm">Avaliar Oficina / Serviço</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <p className="text-slate-500">{storeName} • {orderId}</p>
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button type="button" key={val} onClick={() => setStars(val)} className="p-1">
                <Star className={`w-8 h-8 ${val <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte aos motoristas da Serra como foi o atendimento..."
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold">Cancelar</button>
            <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-extrabold shadow-md">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 6. COMPONENTE: UNIVERSAL HEADER
// ============================================================================
export const Header: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const { userRole, setUserRole, selectedCity, setSelectedCity } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">IE</div>
        <div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            Ibiapaba<span className="text-emerald-600">Express</span>
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as CityIbiapaba)}
              className="bg-transparent font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {CITIES_IBIAPABA.map((c) => <option key={c} value={c}>{c} (CE)</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
          <button onClick={() => setUserRole('cliente')} className={`px-2 py-1 rounded-lg ${userRole === 'cliente' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Cliente</button>
          <button onClick={() => setUserRole('comercio')} className={`px-2 py-1 rounded-lg ${userRole === 'comercio' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Lojista</button>
          <button onClick={() => setUserRole('entregador')} className={`px-2 py-1 rounded-lg ${userRole === 'entregador' ? 'bg-amber-600 text-white' : 'text-slate-500'}`}>Motoboy</button>
        </div>
        <button onClick={onOpenAdmin} className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Admin Master</span>
        </button>
      </div>
    </header>
  );
};

// ============================================================================
// 7. COMPONENTE: PAINEL ADMIN MASTER (AdminDashboard)
// ============================================================================
export const AdminDashboard: React.FC<{ onToggleMobilePreview: () => void }> = ({ onToggleMobilePreview }) => {
  const {
    adminUser,
    orders,
    stores,
    cityConfigs,
    auditLogs,
    logout,
    toggleRainFee,
    toggleEmergencyPauseCity,
    relaunchDelivery,
    notifyStoreWhatsApp,
    cancelAndRefundOrder,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'bi' | 'sla' | 'cidades' | 'auditoria'>('bi');
  const [selectedCityFilter, setSelectedCityFilter] = useState('todas');
  const [isRlsOpen, setIsRlsOpen] = useState(false);

  const totalGmv = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const yellowAlerts = useMemo(() => orders.filter((o) => o.slaAlert === 'amarelo'), [orders]);
  const redAlerts = useMemo(() => orders.filter((o) => o.slaAlert === 'vermelho'), [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedCityFilter === 'todas') return orders;
    return orders.filter((o) => o.city === selectedCityFilter);
  }, [orders, selectedCityFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-white uppercase">
              Painel Admin Master • Serra da Ibiapaba
            </h1>
            <p className="text-[11px] text-slate-400">9 Cidades Integradas (Tianguá, Ubajara, São Benedito...)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsRlsOpen(true)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1 border border-slate-700">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">RLS Supabase</span>
          </button>
          <button onClick={onToggleMobilePreview} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md">
            Simulador App
          </button>
          <button onClick={logout} className="p-2 rounded-xl bg-slate-800 text-slate-400"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="bg-slate-900/60 border-b border-slate-800 px-6 flex gap-2 text-xs font-bold">
        {[
          { id: 'bi', label: 'Visão Geral (BI)', icon: TrendingUp },
          { id: 'sla', label: `Torre SLA (${yellowAlerts.length + redAlerts.length})`, icon: ShieldAlert },
          { id: 'cidades', label: 'Cidades & Clima', icon: MapPin },
          { id: 'auditoria', label: 'Trilha de Auditoria', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 ${activeTab === tab.id ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {activeTab === 'bi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-xs">GMV Total (Hoje)</span>
                <div className="mt-1 text-2xl font-black text-white font-mono">R$ {totalGmv.toFixed(2)}</div>
                <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+18.4% na Serra</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-xs">Comissão Retida (12%)</span>
                <div className="mt-1 text-2xl font-black text-white font-mono">R$ {(totalGmv * 0.12).toFixed(2)}</div>
                <p className="text-[11px] text-slate-400 mt-1">Margem operacional</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-xs">Alertas SLA Críticos</span>
                <div className="mt-1 text-2xl font-black text-white font-mono">
                  <span className="text-amber-400">{yellowAlerts.length}</span> / <span className="text-rose-400">{redAlerts.length}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Amarelo / Vermelho</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
              <h3 className="font-extrabold text-sm text-white mb-4">Cidades da Serra da Ibiapaba</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cityConfigs.map((cfg) => (
                  <div key={cfg.city} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-white">{cfg.city}</div>
                      <div className="text-[11px] text-slate-400">{cfg.activeOrdersCount} pedidos • {cfg.couriersOnlineCount} motoboys</div>
                    </div>
                    {cfg.emergencyPaused ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">PAUSADO</span>
                    ) : cfg.rainFeeActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">+R$ {cfg.rainFeeAmount.toFixed(2)}</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Normal</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sla' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div>
                <h3 className="font-black text-sm text-white">Torre de Controle de SLA</h3>
                <p className="text-xs text-slate-400">Intervenções em 1-Clique: WhatsApp, Relançar corrida e Estorno Pix</p>
              </div>
              <select value={selectedCityFilter} onChange={(e) => setSelectedCityFilter(e.target.value)} className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-slate-200">
                <option value="todas">Todas as Cidades</option>
                {CITIES_IBIAPABA.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className={`p-4 rounded-3xl border ${ord.slaAlert === 'vermelho' ? 'bg-rose-950/20 border-rose-800' : ord.slaAlert === 'amarelo' ? 'bg-amber-950/20 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">{ord.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">{ord.city} ({ord.neighborhood})</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 uppercase">Status: {ord.status}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1"><strong className="text-white">{ord.storeName}</strong> • Cliente: {ord.customerName} (R$ {ord.total.toFixed(2)})</p>
                      {ord.slaReason && <p className="text-xs font-bold text-rose-400 mt-1">⚠️ {ord.slaReason}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => notifyStoreWhatsApp(ord.id)} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> WhatsApp</button>
                      <button onClick={() => relaunchDelivery(ord.id)} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Relançar</button>
                      <button onClick={() => cancelAndRefundOrder(ord.id, 'Cancelamento e estorno Pix')} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs">Estornar Pix</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cidades' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cityConfigs.map((cfg) => (
              <div key={cfg.city} className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3">
                <span className="font-extrabold text-sm text-white">{cfg.city}</span>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-300">Taxa de Chuva:</span>
                  <button onClick={() => toggleRainFee(cfg.city)} className={`px-2.5 py-1 rounded-xl font-bold ${cfg.rainFeeActive ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {cfg.rainFeeActive ? '+R$ 3,50' : 'Desligada'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Pausa Tempestade:</span>
                  <button onClick={() => toggleEmergencyPauseCity(cfg.city)} className={`px-2.5 py-1 rounded-xl font-bold ${cfg.emergencyPaused ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {cfg.emergencyPaused ? 'BLOQUEADO' : 'LIBERADO'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'auditoria' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2">
            <h3 className="font-extrabold text-sm text-white mb-2">Trilha de Auditoria Imutável</h3>
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between font-mono text-emerald-400 font-bold">
                  <span>{log.action}</span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-300">{log.details}</p>
                <p className="text-[10px] text-slate-500">Admin: {log.adminEmail} • IP: {log.ip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isRlsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-slate-300">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <strong className="text-white text-sm">Políticas Row-Level Security (Supabase RLS)</strong>
              <button onClick={() => setIsRlsOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <p>• <strong>audit_logs:</strong> Apenas admins com role super_admin têm acesso.</p>
            <p>• <strong>financial_settlements:</strong> Repasses Pix restritos ao Master Admin.</p>
            <button onClick={() => setIsRlsOpen(false)} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 8. SIMULADOR DO SUPER APP
// ============================================================================
export const MobileSuperAppPreview: React.FC<{ onReturnToAdmin: () => void }> = ({ onReturnToAdmin }) => {
  const { userRole, stores, orders, products, addToCart } = useApp();
  const [selectedTab, setSelectedTab] = useState<'home' | 'pedidos'>('home');
  const [evaluatingOrder, setEvaluatingOrder] = useState<Order | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-2 sm:p-4">
      <div className="w-full max-w-md flex justify-between mb-3 text-xs">
        <button onClick={onReturnToAdmin} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md">
          Voltar ao Admin Master
        </button>
        <span className="text-slate-400 font-mono">Modo Simulador</span>
      </div>

      <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <Header onOpenAdmin={onReturnToAdmin} />

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {userRole === 'cliente' && selectedTab === 'home' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-200">Balcão de Cotações da Serra</span>
                <h3 className="font-black text-sm mt-0.5">Precisa de Reparo para seu Veículo?</h3>
                <p className="text-xs text-emerald-100 mt-1">Envie cotações para as oficinas de Tianguá, Ubajara e região.</p>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-2 uppercase">Lojas e Oficinas</h4>
                <div className="space-y-2">
                  {stores.map((st) => (
                    <div key={st.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                        <div className="text-[11px] text-slate-500">{st.city} • {st.category} • {st.rating} ★</div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg text-[10px]">Aberto</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-2 uppercase">Serviços e Peças</h4>
                <div className="space-y-2">
                  {products.map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-emerald-600 font-mono font-bold">R$ {p.price.toFixed(2)}</div>
                      </div>
                      <button onClick={() => addToCart(p)} className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs">Pedir</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {userRole === 'cliente' && selectedTab === 'pedidos' && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Meus Pedidos</h4>
              {orders.filter(o => o.status === 'entregue').map((ord) => (
                <div key={ord.id} className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between font-mono font-bold text-emerald-600">
                    <span>{ord.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">ENTREGUE</span>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ord.storeName}</div>
                  {ord.review ? (
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 text-[11px]">
                      ★ {ord.review.stars}/5 - &quot;{ord.review.comment}&quot;
                    </div>
                  ) : (
                    <button onClick={() => setEvaluatingOrder(ord)} className="w-full py-2 rounded-xl bg-amber-500 font-bold text-slate-950 flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-slate-950" /> Avaliar Oficina / Serviço
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {userRole === 'comercio' && (
            <div className="p-6 text-center text-xs text-slate-500 bg-white dark:bg-slate-800 rounded-3xl border">
              <StoreIcon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <strong className="text-slate-900 dark:text-white block text-sm">Painel da Loja Aberto</strong>
              Auto Mecânica Serrana & Peças (Tianguá)
            </div>
          )}

          {userRole === 'entregador' && (
            <div className="p-6 text-center text-xs text-slate-500 bg-white dark:bg-slate-800 rounded-3xl border">
              <Bike className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <strong className="text-slate-900 dark:text-white block text-sm">Motoboy Online</strong>
              Davi Linhares • Honda Fan 160 (Tianguá)
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 flex justify-around text-xs">
          <button onClick={() => setSelectedTab('home')} className={`flex flex-col items-center ${selectedTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Início</span>
          </button>
          <button onClick={() => setSelectedTab('pedidos')} className={`flex flex-col items-center ${selectedTab === 'pedidos' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
            <Package className="w-5 h-5" />
            <span className="text-[10px]">Pedidos</span>
          </button>
        </div>
      </div>

      {evaluatingOrder && (
        <ReviewComponent
          orderId={evaluatingOrder.id}
          storeName={evaluatingOrder.storeName}
          onClose={() => setEvaluatingOrder(null)}
          onSubmitSuccess={() => setEvaluatingOrder(null)}
        />
      )}
    </div>
  );
};

// ============================================================================
// 9. COMPONENTE RAIZ (ROOT APP)
// ============================================================================
function MainApp() {
  const [viewMode, setViewMode] = useState<'admin' | 'preview'>('admin');

  return viewMode === 'admin' ? (
    <AdminDashboard onToggleMobilePreview={() => setViewMode('preview')} />
  ) : (
    <MobileSuperAppPreview onReturnToAdmin={() => setViewMode('admin')} />
  );
}

export default function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <MainApp />
      </AdminProvider>
    </AppProvider>
  );
}
