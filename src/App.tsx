import React, { useState } from 'react';

export default function App() {
  const [activeModule, setActiveModule] = useState('client');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* Header / Barra de Navegação do Super App */}
      <header style={{ backgroundColor: '#c2410c', borderBottom: '1px solid rgba(249, 115, 22, 0.3)', padding: '12px 16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🚀</span>
          <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px', color: '#ffffff', margin: 0 }}>IBIAPABA EXPRESS</h1>
        </div>
        
        {/* Seletor de Módulos */}
        <nav style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button 
            onClick={() => setActiveModule('client')}
            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: activeModule === 'client' ? '#22d3ee' : '#9a3412', color: activeModule === 'client' ? '#030712' : '#ffffff', transition: 'all 0.2s' }}
          >
            🛒 Cliente
          </button>
          <button 
            onClick={() => setActiveModule('merchant')}
            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: activeModule === 'merchant' ? '#22d3ee' : '#9a3412', color: activeModule === 'merchant' ? '#030712' : '#ffffff', transition: 'all 0.2s' }}
          >
            🏪 Lojista
          </button>
          <button 
            onClick={() => setActiveModule('delivery')}
            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: activeModule === 'delivery' ? '#22d3ee' : '#9a3412', color: activeModule === 'delivery' ? '#030712' : '#ffffff', transition: 'all 0.2s' }}
          >
            🛵 Entregador
          </button>
          <button 
            onClick={() => setActiveModule('admin')}
            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: activeModule === 'admin' ? '#22d3ee' : '#9a3412', color: activeModule === 'admin' ? '#030712' : '#ffffff', transition: 'all 0.2s' }}
          >
            ⚙️ Admin
          </button>
        </nav>
      </header>

      {/* Conteúdo Dinâmico Baseado no Módulo Selecionado */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {activeModule === 'client' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>Vitrine do Cliente</h2>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px' }}>Explore os melhores estabelecimentos, mercados e farmácias da região da Ibiapaba.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '8px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#fb923c', margin: '0 0 6px 0' }}>Restaurante Sabor da Serra</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Comida típica • Entrega rápida</p>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#fb923c', margin: '0 0 6px 0' }}>Mercadão Ibiapaba</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Supermercado • Hortifrúti fresco</p>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'merchant' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>Painel do Lojista</h2>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px' }}>Gerencie seus produtos, cardápio e aprove os pedidos que chegam em tempo real.</p>
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
              <span style={{ display: 'inline-block', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600', marginBottom: '10px' }}>Novo Pedido #102</span>
              <p style={{ color: '#f1f5f9', margin: '0 0 16px 0', fontSize: '15px' }}>2x Frango à Passarinho + 1x Refrigerante 2L</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ backgroundColor: '#06b6d4', color: '#030712', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', border: 'none', cursor: 'pointer' }}>Aceitar Pedido</button>
                <button style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', border: 'none', cursor: 'pointer' }}>Recusar</button>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'delivery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>Radar do Entregador</h2>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px' }}>Acompanhe as entregas disponíveis na sua rota e maximize seus ganhos.</p>
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#22d3ee', fontWeight: '600', margin: '0 0 4px 0' }}>📍 Coleta: Centro → Entrega: Bairro de Fátima</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Taxa de Entrega: R$ 8,00</p>
              </div>
              <button style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 'bold', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                Aceitar Corrida
              </button>
            </div>
          </div>
        )}

        {activeModule === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>Torre de Comando (Admin)</h2>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px' }}>Visão geral do ecossistema, lojistas ativos e volume de transações.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 4px 0' }}>Pedidos Hoje</p>
                <p style={{ fontSize: '24px', fontWeight: '900', color: '#fb923c', margin: 0 }}>48</p>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 4px 0' }}>Entregadores Online</p>
                <p style={{ fontSize: '24px', fontWeight: '900', color: '#22d3ee', margin: 0 }}>12</p>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 4px 0' }}>Faturamento Diário</p>
                <p style={{ fontSize: '24px', fontWeight: '900', color: '#34d399', margin: 0 }}>R$ 1.840,00</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#030712', textAlign: 'center', padding: '16px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #1e293b', marginTop: 'auto' }}>
        Ibiapaba Express © 2026 • Todos os direitos reservados
      </footer>
    </div>
  );
}
