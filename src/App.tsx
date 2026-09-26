import React, { useState } from 'react';

// 9 Cidades da Serra da Ibiapaba
const CITIES = [
  'Todas as Cidades',
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

// Stories Promocionais (Estilo Instagram / iFood)
const STORIES = [
  { id: 'cupons', title: 'Cupons', icon: '🎟️', badge: 'R$ 10 OFF', color: '#ea580c' },
  { id: 'frete', title: 'Frete $0', icon: '🛵', badge: 'Grátis', color: '#0284c7' },
  { id: 'serra', title: 'Da Serra', icon: '🍓', badge: 'Locais', color: '#16a34a' },
  { id: 'flash', title: 'Ofertas', icon: '⚡', badge: 'Até 40%', color: '#dc2626' },
  { id: 'top', title: 'Mais Pedidos', icon: '⭐', badge: 'Top 10', color: '#ca8a04' },
];

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  salesCount?: string;
}

interface Store {
  id: number;
  name: string;
  city: string;
  category: string;
  rating: number;
  time: string;
  fee: number;
  banner: string;
  products: Product[];
}

const MOCK_STORES: Store[] = [
  {
    id: 1,
    name: 'Restaurante Sabor da Serra',
    city: 'Tianguá',
    category: 'Comida Típica & Regional',
    rating: 4.9,
    time: '25-35 min',
    fee: 5.00,
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 101,
        name: 'Galinha Cabidela Completa',
        price: 42.00,
        oldPrice: 52.00,
        description: 'Acompanha arroz, pirão e salada fresca.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
        salesCount: '140+ vendidos'
      },
      {
        id: 102,
        name: 'Carne de Sol do Sertão',
        price: 65.00,
        description: 'Com macaxeira frita e queijo coalho.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
        salesCount: '98 vendidos'
      }
    ]
  },
  {
    id: 2,
    name: 'Doces & Licores de Viçosa',
    city: 'Viçosa do Ceará',
    category: 'Produtos da Serra',
    rating: 5.0,
    time: '20-30 min',
    fee: 0.00, // Frete Grátis
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 201,
        name: 'Licor de Jabuticaba (500ml)',
        price: 24.90,
        oldPrice: 32.00,
        description: 'Produção artesanal das serras de Viçosa.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80',
        salesCount: '310+ vendidos'
      }
    ]
  }
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState('Todas as Cidades');
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<{ product: Product; store: Store; quantity: number }[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (product: Product, store: Store) => {
    setCart(prev => {
      if (prev.length > 0 && prev[0].store.id !== store.id) {
        if (!window.confirm('Seu carrinho contém itens de outra loja. Deseja limpar para adicionar este produto?')) {
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

  const filteredStores = MOCK_STORES.filter(s => {
    const cityMatch = selectedCity === 'Todas as Cidades' || s.city === selectedCity;
    const storyMatch = !activeStory || (activeStory === 'frete' && s.fee === 0);
    return cityMatch && storyMatch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* TOP BAR ESTILO IFOOD */}
      <header style={{ backgroundColor: '#c2410c', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#fed7aa', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Entregar em:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <span style={{ fontSize: '14px' }}>📍</span>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ backgroundColor: 'transparent', color: '#ffffff', border: 'none', fontWeight: '900', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                >
                  {CITIES.map(c => <option key={c} value={c} style={{ backgroundColor: '#1e293b' }}>{c}</option>)}
                </select>
              </div>
            </div>

            {cart.length > 0 && !orderPlaced && (
              <div style={{ backgroundColor: '#22d3ee', color: '#030712', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
                🛒 R$ {total.toFixed(2)}
              </div>
            )}
          </div>

          <input 
            type="text" 
            placeholder="🔍 Buscar lanches, mercados ou produtos da serra..." 
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />

        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
        
        {orderPlaced ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid #34d399' }}>
            <span style={{ fontSize: '56px' }}>🎉</span>
            <h2 style={{ color: '#34d399', fontSize: '22px', marginTop: '12px' }}>Pedido Confirmado!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>Seu pedido foi enviado ao estabelecimento da Serra da Ibiapaba.</p>
            <button onClick={() => { setOrderPlaced(false); setSelectedStore(null); setCart([]); }} style={{ marginTop: '20px', backgroundColor: '#ea580c', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Voltar ao Início</button>
          </div>
        ) : !selectedStore ? (
          <div>
            
            {/* STORIES PROMOCIONAIS (INSTAGRAM / IFOOD STYLE) */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Destaques da Serra</p>
              <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                {STORIES.map(story => {
                  const isActive = activeStory === story.id;
                  return (
                    <div 
                      key={story.id} 
                      onClick={() => setActiveStory(isActive ? null : story.id)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', padding: '3px', background: isActive ? '#22d3ee' : `linear-gradient(135deg, ${story.color}, #f97316)`, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '26px' }}>
                          {story.icon}
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '6px', color: '#f8fafc' }}>{story.title}</span>
                      <span style={{ fontSize: '9px', backgroundColor: story.color, color: '#ffffff', padding: '1px 6px', borderRadius: '8px', marginTop: '2px', fontWeight: 'bold' }}>{story.badge}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEÇÃO OFERTAS RELÂMPAGO (SHOPEE STYLE) */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '16px', marginBottom: '24px', border: '1px solid #ea580c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '18px' }}>⚡</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#fb923c', margin: 0 }}>OFERTAS RELÂMPAGO</h3>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#dc2626', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>Termina em 01:45:22</span>
              </div>

              {/* GRID DE PRODUTOS SHOPEE (2 COLUNAS) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {MOCK_STORES[0].products.map(product => (
                  <div key={product.id} style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                      {product.oldPrice && (
                        <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#facc15', color: '#030712', fontSize: '10px', fontWeight: '900', padding: '2px 6px', borderRadius: '4px' }}>
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#f8fafc' }}>{product.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '900', color: '#34d399' }}>R$ {product.price.toFixed(2)}</span>
                        {product.oldPrice && <span style={{ fontSize: '11px', color: '#64748b', textDecoration: 'line-through' }}>R$ {product.oldPrice.toFixed(2)}</span>}
                      </div>
                      <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>🔥 {product.salesCount}</span>
                      <button 
                        onClick={() => addToCart(product, MOCK_STORES[0])}
                        style={{ width: '100%', marginTop: '8px', backgroundColor: '#22d3ee', color: '#030712', border: 'none', padding: '6px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LISTA DE LOJAS E RESTAURANTES */}
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#22d3ee', marginBottom: '12px' }}>
              Lojas Disponíveis ({filteredStores.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredStores.map(store => (
                <div 
                  key={store.id} 
                  onClick={() => setSelectedStore(store)}
                  style={{ backgroundColor: '#1e293b', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                >
                  <div style={{ height: '110px', backgroundImage: `url(${store.banner})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#22d3ee', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      📍 {store.city}
                    </span>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{store.name}</h4>
                      <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold' }}>⭐ {store.rating}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 8px 0' }}>{store.category}</p>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                      <span>⏱️ {store.time}</span> • <span style={{ color: store.fee === 0 ? '#34d399' : '#cbd5e1', fontWeight: 'bold' }}>{store.fee === 0 ? '🛵 Entrega Grátis' : `Entrega: R$ ${store.fee.toFixed(2)}`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* TELA DA LOJA / CARDÁPIO */
          <div>
            <button onClick={() => setSelectedStore(null)} style={{ background: 'none', border: 'none', color: '#22d3ee', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '14px' }}>
              ← Voltar para as lojas
            </button>
            <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedStore.name}</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>{selectedStore.category} • 📍 {selectedStore.city}</p>
            </div>
            
            <h3 style={{ fontSize: '16px', color: '#fb923c', marginBottom: '12px' }}>Cardápio</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedStore.products.map(product => (
                <div key={product.id} style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '14px' }}>{product.name}</h4>
                    <p style={{ margin: '2px 0 6px 0', fontSize: '11px', color: '#94a3b8' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#34d399', fontWeight: '900' }}>R$ {product.price.toFixed(2)}</span>
                      <button onClick={() => addToCart(product, selectedStore)} style={{ backgroundColor: '#22d3ee', color: '#030712', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>+ Adicionar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CARRINHO FIXO */}
            {cart.length > 0 && (
              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '2px solid #22d3ee', position: 'sticky', bottom: '16px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold' }}>
                  <span>Total do Pedido</span>
                  <span style={{ color: '#34d399' }}>R$ {total.toFixed(2)}</span>
                </div>
                <button onClick={() => setOrderPlaced(true)} style={{ width: '100%', backgroundColor: '#34d399', color: '#030712', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                  Finalizar Pedido
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      <footer style={{ backgroundColor: '#030712', textAlign: 'center', padding: '16px', fontSize: '12px', color: '#64748b', marginTop: '40px' }}>
        Ibiapaba Express © 2026 • O Super App da Serra da Ibiapaba
      </footer>
    </div>
  );
}
