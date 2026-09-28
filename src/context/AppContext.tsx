import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Order, CartItem, CustomerAddress } from '../types';

// Conexão com o Supabase através das variáveis do VITE
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AppContextType {
  cart: CartItem[];
  orders: Order[];
  fulfillmentType: 'delivery' | 'pickup_delivery';
  setFulfillmentType: (type: 'delivery' | 'pickup_delivery') => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
  createOrder: (data: { customerAddress: CustomerAddress; customerName?: string; customerPhone?: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup_delivery'>('delivery');

  // CARREGAR PEDIDOS E ESCUTAR MUDANÇAS EM TEMPO REAL (REALTIME)
  useEffect(() => {
    fetchOrders();

    // Inscreve no canal de WebSockets do Supabase
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Sincronizando atualização do Supabase:', payload);
          fetchOrders(); // Recarrega os pedidos ao haver qualquer alteração
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        // Mapeia os dados do Supabase para o formato do App
        const formattedOrders: Order[] = data.map((item: any) => ({
          id: item.id,
          createdAt: item.created_at,
          customerName: item.customer_name || 'Cliente Ibiapaba',
          customerPhone: item.customer_phone || '',
          customerAddress: item.delivery_address,
          items: item.items || [],
          fulfillmentType: item.fulfillment_type,
          status: item.status,
          subtotal: Number(item.subtotal),
          deliveryFee: Number(item.delivery_fee),
          total: Number(item.total),
          pickupPin: item.pickup_pin,
          deliveryPin: item.delivery_pin,
        }));
        setOrders(formattedOrders);
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos do Supabase:', err);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getDeliveryFee = () => (fulfillmentType === 'pickup_delivery' ? 12.0 : 7.0);

  // CRIAR PEDIDO NO SUPABASE
  const createOrder = async ({
    customerAddress,
    customerName = 'Cliente Ibiapaba',
    customerPhone = '(88) 99999-9999',
  }: {
    customerAddress: CustomerAddress;
    customerName?: string;
    customerPhone?: string;
  }) => {
    const subtotal = getCartTotal();
    const deliveryFee = getDeliveryFee();
    const total = subtotal + deliveryFee;

    // Gerar PINs aleatórios de 4 dígitos para segurança de Coleta e Devolução
    const pickupPin = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrderData = {
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_address: customerAddress,
      items: cart,
      fulfillment_type: fulfillmentType,
      status: 'pending',
      subtotal,
      delivery_fee: deliveryFee,
      total,
      pickup_pin: pickupPin,
      delivery_pin: deliveryPin,
    };

    try {
      const { error } = await supabase.from('orders').insert([newOrderData]);
      if (error) throw error;
      clearCart();
    } catch (err) {
      console.error('Erro ao salvar pedido no Supabase:', err);
      alert('Houve um erro ao enviar seu pedido. Tente novamente.');
    }
  };

  // ATUALIZAR STATUS DO PEDIDO (USADO POR LOJISTAS E ENTREGADORES)
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        orders,
        fulfillmentType,
        setFulfillmentType,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getDeliveryFee,
        createOrder,
        updateOrderStatus,
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
