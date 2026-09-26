import { useState } from 'react';
import { AdminControlPro } from './components/AdminControlPro';
import { PartnerDashboard } from './components/PartnerDashboard';

export default function App() {
  const [activePortal, setActivePortal] = useState<'client' | 'partner' | 'delivery' | 'admin'>('client');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Barra de Navegação Superior / Seletor de Portais */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛰️</span>
            <h1 className="text-lg font-black tracking-tight text-amber-400">Ibiapaba<span className="text-white">Express</span></h1>
          </div>

          {/* Seletor de Perfis / Portais */}
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActivePortal('client')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePortal === 'client' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛒 Clientes
            </button>
            <button
              onClick={() => setActivePortal('partner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePortal === 'partner' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏪 Empresas
            </button>
            <button
              onClick={() => setActivePortal('delivery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePortal === 'delivery' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛵 Entregador
            </button>
            <button
              onClick={() => setActivePortal('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePortal === 'admin' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛡️ Admin Geral
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo Dinâmico Baseado no Portal Selecionado */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {activePortal === 'client' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/20 p-6 rounded-2xl text-center">
              <h2 className="text-2xl font-black text-white mb-2">O melhor da Serra da Ibiapaba na sua porta</h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                Encomende comida, produtos locais e peças com entrega rápida e segura em Tianguá, Ubajara, Viçosa e região.
              </p>
            </div>
            {/* Aqui construiremos o catálogo de produtos e vitrine em breve */}
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">A carregar vitrine de comércios locais...</p>
            </div>
          </div>
        )}

        {activePortal === 'partner' && <PartnerDashboard />}

        {activePortal === 'delivery' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center py-12">
            <h3 className="text-lg font-bold text-amber-400 mb-2">Painel do Entregador</h3>
            <p className="text-xs text-slate-400">Módulo de rotas, aceitação de corridas e mapa logístico da serra em desenvolvimento.</p>
          </div>
        )}

        {activePortal === 'admin' && <AdminControlPro />}
      </main>
    </div>
  );
}
