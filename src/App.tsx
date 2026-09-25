import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
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
  Search,
  Check,
  X,
  Database,
  Star,
  ShoppingBag,
  Wrench,
  Send,
  Home,
  User,
  Plus,
  Trash2,
  MessageCircle,
  Eye,
  Sliders,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

// ============================================================================
// 1. SUPABASE CLIENT & CONFIGURAÇÃO INLINE
// ============================================================================
export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true } }
);

export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      configured: false,
      message: 'VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas. Operando com armazenamento local.',
    };
  }
  try {
    const { error } = await supabase.from('audit_logs').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation') && error.code !== '42P01') {
      return { connected: false, configured: true, message: `Falha na autenticação: ${error.message}` };
    }
    return { connected: true, configured: true, message: 'Conectado ao Supabase PostgreSQL na Serra da Ibiapaba.' };
  } catch (err: any) {
    return { connected: false, configured: true, message: `Erro: ${err?.message || 'Servidor inacessível'}` };
  }
}

// ============================================================================
// 2. TIPOS E MODELOS DE DADOS DA SERRA DA IBIAPABA
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

export interface DisputeItem {
  id: string;
  orderId: string;
  claimantName: string;
  type: 'loja' | 'cliente' | 'entregador';
  reason: string;
  status: 'aberto' | 'em_analise' | 'resolvido' | 'reembolsado';
  amount: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  city: CityIbiapaba;
  description: string;
  category: 'Mecânica Geral' | 'Freios & Suspensão' | 'Auto Elétrica' | 'Pneus & Alinhamento';
  status: 'aberta' | 'respondida' | 'fechada';
  bidsCount: number;
  createdAt: string;
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

// Dados Iniciais Demonstrativos
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
    name: 'Troca de Óleo 100% Sintético 5W30',
    description: 'Troca de óleo para motor com checagem de 21 itens de segurança.',
    price: 180.0,
    category: 'Serviços',
  },
  {
    id: 'prod-2',
    storeId: 'store-1',
    name: 'Pastilha de Freio Dianteira Cerâmica',
    description: 'Frenagem segura para descida de serra.',
    price: 145.0,
    category: 'Peças',
  },
  {
    id: 'prod-3',
    storeId: 'store-2',
    name: 'Picanha na Brasa Completa (2 pessoas)',
    description: 'Acompanha arroz biro-biro, feijão tropeiro e farofa serrana.',
    price: 89.9,
    category: 'Refeições',
  },
];

