import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function AdminControlPro() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Tianguá');
  const [rainMode, setRainMode] = useState(false);

  // Verificar se o usuário logado é realmente Admin
  useEffect(() => {
    async function checkAdminRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Erro ao verificar permissões:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAdminRole();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white">A carregar painel de controlo...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center bg-red-950/40 border border-red-500 rounded-xl text-white max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold mb-2">Acesso Restrito 🚫</h2>
        <p className="text-sm text-slate-300">
          Esta área é exclusiva para o Administrador Geral da IbiapabaExpress.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-amber-400">AdminControl Pro</h1>
          <p className="text-xs text-slate-400">Torre de Controlo Operacional — Serra da Ibiapaba</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold">
          Modo Administrador Ativo
        </span>
      </div>

      {/* Grid de Controlo por Município */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Selecione o Município Alvo</h3>
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
          >
            <option value="Tianguá">Tianguá</option>
            <option value="Ubajara">Ubajara</option>
            <option value="Ibiapina">Ibiapina</option>
            <option value="São Benedito">São Benedito</option>
            <option value="Carnaubal">Carnaubal</option>
            <option value="Croatá">Croatá</option>
          </select>
        </div>

        {/* Gatilho de Clima / Emergência */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300">Alerta de Clima na Serra</h3>
            <p className="text-xs text-slate-400">Ativa multiplicador de frete e ajuste de SLA em {selectedCity}.</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-semibold text-slate-300">Chuva / Neblina Intensa:</span>
            <button
              onClick={() => setRainMode(!rainMode)}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                rainMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {rainMode ? 'ATIVADO (+20% Frete)' : 'Desativado (Normal)'}
            </button>
          </div>
        </div>
      </div>

      {/* Indicadores Rápidos */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">Pedidos Hoje</span>
          <h4 className="text-2xl font-bold text-white mt-1">--</h4>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">Oficinas Ativas</span>
          <h4 className="text-2xl font-bold text-white mt-1">--</h4>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">Estafetas em Rota</span>
          <h4 className="text-2xl font-bold text-white mt-1">--</h4>
        </div>
      </div>
    </div>
  );
}
   <PartnerDashboard />
