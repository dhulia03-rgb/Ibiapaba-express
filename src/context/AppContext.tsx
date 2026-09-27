import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Store, Order, CartItem, FulfillmentType, OrderStatus } from '../types';

interface AppContextType {
  userRole: 'cliente' | 'comercio' | 'entregador';
  setUserRole: (role: 'cliente' | 'comercio' | 'entregador') => void;
  
  // Carrinho & Modalidade
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  
  // Gestão de Pedidos
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Rastreio Ativo
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  
  // Totais Calculados
  getDeliveryFee: () => number;
  getCartTotal: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<'cliente' | 'comercio' | 'entregador'>('cliente');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  // Valor base do frete da loja (exemplo fixo de R$ 7,00)
  const baseDeliveryFee = 7.00;

  // 🧮 1. Cálculo Dinâmico da Taxa consoante a Modalidade
  const getDeliveryFee = (): number => {
    if (fulfillmentType === 'takeaway') return 0.00; // Retirada na Loja = Grátis
    if (fulfillmentType === 'pickup_delivery') return baseDeliveryFee * 2; // Leva e Traz = Busca + Devolução
    return baseDeliveryFee; // Entrega Padrão
  };

  const getCartTotal = (): number => {
    const itemsTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return itemsTotal + getDeliveryFee();
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // 🔑 2. Gerador Automático de PINs de Segurança (4 dígitos)
  const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

  // 📦 3. Criação de Pedido com Logística Leva e Traz / Retirada
  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: cart,
      total: getCartTotal(),
      deliveryFee: getDeliveryFee(),
      fulfillmentType: fulfillmentType,
      status: fulfillmentType === 'pickup_delivery' ? 'driver_collecting' : 'pending',
      
      // Gera PINs apenas se for Leva e Traz ou Retirada na Loja
      pickupPin: fulfillmentType === 'pickup_delivery' ? generatePin() : undefined,
      deliveryPin: (fulfillmentType === 'pickup_delivery' || fulfillmentType === 'takeaway') ? generatePin() : undefined,
      
      ...orderData,
    } as Order;

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        fulfillmentType,
        setFulfillmentType,
        orders,
        createOrder,
        updateOrderStatus,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        getDeliveryFee,
        getCartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};
