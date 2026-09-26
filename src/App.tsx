import React, { useState } from 'react';

export default function App() {
  const [activeModule, setActiveModule] = useState('client');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header / Barra de Navegação do Super App */}
      <header className="bg-orange-600 shadow-lg border-b border-orange-500/30 px-4 py-3 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🚀</span>
          <h1 className="text-xl font-black tracking-wider text-white">IBIAPABA EXPRESS</h1>
        </div>
        
        {/* Seletor de Módulos */}
        <nav className="flex space-x-2 mt-2 sm:mt-0 overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveModule('client')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeModule === 'client' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-orange-700/60 text-white hover:bg-orange-700'}`}
          >
            🛒 Cliente
          </button>
          <button 
            onClick={() => setActiveModule('merchant')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeModule === 'merchant' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-orange-700/60 text-white hover:bg-orange-700'}`}
          >
            🏪 Lojista
          </button>
          <button 
            onClick={() => setActiveModule('delivery')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeModule === 'delivery' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-orange-700/60 text-white hover:bg-orange-700'}`}
          >
            🛵 Entregador
          </button>
          <button 
            onClick={() => setActiveModule('admin')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeModule === 'admin' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-orange-700/60 text-white hover:bg-orange-700'}`}
          >
            ⚙️ Admin
          </button>
        </nav>
      </header>

      {/* Conteúdo Dinâmico Baseado no Módulo Selecionado */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {activeModule === 'client' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Vitrine do Cliente</h2>
            <p className="text-slate-300">Explore os melhores estabelecimentos, mercados e farmácias da região da Ibiapaba.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-orange-500/20 hover:border-cyan-400 transition-all cursor-pointer">
                <h3 className="font-bold text-lg text-orange-400">Restaurante Sabor da Serra</h3>
                <p className="text-sm text-slate-400 mt-1">Comida típica • Entrega rápida</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-orange-500/20 hover:border-cyan-400 transition-all cursor-pointer">
                <h3 className="font-bold text-lg text-orange-400">Mercadão Ibiapaba</h3>
                <p className="text-sm text-slate-400 mt-1">Supermercado • Hortifrúti fresco</p>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'merchant' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Painel do Lojista</h2>
            <p className="text-slate-300">Gerencie seus produtos, cardápio e aprove os pedidos que chegam em tempo real.</p>
            <div className="bg-slate-800 p-5 rounded-xl border border-orange-500/20">
              <span className="inline-block bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold mb-2">Novo Pedido #102</span>
              <p className="text-slate-200">2x Frango à Passarinho + 1x Refrigerante 2L</p>
              <div className="mt-4 flex space-x-3">
                <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-all">Aceitar Pedido</button>
                <button className="bg-rose-500/20 text-rose-400 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-rose-500/30 transition-all">Recusar</button>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'delivery' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Radar do Entregador</h2>
            <p className="text-slate-300">Acompanhe as entregas disponíveis na sua rota e maximize seus ganhos.</p>
            <div className="bg-slate-800 p-5 rounded-xl border border-orange-500/20 flex justify-between items-center">
              <div>
                <p className="text-sm text-cyan-400 font-semibold">📍 Coleta: Centro → Entrega: Bairro de Fátima</p>
                <p className="text-lg font-bold text-white mt-1">Taxa de Entrega: R$ 8,00</p>
              </div>
              <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg transition-all">
                Aceitar Corrida
              </button>
            </div>
          </div>
        )}

        {activeModule === 'admin' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Torre de Comando (Admin)</h2>
            <p className="text-slate-300">Visão geral do ecossistema, lojistas ativos e volume de transações.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-orange-500/20">
                <p className="text-sm text-slate-400">Pedidos Hoje</p>
                <p className="text-2xl font-black text-orange-400 mt-1">48</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-orange-500/20">
                <p className="text-sm text-slate-400">Entregadores Online</p>
                <p className="text-2xl font-black text-cyan-400 mt-1">12</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-orange-500/20">
                <p className="text-sm text-slate-400">Faturamento Diário</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">R$ 1.840,00</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-center py-4 text-xs text-slate-500 border-t border-slate-800">
        Ibiapaba Express © 2026 • Todos os direitos reservados
      </footer>
    </div>
  );
}