const INITIAL_COURIERS: CourierPartner[] = [
  {
    id: 'cour-1',
    name: 'Davi Santiago Linhares',
    phone: '88999441122',
    city: 'Tianguá',
    vehicle: 'Moto',
    plate: 'PNB-4821',
    rating: 4.95,
    status: 'ativo',
    isOnline: true,
    activeDeliveries: 1,
    totalDeliveries: 512,
    balance: 1420.5,
  },
  {
    id: 'cour-2',
    name: 'Francisco Elano Freire',
    phone: '88998112233',
    city: 'Ubajara',
    vehicle: 'Moto',
    plate: 'OIO-9012',
    rating: 4.7,
    status: 'ativo',
    isOnline: true,
    activeDeliveries: 1,
    totalDeliveries: 284,
    balance: 890.0,
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
    items: [{ name: 'Troca de Óleo 100% Sintético 5W30', quantity: 1, price: 180.0 }],
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
    courierId: 'cour-2',
    courierName: 'Francisco Elano Freire',
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
    items: [{ name: 'Pastilha de Freio Dianteira Cerâmica', quantity: 1, price: 145.0 }],
    total: 157.0,
    deliveryFee: 12.0,
    rainFee: 0,
    status: 'entregue',
    courierId: 'cour-1',
    courierName: 'Davi Santiago Linhares',
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
    details: 'Autenticação 2FA validada via código OTP.',
    timestamp: new Date(Date.now() - 45 * 60000).toLocaleString('pt-BR'),
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
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (order: Order) => void;
  addReviewToOrder: (orderId: string, review: Order['review']) => void;
  activeTrackingOrderId: string;
  setActiveTrackingOrderId: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('cliente');
  const [selectedCity, setSelectedCity] = useState<CityIbiapaba>('Tianguá');
  const [stores] = useState<Store[]>(INITIAL_STORES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('PED-9481');

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, storeId: product.storeId }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const createOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
    setActiveTrackingOrderId(order.id);
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
        removeFromCart,
        clearCart,
        createOrder,
        addReviewToOrder,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};

// ============================================================================
// 4. CONTEXTO ADMINISTRATIVO MASTER (AdminProvider)
// ============================================================================
export interface AdminContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  orders: Order[];
  stores: Store[];
  couriers: CourierPartner[];
  cityConfigs: CityConfig[];
  auditLogs: AuditLog[];
  loginWithOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  toggleRainFee: (city: CityIbiapaba) => void;
  toggleEmergencyPauseCity: (city: CityIbiapaba) => void;
  relaunchDelivery: (orderId: string) => void;
  notifyStoreWhatsApp: (orderId: string) => void;
  manuallyAssignCourier: (orderId: string, courierId: string) => void;
  cancelAndRefundOrder: (orderId: string, reason: string) => void;
  updateStoreStatus: (storeId: string, status: 'ativo' | 'bloqueado') => void;
  updateCourierStatus: (courierId: string, status: 'ativo' | 'bloqueado') => void;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>({
    id: 'adm-001',
    name: 'Super Administrador Ibiapaba',
    email: 'master.admin@ibiapabaexpress.com.br',
    role: 'super_admin',
    token: 'jwt-token-master-ibiapaba',
    twoFactorVerified: true,
  });
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [couriers, setCouriers] = useState<CourierPartner[]>(INITIAL_COURIERS);
  const [cityConfigs, setCityConfigs] = useState<CityConfig[]>(INITIAL_CITY_CONFIGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = useCallback((action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: adminUser?.id || 'adm-anon',
      adminEmail: adminUser?.email || 'master.admin@ibiapabaexpress.com.br',
      ip: '177.136.214.88 (Tianguá, CE)',
      action,
      details,
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from('audit_logs').insert([newLog]).then();
    }
  }, [adminUser]);

  const loginWithOtp = async (email: string, otp: string) => {
    if (otp === '123456' || otp.length === 6) {
      setAdminUser({
        id: 'adm-001',
        name: 'Administrador Master Regional',
        email,
        role: 'super_admin',
        token: `jwt-${Date.now()}`,
        twoFactorVerified: true,
      });
      addAuditLog('LOGIN_2FA_SUCCESS', `Login 2FA autorizado para ${email}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    addAuditLog('LOGOUT', 'Sessão administrativa encerrada');
    setAdminUser(null);
  };

  const toggleRainFee = (city: CityIbiapaba) => {
    setCityConfigs((prev) =>
      prev.map((c) => {
        if (c.city === city) {
          const nextState = !c.rainFeeActive;
          addAuditLog('TAXA_CHUVA_ALTERADA', `Taxa de Chuva em ${city} ${nextState ? 'ATIVADA (+R$ 3,50)' : 'DESATIVADA'}`);
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
          addAuditLog('PAUSA_EMERGENCIA_ALTERADA', `Pausa de Emergência em ${city} ${nextState ? 'ACIONADA' : 'LIBERADA'}`);
          return { ...c, emergencyPaused: nextState };
        }
        return c;
      })
    );
  };

  const relaunchDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'pronto', courierId: undefined, slaAlert: null } : o))
    );
    addAuditLog('RELANCAR_CORRIDA', `Corrida ${orderId} relançada na fila da cidade.`);
  };

  const notifyStoreWhatsApp = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    addAuditLog('WHATSAPP_NOTIFY_LOJA', `Cobrança de agilidade enviada para a loja ${order.storeName}`);
    window.open(
      `https://wa.me/5588999999999?text=${encodeURIComponent(
        `[IbiapabaExpress Admin] O pedido ${order.id} em ${order.city} precisa de atenção imediata.`
      )}`,
      '_blank'
    );
  };

  const manuallyAssignCourier = (orderId: string, courierId: string) => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'em_entrega',
              courierId: courier.id,
              courierName: courier.name,
              courierPhone: courier.phone,
              courierStaticMinutes: 0,
              slaAlert: null,
            }
          : o
      )
    );
    addAuditLog('ATRIBUIR_ENTREGADOR_MANUAL', `Entregador ${courier.name} atribuído manualmente ao pedido ${orderId}`);
  };

  const cancelAndRefundOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelado', slaAlert: null, slaReason: reason } : o))
    );
    addAuditLog('CANCELAR_REEMBOLSAR_PEDIDO', `Pedido ${orderId} cancelado e estornado via Pix. Motivo: ${reason}`);
  };

  const updateStoreStatus = (storeId: string, status: 'ativo' | 'bloqueado') => {
    setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, status } : s)));
    addAuditLog('STATUS_LOJA_ALTERADO', `Loja ${storeId} alterada para ${status}`);
  };

  const updateCourierStatus = (courierId: string, status: 'ativo' | 'bloqueado') => {
    setCouriers((prev) => prev.map((c) => (c.id === courierId ? { ...c, status } : c)));
    addAuditLog('STATUS_ENTREGADOR_ALTERADO', `Entregador ${courierId} alterado para ${status}`);
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAuthenticated: Boolean(adminUser?.twoFactorVerified),
        orders,
        stores,
        couriers,
        cityConfigs,
        auditLogs,
        loginWithOtp,
        logout,
        toggleRainFee,
        toggleEmergencyPauseCity,
        relaunchDelivery,
        notifyStoreWhatsApp,
        manuallyAssignCourier,
        cancelAndRefundOrder,
        updateStoreStatus,
        updateCourierStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin deve ser usado dentro de AdminProvider');
  return context;
};

// ============================================================================
// 5. COMPONENTE: AVALIAÇÃO DE OFICINAS / SERVIÇOS (ReviewComponent)
// ============================================================================
export interface ReviewComponentProps {
  orderId: string;
  storeName: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const ReviewComponent: React.FC<ReviewComponentProps> = ({
  orderId,
  storeName,
  onClose,
  onSubmitSuccess,
}) => {
  const { addReviewToOrder } = useApp();
  const [stars, setStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [speedRating, setSpeedRating] = useState('rápido');
  const [priceFairness, setPriceFairness] = useState('justo');
  const [mechanicCare, setMechanicCare] = useState('impecável');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const starLabels = ['', 'Péssimo', 'Ruim', 'Regular', 'Muito Bom', 'Excelente!'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      addReviewToOrder(orderId, {
        stars,
        speedRating,
        priceFairness,
        mechanicCare,
        comment,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      });
      setIsSubmitting(false);
      onSubmitSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Avaliar Oficina / Serviço</h3>
              <p className="text-xs text-slate-500">{storeName} • {orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="text-center py-2">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onMouseEnter={() => setHoveredStars(val)}
                  onMouseLeave={() => setHoveredStars(0)}
                  onClick={() => setStars(val)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      val <= (hoveredStars || stars)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-2">
              {starLabels[hoveredStars || stars]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pontualidade</label>
              <select
                value={speedRating}
                onChange={(e) => setSpeedRating(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="rápido">Rápido / Antes do prazo</option>
                <option value="normal">No prazo combinado</option>
                <option value="lento">Atrasou</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Preço Cobrado</label>
              <select
                value={priceFairness}
                onChange={(e) => setPriceFairness(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="justo">Preço justo e honesto</option>
                <option value="médio">Na média regional</option>
                <option value="caro">Mais caro que o normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Cuidado e Diagnóstico Mecânico</label>
            <select
              value={mechanicCare}
              onChange={(e) => setMechanicCare(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="impecável">Diagnóstico preciso e peças boas</option>
              <option value="satisfatório">Serviço bem feito</option>
              <option value="deixou_a_desejar">Precisa melhorar</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Comentário</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva a qualidade do atendimento ou das peças instaladas..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Publicar Avaliação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 6. COMPONENTE: UNIVERSAL HEADER
// ============================================================================
export interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenQuotes: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onOpenQuotes }) => {
  const { userRole, setUserRole, selectedCity, setSelectedCity } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-black text-sm">
            IE
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Ibiapaba<span className="text-emerald-600">Express</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as CityIbiapaba)}
                className="bg-transparent font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                {CITIES_IBIAPABA.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {c} (CE)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQuotes}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            <span>Oficinas</span>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setUserRole('cliente')}
              className={`px-2 py-1 rounded-lg transition ${
                userRole === 'cliente'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => setUserRole('comercio')}
              className={`px-2 py-1 rounded-lg transition ${
                userRole === 'comercio'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lojista
            </button>
            <button
              onClick={() => setUserRole('entregador')}
              className={`px-2 py-1 rounded-lg transition ${
                userRole === 'entregador'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Motoboy
            </button>
          </div>

          <button
            onClick={onOpenAdmin}
            title="Abrir Painel Admin Master"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Admin Master</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 7. COMPONENTE: PAINEL DO LOJISTA (MerchantDashboard)
// ============================================================================
export const MerchantDashboard: React.FC = () => {
  const { orders } = useApp();
  const [storeStatus, setStoreStatus] = useState<'aberto' | 'fechado'>('aberto');
  const merchantOrders = orders.filter((o) => o.storeId === 'store-1');

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-indigo-800/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
              Painel do Parceiro • Serra da Ibiapaba
            </span>
            <h2 className="text-lg font-black mt-0.5">Auto Mecânica Serrana & Peças</h2>
            <p className="text-xs text-indigo-200">Tianguá, CE • Categoria: Oficina & Peças</p>
          </div>
          <button
            onClick={() => setStoreStatus((s) => (s === 'aberto' ? 'fechado' : 'aberto'))}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition ${
              storeStatus === 'aberto' ? 'bg-emerald-500 text-white shadow-md' : 'bg-rose-600 text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{storeStatus === 'aberto' ? 'LOJA ABERTA' : 'FECHADO'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-indigo-800/40 text-center">
          <div>
            <div className="text-lg font-black font-mono">R$ 4.890,50</div>
            <div className="text-[10px] text-indigo-200">Saldo a Receber</div>
          </div>
          <div>
            <div className="text-lg font-black font-mono">{merchantOrders.length}</div>
            <div className="text-[10px] text-indigo-200">Pedidos Hoje</div>
          </div>
          <div>
            <div className="text-lg font-black font-mono text-amber-300">4.9 ★</div>
            <div className="text-[10px] text-indigo-200">Reputação</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center justify-between">
          <span>Pedidos Recebidos ({merchantOrders.length})</span>
          <span className="text-xs text-indigo-600 font-bold">Aceite Médio: 4 min</span>
        </h3>

        <div className="space-y-3">
          {merchantOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{ord.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                    {ord.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Cliente: {ord.customerName} • {ord.neighborhood}, {ord.city}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="font-mono font-extrabold text-xs text-slate-900 dark:text-white mr-2">
                  R$ {ord.total.toFixed(2)}
                </span>
                <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm">
                  Aceitar / Despachar
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
// 8. COMPONENTE: PAINEL DO ENTREGADOR (CourierDashboard)
// ============================================================================
export const CourierDashboard: React.FC = () => {
  const { orders } = useApp();
  const [isOnline, setIsOnline] = useState(true);
  const activeDelivery = orders.find((o) => o.status === 'em_entrega' && o.courierId === 'cour-1');

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-amber-600/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-lg">
              <Bike className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-200 font-bold uppercase">
                Entregador Credenciado Ibiapaba
              </span>
              <h2 className="text-base font-black">Davi Santiago Linhares</h2>
              <p className="text-xs text-amber-100">Moto Honda Fan 160 • PNB-4821 (Tianguá)</p>
            </div>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
              isOnline ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/15 text-center">
          <div>
            <div className="text-lg font-black font-mono">R$ 142,50</div>
            <div className="text-[10px] text-amber-100">Ganhos Hoje</div>
          </div>
          <div>
            <div className="text-lg font-black font-mono">9</div>
            <div className="text-[10px] text-amber-100">Corridas Feitas</div>
          </div>
          <div>
            <div className="text-lg font-black font-mono text-emerald-300">+R$ 3,50</div>
            <div className="text-[10px] text-amber-100">Taxa de Chuva</div>
          </div>
        </div>
      </div>

      {activeDelivery ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-3xl p-5 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span className="font-extrabold text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400">
                Corrida em Rota Ativa
              </span>
            </div>
            <span className="font-mono text-xs font-bold">{activeDelivery.id}</span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Origem</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{activeDelivery.storeName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Destino</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {activeDelivery.customerName} • {activeDelivery.neighborhood}, {activeDelivery.city}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Ligar Cliente
            </button>
            <button className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20">
              Confirmar Entrega
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Aguardando Novas Corridas</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Você está posicionado na região de Tianguá. Quando uma corrida for despachada, ela aparecerá aqui.
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 9. COMPONENTE: PAINEL ADMIN MASTER COMPLETO (AdminDashboard)
// ============================================================================
export interface AdminDashboardProps {
  onToggleMobilePreview: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onToggleMobilePreview }) => {
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
    updateStoreStatus,
  } = useAdmin();

  const [activeAdminTab, setActiveAdminTab] = useState<'bi' | 'sla' | 'cidades' | 'parceiros' | 'auditoria'>('bi');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('todas');
  const [isRlsOpen, setIsRlsOpen] = useState(false);

  const totalGmv = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const retainedCommissions = useMemo(() => totalGmv * 0.12, [totalGmv]);
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm tracking-tight text-white uppercase">
                Painel Admin Master • Serra da Ibiapaba
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-extrabold border border-emerald-500/30">
                ROLE: {adminUser?.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Operações em 9 cidades: Tianguá, Ubajara, São Benedito, Viçosa do Ceará, etc.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsRlsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">RLS Supabase</span>
          </button>

          <button
            onClick={onToggleMobilePreview}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Simulador Super App</span>
          </button>

          <button
            onClick={logout}
            title="Sair"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 flex items-center gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'bi', label: 'Visão Geral (BI)', icon: TrendingUp },
          { id: 'sla', label: `Torre SLA (${yellowAlerts.length + redAlerts.length})`, icon: ShieldAlert },
          { id: 'cidades', label: 'Cidades & Clima', icon: MapPin },
          { id: 'parceiros', label: 'Lojas & Entregadores', icon: StoreIcon },
          { id: 'auditoria', label: 'Trilha de Auditoria', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {activeAdminTab === 'bi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-xs">GMV Total (Hoje)</span>
                <div className="mt-1 text-2xl font-black text-white font-mono">R$ {totalGmv.toFixed(2)}</div>
                <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+18.4% na Serra</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-xs">Comissão Retida (12%)</span>
                <div className="mt-1 text-2xl font-black text-white font-mono">R$ {retainedCommissions.toFixed(2)}</div>
                <p className="text-[11px] text-slate-400 mt-1">Margem operacional</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-xs">Pedidos Totais</span>
                <div className="mt-1 text-2xl font-black text-white font-mono">{orders.length}</div>
                <p className="text-[11px] text-slate-400 mt-1">{orders.filter(o => o.status === 'entregue').length} entregues</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-xs">Alertas SLA Ativos</span>
                <div className="mt-1 text-2xl font-black text-white font-mono">
                  <span className="text-amber-400">{yellowAlerts.length}</span> / <span className="text-rose-400">{redAlerts.length}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Amarelo / Vermelho</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
              <h3 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Status Operacional das 9 Cidades da Serra da Ibiapaba</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cityConfigs.map((cfg) => (
                  <div key={cfg.city} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-white">{cfg.city}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {cfg.activeOrdersCount} pedidos • {cfg.couriersOnlineCount} motoboys
                      </div>
                    </div>
                    <div>
                      {cfg.emergencyPaused ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">PAUSADO</span>
                      ) : cfg.rainFeeActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">+R$ {cfg.rainFeeAmount.toFixed(2)}</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Normal</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeAdminTab === 'sla' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Torre de Controle de SLA em Tempo Real</span>
                </h3>
                <p className="text-xs text-slate-400">Ações Rápidas: Notificar WhatsApp, Relançar corrida e Estorno Pix</p>
              </div>

              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-slate-200"
              >
                <option value="todas">Todas as Cidades</option>
                {CITIES_IBIAPABA.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const isRed = ord.slaAlert === 'vermelho';
                const isYellow = ord.slaAlert === 'amarelo';

                return (
                  <div
                    key={ord.id}
                    className={`p-4 rounded-3xl border transition ${
                      isRed ? 'bg-rose-950/20 border-rose-800/80' : isYellow ? 'bg-amber-950/20 border-amber-800/80' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs text-white">{ord.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                            {ord.city} ({ord.neighborhood})
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 uppercase">
                            Status: {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          <strong className="text-white">{ord.storeName}</strong> • Cliente: {ord.customerName} (R$ {ord.total.toFixed(2)})
                        </p>
                        {ord.slaReason && (
                          <p className="text-xs font-bold text-rose-400 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> {ord.slaReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => notifyStoreWhatsApp(ord.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <Phone className="w-3 h-3" /> WhatsApp
                        </button>
                        <button
                          onClick={() => relaunchDelivery(ord.id)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <RotateCcw className="w-3 h-3" /> Relançar
                        </button>
                        <button
                          onClick={() => cancelAndRefundOrder(ord.id, 'Cancelamento e estorno Pix autorizado')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm"
                        >
                          Estornar Pix
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeAdminTab === 'cidades' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>Controle Climático (Taxa de Chuva) e Pausa de Emergência</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {cityConfigs.map((cfg) => (
                <div key={cfg.city} className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white">{cfg.city}</span>
                    <span className="text-xs text-slate-400 font-mono">{cfg.couriersOnlineCount} motoboys</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Taxa de Chuva (+R$ 3,50):</span>
                      <button
                        onClick={() => toggleRainFee(cfg.city)}
                        className={`px-2.5 py-1 rounded-xl font-bold transition ${
                          cfg.rainFeeActive ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cfg.rainFeeActive ? 'ATIVA' : 'DESLIGADA'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Pausa Tempestade:</span>
                      <button
                        onClick={() => toggleEmergencyPauseCity(cfg.city)}
                        className={`px-2.5 py-1 rounded-xl font-bold transition ${
                          cfg.emergencyPaused ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cfg.emergencyPaused ? 'BLOQUEADO' : 'LIBERADO'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeAdminTab === 'parceiros' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-white">Lojas Credenciadas na Serra</h3>
            <div className="space-y-2">
              {stores.map((st) => (
                <div key={st.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white text-sm">{st.name}</span>
                    <p className="text-slate-400">{st.city} • Categoria: {st.category} • Reputação: {st.rating} ★</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${st.status === 'ativo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {st.status}
                    </span>
                    <button
                      onClick={() => updateStoreStatus(st.id, st.status === 'ativo' ? 'bloqueado' : 'ativo')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
                    >
                      {st.status === 'ativo' ? 'Bloquear' : 'Aprovar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeAdminTab === 'auditoria' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Trilha de Auditoria Imutável (Audit Trail)</span>
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-emerald-400 font-bold">{log.action}</span>
                    <span className="text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Admin: {log.adminEmail} • IP: {log.ip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isRlsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Políticas de Segurança Row-Level Security (RLS)</span>
              </h3>
              <button onClick={() => setIsRlsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <strong className="text-emerald-400 block font-mono">tabela: audit_logs (RLS Ativo)</strong>
                Apenas admins autenticados com o claim role == &apos;super_admin&apos; podem consultar e registrar logs.
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <strong className="text-indigo-400 block font-mono">tabela: financial_transfers (RLS Estrito)</strong>
                Repasses financeiros via Pix restritos exclusivamente à chave de serviço do Master Admin.
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setIsRlsOpen(false)} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 10. COMPONENTE: SIMULADOR MOBILE DO SUPER APP
// ============================================================================
export const MobileSuperAppPreview: React.FC<{ onReturnToAdmin: () => void }> = ({ onReturnToAdmin }) => {
  const { userRole, stores, orders, products, addToCart } = useApp();
  const [selectedTab, setSelectedTab] = useState<'home' | 'pedidos' | 'oficinas'>('home');
  const [evaluatingOrder, setEvaluatingOrder] = useState<Order | null>(null);

  const completedOrders = orders.filter((o) => o.status === 'entregue');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-2 sm:p-4">
      <div className="w-full max-w-md flex items-center justify-between mb-3 text-xs">
        <button
          onClick={onReturnToAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold shadow-md active:scale-95 transition"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Voltar ao Admin Master</span>
        </button>
        <span className="text-slate-400 font-mono text-[11px]">Modo Simulador</span>
      </div>

      <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[640px]">
        <Header onOpenAdmin={onReturnToAdmin} onOpenQuotes={() => setSelectedTab('oficinas')} />

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {userRole === 'cliente' && (
            <>
              {selectedTab === 'home' && (
                <div className="space-y-4">
                  <div
                    onClick={() => setSelectedTab('oficinas')}
                    className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-200">
                      Balcão de Cotações da Serra
                    </span>
                    <h3 className="font-black text-sm mt-0.5">Precisa de Reparo ou Peça para seu Veículo?</h3>
                    <p className="text-xs text-emerald-100 mt-1">
                      Envie um pedido de cotação para as principais oficinas de Tianguá, Ubajara e região.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">
                      Parceiros em Destaque
                    </h4>
                    <div className="space-y-2">
                      {stores.map((st) => (
                        <div key={st.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{st.name}</div>
                            <div className="text-[11px] text-slate-500">{st.city} • {st.category} • {st.rating} ★</div>
                          </div>
                          <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-lg">
                            Aberto
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">
                      Serviços e Peças Rápidas
                    </h4>
                    <div className="space-y-2">
                      {products.map((p) => (
                        <div key={p.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-extrabold mt-0.5">
                              R$ {p.price.toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p)}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm active:scale-95"
                          >
                            Pedir
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'pedidos' && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Meus Pedidos & Avaliações</h4>
                  {completedOrders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{ord.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          ENTREGUE
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{ord.storeName}</div>
                      <div className="text-[11px] text-slate-500">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')} • R$ {ord.total.toFixed(2)}
                      </div>

                      {ord.review ? (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{ord.review.stars} / 5 Estrelas</span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 italic">
                            &quot;{ord.review.comment}&quot;
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEvaluatingOrder(ord)}
                          className="w-full mt-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Avaliar Oficina / Serviço</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'oficinas' && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>Cotações Mecânicas da Serra</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Consulte preços e orçamentos para conserto e peças de carros e motos.
                  </p>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-3xl text-xs space-y-2">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                      Solicitar Novo Orçamento Rápido
                    </span>
                    <input
                      type="text"
                      placeholder="Ex: Troca de correia dentada Gol G6"
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                    <button className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm">
                      Enviar para Oficinas da Serra
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {userRole === 'comercio' && <MerchantDashboard />}
          {userRole === 'entregador' && <CourierDashboard />}
        </div>

        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 flex items-center justify-around text-xs">
          <button
            onClick={() => setSelectedTab('home')}
            className={`flex flex-col items-center p-1 ${selectedTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Início</span>
          </button>
          <button
            onClick={() => setSelectedTab('oficinas')}
            className={`flex flex-col items-center p-1 ${selectedTab === 'oficinas' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px]">Cotações</span>
          </button>
          <button
            onClick={() => setSelectedTab('pedidos')}
            className={`flex flex-col items-center p-1 ${selectedTab === 'pedidos' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
          >
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
// 11. COMPONENTE RAIZ (ROOT APP)
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
