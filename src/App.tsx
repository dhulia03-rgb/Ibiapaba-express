import React, { useState } from 'react';

// 9 Cidades da Serra da Ibiapaba
const CITIES = [
  'Tianguá',
  'Ubajara',
  'Viçosa do Ceará',
  'São Benedito',
  'Guaraciaba do Norte',
  'Ibiapina',
  'Carnaubal',
  'Croatá',
  'Ipu'
];

// Stories Promocionais
const STORIES = [
  { id: 'cupons', title: 'Cupons', icon: '🎟️', badge: 'R$ 10', color: '#EF4444' },
  { id: 'frete', title: 'Frete $0', icon: '🛵', badge: 'Grátis', color: '#10B981' },
  { id: 'serra', title: 'Da Serra', icon: '🍓', badge: 'Locais', color: '#8B5CF6' },
  { id: 'flash', title: 'Ofertas', icon: '⚡', badge: '-40%', color: '#F59E0B' },
  { id: 'top', title: 'Famosos', icon: '⭐', badge: 'Top 10', color: '#3B82F6' },
];

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  soldCount?: number;
}

interface Store {
  id: number;
  name: string;
  city: string;
  category: string;
  rating: number;
  time: string;
  fee: number;
  logo: string;
  banner: string;
  products: Product[];
}

