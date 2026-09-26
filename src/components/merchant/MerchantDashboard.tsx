import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { 
  Wrench, 
  Store, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Key, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [pinInput, setPinInput] = useState<{ [orderId: string]: string }>({});
  const [pinError, setPinError] = useState<{ [orderId: string]: boolean }>({});

  // Função para validar o PIN do cliente na Retirada no Balcão
  const handleVerifyTakeawayPin = (orderId: string, correctPin?: string) => {
    const entered = pinInput[orderId];
    if (entered === correctPin) {
      setPinError((prev) => ({ ...prev, [orderId]: false }));
      updateOrderStatus(orderId, 'completed');
    } else {
      setPinError((prev) => ({ ...prev, [orderId]: true }));
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Cabeçalho do Painel */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 rounded-3xl text-white shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            <span>Gestão da Oficina / Loja</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Acompanhe reparos, recebimentos e entregas no balcão
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-mono font-bold text-indigo-300">
          {orders.length} Pedidos
        </span>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">Nenhum pedido ou serviço ativo no momento.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3"
            >
              {/* Badge de Modalidade e ID */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    #{order.id}
                  </span>

                  {/* Badges dinâmicas baseadas na modalidade */}
                  {order.fulfillmentType === 'pickup_delivery' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-300/40">
                      <Wrench className="w-3 h-3" /> Leva e Traz
                    </span>
                  )}
                  {order.fulfillmentType === 'takeaway' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-300/40">
                      <Store className="w-3 h-3" /> Retirada na Loja
                    </span>
                  )}
                  {order.fulfillmentType === 'delivery' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold flex items-center gap-1 border border-blue-300/40">
                      <Truck className="w-3 h-3" /> Entrega Direta
                    </span>
                  )}
                </div>

                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  R$ {order.total.toFixed(2)}
                </span>
              </div>

              {/* Itens do Pedido */}
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="text-xs flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-mono">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Painel de Ações e Estado Atual */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                
                {/* ESTADO: Aguardando Motoboy buscar no cliente */}
                {order.status === 'driver_collecting' && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs">
                    <span className="text-amber-800 dark:text-amber-200 font-medium">
                      🛵 Entregador recolhendo item na casa do cliente...
                    </span>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'in_repair')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition cursor-pointer text-[11px]"
                    >
                      Confirmar Chegada na Oficina
                    </button>
                  </div>
                )}

                {/* ESTADO: Em Reparo / Manutenção */}
                {(order.status === 'in_repair' || order.status === 'pending') && (
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800/50 space-y-2">
                    <p className="text-xs text-indigo-900 dark:text-indigo-200 font-bold">
                      🛠️ Item em Manutenção / Bancada
                    </p>
                    <div className="flex gap-2">
                      {order.fulfillmentType === 'pickup_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready_for_return')}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Reparo Concluído (Chamar Devolução)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {order.fulfillmentType === 'takeaway' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Pronto para Retirada no Balcão</span>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ESTADO: Pronto para Retirada no Balcão (Validação de PIN) */}
                {order.status === 'ready_for_pickup' && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                    <p className="text-xs text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Aguardando Cliente retirar no balcão. Digite o PIN de validação:</span>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="PIN (4 dígitos)"
                        value={pinInput[order.id] || ''}
                        onChange={(e) => setPinInput({ ...pinInput, [order.id]: e.target.value })}
                        className="px-3 py-1.5 rounded-lg border text-center font-mono font-bold text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 w-32"
                      />
                      <button
                        onClick={() => handleVerifyTakeawayPin(order.id, order.deliveryPin)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        Validar & Entregar
                      </button>
                    </div>
                    {pinError[order.id] && (
                      <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> PIN incorreto! Solicite ao cliente no ecrã do telemóvel.
                      </p>
                    )}
                  </div>
                )}

                {/* ESTADO: Aguardando Devolução pelo Entregador */}
                {order.status === 'ready_for_return' && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/50 text-xs text-purple-900 dark:text-purple-200 font-bold">
                    🟣 Aguardando entregador parceiro retirar para devolução ao cliente...
                  </div>
                )}

                {/* ESTADO: Concluído */}
                {order.status === 'completed' && (
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pedido Concluído e Entregue
                    </span>
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
