
import React, { useState } from 'react';

// Cidades da Serra da Ibiapaba
const CITIES = ['Tianguá', 'Ubajara', 'Viçosa do Ceará', 'São Benedito', 'Guaraciaba do Norte', 'Ibiapina', 'Carnaubal', 'Croatá', 'Ipu'];

// Filtros por Categoria (Pills)
const CATEGORIES = ['Todos', 'Marmitas', 'Lanches', 'Doces & Licores', 'Hortifrúti', 'Bebidas'];

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
  category: string;
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

interface CartItem {
  product: Product;
  store: Store;
  quantity: number;
  notes: string;
}

const STORES: Store[] = [
  {
    id: 1,
    name: 'Restaurante Sabor da Serra',
    city: 'Tianguá',
    category: 'Marmitas',
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
        category: 'Marmitas',
        soldCount: 142
      },
      {
        id: 102,
        name: 'Carne de Sol com Macaxeira',
        price: 58.00,
        description: 'Servida na chapa com queijo coalho e manteiga da terra.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
        category: 'Marmitas',
        soldCount: 89
      }
    ]
  },
  {
    id: 2,
    name: 'Doces & Licores Artesanais',
    city: 'Viçosa do Ceará',
    category: 'Doces & Licores',
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
        category: 'Doces & Licores',
        soldCount: 310
      }
    ]
  }
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState('Tianguá');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile'>('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  
  // Modais e fluxo de compra
  const [modalProduct, setModalProduct] = useState<{ product: Product; store: Store } | null>(null);
  const [modalNotes, setModalNotes] = useState('');
  const [modalQty, setModalQty] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderTrackStatus, setOrderTrackStatus] = useState<number | null>(null);

  // Carrinho e Checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [cashChange, setCashChange] = useState('');
  const [address, setAddress] = useState({ rua: '', numero: '', bairro: '', pontoRef: '' });

  const openProductModal = (product: Product, store: Store) => {
    setModalProduct({ product, store });
    setModalNotes('');
    setModalQty(1);
  };

  const confirmAddToCart = () => {
    if (!modalProduct) return;
    const { product, store } = modalProduct;

    setCart(prev => {
      if (prev.length > 0 && prev[0].store.id !== store.id) {
        if (!window.confirm('O seu carrinho tem itens de outra loja. Deseja limpar para adicionar este produto?')) {
          return prev;
        }
        return [{ product, store, quantity: modalQty, notes: modalNotes }];
      }
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + modalQty, notes: modalNotes || item.notes } : item);
      }
      return [...prev, { product, store, quantity: modalQty, notes: modalNotes }];
    });

    setModalProduct(null);
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SERRA10') {
      setDiscount(10);
      alert('Cupom SERRA10 aplicado! Desconto de R$ 10,00 concedido.');
    } else {
      alert('Cupom inválido. Tente o código "SERRA10".');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? cart[0].store.fee : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleFinishOrder = () => {
    if (!address.rua || !address.bairro) {
      alert('Por favor, preencha a rua e o bairro para a entrega.');
      return;
    }

    setShowCheckout(false);
    setOrderTrackStatus(1);
    
    // Simulação de alteração do estado do pedido em tempo real
    setTimeout(() => setOrderTrackStatus(2), 4000);
    setTimeout(() => setOrderTrackStatus(3), 8000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', color: '#1F2937', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: '80px' }}>
      
      {/* CABEÇALHO SUPERIOR */}
      <header style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
            <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🔔</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: '10px', padding: '8px 12px', gap: '8px' }}>
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Pesquise pratos ou produtos da serra..." 
              style={{ width: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '13px', outline: 'none', color: '#1F2937' }}
            />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        
        {/* RASTREAMENTO DO PEDIDO EM TEMPO REAL */}
        {orderTrackStatus !== null ? (
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #10B981', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>🛵 Acompanhar Pedido</h2>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px 0' }}>{cart[0]?.store.name} • Entrega em {address.bairro}, {selectedCity}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              {[
                { step: 1, title: 'Pedido Confirmado', desc: 'A loja recebeu seu pedido' },
                { step: 2, title: 'Em Preparação', desc: 'O chefe está preparando seus pratos' },
                { step: 3, title: 'Saiu para Entrega', desc: 'O estafeta está a caminho do seu endereço' },
                { step: 4, title: 'Entregue', desc: 'Aproveite sua refeição!' }
              ].map(st => {
                const isCurrent = orderTrackStatus === st.step;
                const isDone = orderTrackStatus > st.step;
                return (
                  <div key={st.step} style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: isDone || isCurrent ? 1 : 0.4 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: isDone || isCurrent ? '#10B981' : '#D1D5DB', color: '#FFFFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '12px' }}>
                      {isDone ? '✓' : st.step}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: isCurrent ? '#10B981' : '#111827' }}>{st.title}</h4>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => { setOrderTrackStatus(null); setCart([]); setSelectedStore(null); }}
              style={{ width: '100%', marginTop: '20px', backgroundColor: '#EA1D2C', color: '#FFFFFF', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              Fazer Novo Pedido
            </button>
          </div>
        ) : !selectedStore ? (
          <div>
            
            {/* STORIES */}
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', marginBottom: '16px' }}>
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

            {/* FILTROS RÁPIDOS POR CATEGORIA */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', marginBottom: '20px' }}>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  style={{ backgroundColor: selectedCategory === cat ? '#EA1D2C' : '#FFFFFF', color: selectedCategory === cat ? '#FFFFFF' : '#4B5563', border: '1px solid #E5E7EB', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* OFERTAS RELÂMPAGO */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', marginBottom: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', margin: 0 }}>Ofertas Relâmpago</h3>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#FEF2F2', color: '#EF4444', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>Termina em 02:14:05</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {STORES[0].products.map(product => (
                  <div key={product.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #F3F4F6', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                      {product.oldPrice && (
                        <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1F2937', margin: '0 0 4px 0' }}>{product.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#10B981' }}>R$ {product.price.toFixed(2)}</span>
                        {product.oldPrice && <span style={{ fontSize: '10px', color: '#9CA3AF', textDecoration: 'line-through' }}>R$ {product.oldPrice.toFixed(2)}</span>}
                      </div>
                      <button 
                        onClick={() => openProductModal(product, STORES[0])}
                        style={{ width: '100%', marginTop: '8px', backgroundColor: '#EA1D2C', color: '#FFFFFF', border: 'none', padding: '7px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Opções
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LISTA DE LOJAS */}
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Lojas e Restaurantes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STORES.filter(s => selectedCategory === 'Todos' || s.category === selectedCategory).map(store => (
                <div 
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                >
                  <img src={store.logo} alt={store.name} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          /* CARDÁPIO DA LOJA */
          <div>
            <button onClick={() => setSelectedStore(null)} style={{ background: 'none', border: 'none', color: '#EA1D2C', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' }}>
              ← Voltar às lojas
            </button>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
              <div style={{ height: '120px', backgroundImage: `url(${selectedStore.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>{selectedStore.name}</h2>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 8px 0' }}>{selectedStore.category} • 📍 {selectedStore.city}</p>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Produtos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedStore.products.map(product => (
                <div key={product.id} onClick={() => openProductModal(product, selectedStore)} style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', gap: '12px', cursor: 'pointer' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>{product.name}</h4>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px 0' }}>{product.description}</p>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#10B981' }}>R$ {product.price.toFixed(2)}</span>
                  </div>
                  <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL DE CUSTOMIZAÇÃO DO PRODUTO */}
      {modalProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '600px', borderRadius: '20px 20px 0 0', padding: '20px', maxH: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>{modalProduct.product.name}</h3>
              <button onClick={() => setModalProduct(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
            </div>
            
            <img src={modalProduct.product.image} alt={modalProduct.product.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>{modalProduct.product.description}</p>

            <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>Observações para a cozinha:</label>
            <textarea 
              value={modalNotes} 
              onChange={(e) => setModalNotes(e.target.value)}
              placeholder="Ex: Tirar cebola, maionese à parte..."
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #D1D5DB', padding: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '4px 8px' }}>
                <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                <span style={{ fontWeight: '800', fontSize: '14px' }}>{modalQty}</span>
                <button onClick={() => setModalQty(modalQty + 1)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
              </div>

              <button 
                onClick={confirmAddToCart}
                style={{ backgroundColor: '#EA1D2C', color: '#FFFFFF', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}
              >
                Adicionar • R$ {(modalProduct.product.price * modalQty).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT COM ENDEREÇO E CUPOM */}
      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '600px', borderRadius: '20px 20px 0 0', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Finalizar Pedido</h3>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
            </div>

            {/* Endereço */}
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>📍 Endereço de Entrega</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <input type="text" placeholder="Rua / Avenida *" value={address.rua} onChange={e => setAddress({...address, rua: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                <input type="text" placeholder="Número" value={address.numero} onChange={e => setAddress({...address, numero: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px' }} />
                <input type="text" placeholder="Bairro *" value={address.bairro} onChange={e => setAddress({...address, bairro: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px' }} />
              </div>
            </div>

            {/* Cupom */}
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>🎟️ Cupom de Desconto</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input type="text" placeholder="Digite SERRA10" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px' }} />
              <button onClick={applyCoupon} style={{ backgroundColor: '#111827', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Aplicar</button>
            </div>

            {/* Forma de Pagamento */}
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>💳 Forma de Pagamento</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {(['pix', 'cartao', 'dinheiro'] as const).map(method => (
                <button key={method} onClick={() => setPaymentMethod(method)} style={{ flex: 1, padding: '8px', border: paymentMethod === method ? '2px solid #EA1D2C' : '1px solid #D1D5DB', backgroundColor: paymentMethod === method ? '#FEF2F2' : '#FFFFFF', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer' }}>
                  {method}
                </button>
              ))}
            </div>

            {/* Resumo */}
            <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Subtotal:</span><span>R$ {subtotal.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Taxa de Entrega:</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
              {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 'bold', marginBottom: '4px' }}><span>Desconto:</span><span>- R$ {discount.toFixed(2)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px', color: '#111827', marginTop: '8px', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}><span>Total:</span><span>R$ {total.toFixed(2)}</span></div>
            </div>

            <button onClick={handleFinishOrder} style={{ width: '100%', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}

      {/* BARRA FIXA DO CARRINHO */}
      {cart.length > 0 && !showCheckout && orderTrackStatus === null && (
        <div style={{ position: 'fixed', bottom: '65px', left: 0, right: 0, padding: '0 16px', zIndex: 30 }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#111827', color: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Total do pedido</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#10B981' }}>R$ {total.toFixed(2)}</span>
            </div>
            <button onClick={() => setShowCheckout(true)} style={{ backgroundColor: '#EA1D2C', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Ver Carrinho ({cart.reduce((a, b) => a + b.quantity, 0)})
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', padding: '8px 0', zIndex: 50 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'home' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>🏠</span>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Início</span>
          </button>
          <button onClick={() => setActiveTab('search')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'search' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Busca</span>
          </button>
          <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'orders' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Pedidos</span>
          </button>
          <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'profile' ? '#EA1D2C' : '#6B7280' }}>
            <span style={{ fontSize: '18px' }}>👤</span>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Perfil</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