const STORES: Store[] = [
  {
    id: 1,
    name: 'Restaurante Sabor da Serra',
    city: 'Tianguá',
    category: 'Comida Regional • Brasileiras',
    rating: 4.9,
    time: '25-35 min',
    fee: 4.99,
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 101,
        name: 'Galinha Cabidela Completa',
        price: 42.90,
        oldPrice: 52.00,
        description: 'Acompanha arroz branco, pirão e salada fresca da serra.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
        soldCount: 142
      },
      {
        id: 102,
        name: 'Carne de Sol com Macaxeira',
        price: 58.00,
        description: 'Servida na chapa com queijo coalho e manteiga da terra.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
        soldCount: 89
      }
    ]
  },
  {
    id: 2,
    name: 'Doces & Licores Artesanais',
    city: 'Viçosa do Ceará',
    category: 'Produtos Regionais • Licores',
    rating: 5.0,
    time: '15-25 min',
    fee: 0.00,
    logo: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 201,
        name: 'Licor de Jabuticaba (500ml)',
        price: 24.90,
        oldPrice: 32.00,
        description: 'Produção artesanal tradicional das serras de Viçosa.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80',
        soldCount: 310
      }
    ]
  }
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState('Tianguá');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile'>('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<{ product: Product; store: Store; quantity: number }[]>([]);

  const addToCart = (product: Product, store: Store) => {
    setCart(prev => {
      if (prev.length > 0 && prev[0].store.id !== store.id) {
        if (!window.confirm('O seu carrinho tem itens de outra loja. Deseja limpar para adicionar este produto?')) {
          return prev;
        }
        return [{ product, store, quantity: 1 }];
      }
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, store, quantity: 1 }];
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? cart[0].store.fee : 0;
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', color: '#1F2937', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: '70px' }}>
      
      {/* CABEÇALHO SUPERIOR - TIPO IFOOD */}
      <header style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Seletor de Localização */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px', color: '#EA1D2C' }}>📍</span>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>Entregar em</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={{ backgroundColor: 'transparent', color: '#111827', border: 'none', fontWeight: '800', fontSize: '14px', outline: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c} • Ibiapaba</option>)}
                  </select>
                  <span style={{ fontSize: '10px', color: '#6B7280' }}>▼</span>
                </div>
              </div>
            </div>

            {/* Ícone de Notificação / Bell */}
            <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🔔</button>
          </div>

          {/* Barra de Pesquisa */}
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: '10px', padding: '8px 12px', gap: '8px' }}>
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Pesquise restaurantes ou produtos da serra..." 
              style={{ width: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '13px', outline: 'none', color: '#1F2937' }}
            />
          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        
        {!selectedStore ? (
          <div>
            
            {/* STORIES PROMOCIONAIS (ESTILO INSTAGRAM/IFOOD) */}
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', marginBottom: '20px' }}>
              {STORIES.map(story => (
                <div key={story.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, cursor: 'pointer' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', padding: '2px', border: `2px solid ${story.color}`, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: '26px' }}>{story.icon}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151', marginTop: '6px' }}>{story.title}</span>
                  <span style={{ fontSize: '9px', backgroundColor: story.color, color: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold', marginTop: '2px' }}>{story.badge}</span>
                </div>
              ))}
            </div>

            {/* BANNER PRINCIPAL */}
            <div style={{ backgroundColor: '#EA1D2C', borderRadius: '16px', padding: '20px', color: '#FFFFFF', marginBottom: '24px', backgroundImage: 'linear-gradient(135deg, #EA1D2C 0%, #C2410C 100%)', boxShadow: '0 4px 12px rgba(234, 29, 44, 0.25)' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Serra da Ibiapaba</span>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '8px 0 4px 0' }}>Sabores Locais na Sua Porta</h2>
              <p style={{ fontSize: '12px', color: '#FEE2E2', margin: 0 }}>Entregas rápidas em {selectedCity} e região.</p>
            </div>

            {/* SEÇÃO OFERTAS RELÂMPAGO (SHOPEE STYLE) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', marginBottom: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', margin: 0 }}>Ofertas Relâmpago</h3>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#FEF2F2', color: '#EF4444', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>Termina em 02:14:05</span>
              </div>

              {/* GRID 2 COLUNAS (SHOPEE) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {STORES[0].products.map(product => (
                  <div key={product.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #F3F4F6', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      {product.oldPrice && (
                        <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1F2937', margin: '0 0 4px 0', lineHeight: '1.3' }}>{product.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#10B981' }}>R$ {product.price.toFixed(2)}</span>
                        {product.oldPrice && <span style={{ fontSize: '10px', color: '#9CA3AF', textDecoration: 'line-through' }}>R$ {product.oldPrice.toFixed(2)}</span>}
                      </div>
                      <span style={{ fontSize: '10px', color: '#6B7280', marginTop: '4px', display: 'block' }}>🔥 {product.soldCount} vendidos</span>
                      <button 
                        onClick={() => addToCart(product, STORES[0])}
                        style={{ width: '100%', marginTop: '8px', backgroundColor: '#EA1D2C', color: '#FFFFFF', border: 'none', padding: '7px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LISTA DE LOJAS (IFOOD STYLE) */}
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
              Lojas e Restaurantes
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STORES.map(store => (
                <div 
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
                >
                  <img src={store.logo} alt={store.name} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>{store.name}</h4>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#D97706' }}>⭐ {store.rating}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 6px 0' }}>{store.category} • {store.city}</p>
                    <div style={{ fontSize: '12px', color: '#4B5563', display: 'flex', gap: '8px' }}>
                      <span>⏱️ {store.time}</span>
                      <span>•</span>
                      <span style={{ color: store.fee === 0 ? '#10B981' : '#4B5563', fontWeight: '600' }}>
                        {store.fee === 0 ? 'Grátis' : `R$ ${store.fee.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* PÁGINA DA LOJA / CARDÁPIO */
          <div>
            <button 
              onClick={() => setSelectedStore(null)}
              style={{ background: 'none', border: 'none', color: '#EA1D2C', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px', padding: 0 }}
            >
              ← Voltar às lojas
            </button>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
              <div style={{ height: '120px', backgroundImage: `url(${selectedStore.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>{selectedStore.name}</h2>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 8px 0' }}>{selectedStore.category} • 📍 {selectedStore.city}</p>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>Entrega: {selectedStore.fee === 0 ? 'Grátis' : `R$ ${selectedStore.fee.toFixed(2)}`} • {selectedStore.time}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Produtos em Destaque</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedStore.products.map(product => (
                <div key={product.id} style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>{product.name}</h4>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px 0', lineHeight: '1.3' }}>{product.description}</p>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#10B981' }}>R$ {product.price.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                    <button 
                      onClick={() => addToCart(product, selectedStore)}
                      style={{ backgroundColor: '#EA1D2C', color: '#FFFFFF', border: 'none', padding: '4px 12px', borderRadius: '6px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* PAINEL DO CARRINHO FLUTUANTE */}
      {cart.length > 0 && (
        <div style={{ position: 'fixed', bottom: '65px', left: 0, right: 0, padding: '0 16px', zIndex: 30 }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#111827', color: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Total sem entrega</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#10B981' }}>R$ {total.toFixed(2)}</span>
            </div>
            <button style={{ backgroundColor: '#EA1D2C', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Ver Carrinho ({cart.reduce((a, b) => a + b.quantity, 0)})
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGAÇÃO INFERIOR (ESTILO APP NATIVO) */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', padding: '8px 0', zIndex: 50 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          
          <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'home' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>🏠</span>
            <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>Início</span>
          </button>

          <button onClick={() => setActiveTab('search')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'search' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>Busca</span>
          </button>

          <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'orders' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>Pedidos</span>
          </button>

          <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'profile' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>👤</span>
            <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>Perfil</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
