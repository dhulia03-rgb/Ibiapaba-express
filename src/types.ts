export type FulfillmentType = 'delivery' | 'takeaway' | 'pickup_delivery';

export type OrderStatus = 
  | 'pending'           // Pedido recebido
  | 'driver_collecting' // Motoboy a caminho da casa do cliente (Leva e Traz)
  | 'in_repair'         // Item em manutenção / preparo na loja
  | 'ready_for_pickup'  // Pronto para o cliente retirar na loja
  | 'ready_for_return'  // Pronto na loja, aguardando motoboy para devolução
  | 'delivering_back'   // Motoboy levando de volta ao cliente
  | 'completed';        // Entregue / Concluído

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  supportsTakeaway?: boolean;
  supportsPickupDelivery?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  pickupPin?: string;   // PIN para o motoboy recolher o item na casa do cliente
  deliveryPin?: string; // PIN para devolução ou retirada no balcão
  customerAddress?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
  };
}
