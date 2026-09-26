export interface CustomerAddress {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  referencePoint?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  pickupPin?: string;
  deliveryPin?: string;
  customerAddress?: CustomerAddress;
}
