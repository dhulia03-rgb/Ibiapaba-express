import { useState } from 'react';
import { supabase } from '../lib/supabase'; // Ajusta o caminho de importação do teu cliente Supabase

export function DeliveryPinModal({ orderId, onSuccess }: { orderId: string; onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerifyPin = async () => {
    if (pin.length !== 4) {
      setErrorMsg('O PIN deve ter exatamente 4 dígitos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Chama a Stored Procedure criada no PostgreSQL
      const { data, error } = await supabase.rpc('validate_and_complete_order', {
        order_id_input: orderId,
        pin_input: pin
      });

      if (error) throw error;

      if (data === true) {
        alert('PIN verificado com sucesso! Entrega concluída. 🎉');
        onSuccess(); // Função para atualizar o estado da tela ou fechar o modal
      } else {
        setErrorMsg('PIN incorreto. Pede ao destinatário para confirmar o código de 4 dígitos.');
      }
    } catch (err: any) {
      console.error('Erro ao validar PIN:', err);
      setErrorMsg('Falha de ligação ao validar o PIN. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-xl text-white max-w-sm mx-auto">
      <h3 className="text-lg font-bold mb-2">Confirmar Entrega</h3>
      <p className="text-sm text-slate-300 mb-4">
        Solicita ao destinatário o PIN de 4 dígitos para finalizar o serviço.
      </p>

      <input
        type="text"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} // Apenas números
        placeholder="0000"
        className="w-full text-center text-2xl tracking-widest py-2 rounded bg-slate-900 border border-slate-700 mb-2 focus:outline-none focus:border-amber-400"
      />

      {errorMsg && <p className="text-red-400 text-xs mb-3">{errorMsg}</p>}

      <button
        onClick={handleVerifyPin}
        disabled={loading}
        className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-bold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'A verificar...' : 'Confirmar e Finalizar'}
      </button>
    </div>
  );
}
