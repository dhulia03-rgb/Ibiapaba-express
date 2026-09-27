import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Order } from '../../types';
import { Bike, MapPin, Key, CheckCircle2, ShieldCheck, PackageCheck } from 'lucide-react';

export const CourierDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [pinInput, setPinInput] = useState<{ [orderId: string]: string }>({});

  // Filtra apenas as corridas que precisam de entregador
  const courierOrders = orders.filter(
    (o) =>
      o.fulfillmentType === 'delivery' ||
      (o.fulfillmentType === 'pickup_delivery' &&
        (o.status === 'driver_collecting' || o.status === 'ready_for_return' || o.status === 'delivering_back'))
  );

  const handleVerifyPickupPin = (order: Order) => {
    const entered = pinInput[order.id];
    if (entered === order.pickupPin) {
      updateOrderStatus(order.id, 'in_repair');
      alert('PIN de Coleta confirmado! Item recolhido e em transporte para a oficina.');
    } else {
      alert('PIN de Coleta incorreto. Peça ao cliente o código de 4 dígitos do app dele.');
    }
  };

  const handleVerifyDeliveryPin = (order: Order) => {
    const entered = pinInput[order.id];
    if (entered === order.deliveryPin) {
      updateOrderStatus(order.id, 'completed');
      alert('PIN de Devolução confirmado! Pedido entregue com sucesso.');
    } else {
      alert('PIN de Devolução incorreto. Peça ao cliente o código de 4 dígitos de confirmação.');
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bike className="w-6 h-6 text-amber-500" />
            <span>Painel do Entregador</span>
          </h2>
          <p className="text-xs text-slate-500">Gestão de Coletas e Entregas (Leva e Traz)</p>
        </div>
      </div>

      <div className="space-y-4">
        {courierOrders.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Nenhuma corrida ou coleta disponível no momento.</p>
        ) : (
          courierOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400">#{order.id}</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {order.fulfillmentType === 'pickup_delivery' ? '🛠️ Serviço Leva e Traz' : '🛵 Entrega Direta'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                  {order.status}
                </span>
              </div>

              {/* Endereço de Destino/Origem */}
              <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {order.status === 'driver_collecting' ? 'Endereço de Coleta (Cliente):' : 'Endereço de Entrega/Devolução:'}
                  </p>
                  <p>{order.customerAddress?.street}, {order.customerAddress?.number} - {order.customerAddress?.neighborhood}</p>
                </div>
              </div>

              {/* 🟢 1. ETAPA DE COLETA NA CASA DO CLIENTE */}
              {order.fulfillmentType === 'pickup_delivery' && order.status === 'driver_collecting' && (
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl space-y-2 border border-amber-200 dark:border-amber-800">
                  <p className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" />
                    <span>Insira o PIN de Coleta (fornecido pelo cliente ao entregar o item):</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="PIN (4 dígitos)"
                      value={pinInput[order.id] || ''}
                      onChange={(e) => setPinInput({ ...pinInput, [order.id]: e.target.value })}
                      className="w-32 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 text-xs font-mono rounded-lg text-center font-bold"
                    />
                    <button
                      onClick={() => handleVerifyPickupPin(order)}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Confirmar Coleta</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 🔵 2. ETAPA DE DEVOLUÇÃO AO CLIENTE */}
              {order.fulfillmentType === 'pickup_delivery' && order.status === 'ready_for_return' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'delivering_back')}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Aceitar Devolução e Retirar Item na Oficina</span>
                </button>
              )}

              {order.fulfillmentType === 'pickup_delivery' && order.status === 'delivering_back' && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl space-y-2 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" />
                    <span>Insira o PIN de Devolução (fornecido pelo cliente para receber o item):</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="PIN (4 dígitos)"
                      value={pinInput[order.id] || ''}
                      onChange={(e) => setPinInput({ ...pinInput, [order.id]: e.target.value })}
                      className="w-32 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 text-xs font-mono rounded-lg text-center font-bold"
                    />
                    <button
                      onClick={() => handleVerifyDeliveryPin(order)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finalizar Devolução</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
