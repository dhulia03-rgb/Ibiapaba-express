import React, { useState } from 'react';

// Cidades da Serra da Ibiapaba
const CITIES = ['Tianguá', 'Ubajara', 'Viçosa do Ceará', 'São Benedito', 'Guaraciaba do Norte', 'Ibiapina', 'Carnaubal', 'Croatá', 'Ipu'];

// Filtros por Categoria Expandidos
const CATEGORIES = [
  'Todos',
  'Marmitas',
  'Lanches',
  'Doces & Licores',
  'Roupas & Moda',
  'Produtos Gerais',
  'Autopeças',
  'Assistência Técnica 🛠️'
];

// Stories Promocionais
const STORIES = [
  { id: 'cupons', title: 'Cupons', icon: '🎟️', badge: 'R$ 10', color: '#EF4444' },
  { id: 'leva_traz', title: 'Leva e Traz', icon: '🛵', badge: 'Serviço', color: '#3B82F6' },
  { id: 'auto', title: 'Autopeças', icon: '⚙️', badge: 'Rápido', color: '#6B7280' },
  { id: 'moda', title: 'Vestuário', icon: '👕', badge: 'Nova Coleção', color: '#EC4899' },
  { id: 'serra', title: 'Da Serra', icon: '🍓', badge: 'Locais', color: '#8B5CF6' },
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
  isService?: boolean; // Para serviços de reparo/manutenção
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
  isPickupService?: boolean; // Sinaliza o modelo 'Leva e Traz'
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
      }
    ]
  },
  {
    id: 2,
    name: 'TechSerra Assistência & Celulares',
    city: 'Tianguá',
    category: 'Assistência Técnica 🛠️',
    rating: 4.9,
    time: 'Coleta em até 40 min',
    fee: 0.00,
    isPickupService: true, // LEVA E TRAZ
    logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 201,
        name: 'Troca de Ecrã / Tela de Smartphone',
        price: 150.00,
        description: 'Buscamos o seu telemóvel em casa, fazemos a troca do ecrã e devolvemos no mesmo dia com garantia.',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
        category: 'Assistência Técnica 🛠️',
        isService: true
      },
      {
        id: 202,
        name: 'Formatagem e Limpeza de Portátil',
        price: 90.00,
        description: 'Recolha ao domicílio em Tianguá e Ubajara. Inclui backup e instalação de antivírus.',
        image: 'https://images.unsplash.com/photo-1588702547923-7093a6c36452?w=400&auto=format&fit=crop&q=80',
        category: 'Assistência Técnica 🛠️',
        isService: true
      }
    ]
  },
  {
    id: 3,
    name: 'Boutique Serra Elegante',
    city: 'Ubajara',
    category: 'Roupas & Moda',
    rating: 4.8,
    time: '20-30 min',
    fee: 3.50,
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 301,
        name: 'Casaco Frio de Tricô Serra',
        price: 119.90,
        oldPrice: 149.90,
        description: 'Ideal para o clima ameno de Ubajara e Viçosa. Tamanhos P, M e G disponíveis.',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&auto=format&fit=crop&q=80',
        category: 'Roupas & Moda'
      }
    ]
  },
  {
    id: 4,
    name: 'Ibiapaba Autopeças & Moto',
    city: 'São Benedito',
    category: 'Autopeças',
    rating: 4.7,
    time: '30-45 min',
    fee: 5.00,
    logo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 401,
        name: 'Óleo de Motor 20W50 (1 Litro)',
        price: 32.00,
        description: 'Óleo mineral lubrificante de alta qualidade para carros e motos.',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=80',
        category: 'Autopeças'
      },
      {
        id: 402,
        name: 'Bateria para Moto 6Ah Gel',
        price: 185.00,
        description: 'Pronta para uso com garantia de 12 meses do fabricante.',
        image: 'https://images.unsplash.com/photo-1620021617242-b3021a258457?w=400&auto=format&fit=crop&q=80',
        category: 'Autopeças'
      }
    ]
  },
  {
    id: 5,
    name: 'Variedades & Casa Ibiapaba',
    city: 'Viçosa do Ceará',
    category: 'Produtos Gerais',
    rating: 4.9,
    time: '15-25 min',
    fee: 0.00,
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 501,
        name: 'Carregador Rápido USB-C 20W',
        price: 49.90,
        description: 'Carregamento turbo compatível com iPhone e Android.',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
        category: 'Produtos Gerais'
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
        if (!window.confirm('O seu carrinho tem itens de outra loja. Deseja limpar para adicionar este item?')) {
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
      alert('Por favor, preencha a rua e o bairro para a entrega ou recolha.');
      return;
    }

    setShowCheckout(false);
    setOrderTrackStatus(1);
    
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
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>Localização na Serra</span>
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
              placeholder="Buscar comida, roupas, autopeças ou assistência..." 
              style={{ width: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '13px', outline: 'none', color: '#1F2937' }}
            />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        
        {/* RASTREAMENTO DO PEDIDO / SERVIÇO */}
        {orderTrackStatus !== null ? (
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #10B981', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
              {cart[0]?.store.isPickupService ? '🛵 Status do Serviço Leva e Traz' : '🛵 Acompanhar Pedido'}
            </h2>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px 0' }}>{cart[0]?.store.name} • Endereço: {address.bairro}, {selectedCity}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { step: 1, title: cart[0]?.store.isPickupService ? 'Solicitação Aceite' : 'Pedido Confirmado', desc: 'A loja/empresa recebeu o seu pedido' },
                { step: 2, title: cart[0]?.store.isPickupService ? 'Estafeta em Cursão para Recolha' : 'Em Preparação / Separação', desc: cart[0]?.store.isPickupService ? 'O estafeta está a caminho do seu endereço para recolher o item' : 'Os itens estão a ser preparados' },
                { step: 3, title: cart[0]?.store.isPickupService ? 'Na Assistência em Reparo' : 'Saiu para Entrega', desc: cart[0]?.store.isPickupService ? 'Equipamento a ser analisado na oficina' : 'O estafeta está a caminho do seu endereço' },
                { step: 4, title: 'Concluído com Sucesso', desc: 'Obrigado por utilizar a nossa plataforma!' }
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
              Voltar ao Início
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

            {/* LISTA DE LOJAS E EMPRESAS */}
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Estabelecimentos na Serra</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STORES.filter(s => selectedCategory === 'Todos' || s.category === selectedCategory).map(store => (
                <div 
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
                >
                  <img src={store.logo} alt={store.name} style={{ width: '68px', height: '68px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>{store.name}</h4>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#D97706' }}>⭐ {store.rating}</span>
                    </div>

                    {/* SELO DE MODELO LEVA E TRAZ PARA ASSISTÊNCIA TÉCNICA */}
                    {store.isPickupService && (
                      <span style={{ display: 'inline-block', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                        🛵 SERVIÇO LEVA E TRAZ (BUSCAMOS EM CASA)
                      </span>
                    )}

                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 6px 0' }}>{store.category} • {store.city}</p>
                    <div style={{ fontSize: '12px', color: '#4B5563', display: 'flex', gap: '8px' }}>
                      <span>⏱️ {store.time}</span>
                      <span>•</span>
                      <span style={{ color: store.fee === 0 ? '#10B981' : '#4B5563', fontWeight: '600' }}>
                        {store.fee === 0 ? 'Taxa Grátis' : `R$ ${store.fee.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* CATÁLOGO DA LOJA SELECIONADA */
          <div>
            <button onClick={() => setSelectedStore(null)} style={{ background: 'none', border: 'none', color: '#EA1D2C', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' }}>
              ← Voltar às lojas
            </button>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
              <div style={{ height: '120px', backgroundImage: `url(${selectedStore.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>{selectedStore.name}</h2>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 8px 0' }}>{selectedStore.category} • 📍 {selectedStore.city}</p>
                
                {selectedStore.isPickupService && (
                  <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🛵</span>
                    <span>Ao solicitar este serviço, o estafeta irá até ao seu endereço em {selectedStore.city} para recolher o item.</span>
                  </div>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Produtos / Serviços Disponíveis</h3>
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

      {/* MODAL DE CUSTOMIZAÇÃO DO PRODUTO / DETALHES DO SERVIÇO */}
      {modalProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '600px', borderRadius: '20px 20px 0 0', padding: '20px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>{modalProduct.product.name}</h3>
              <button onClick={() => setModalProduct(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
            </div>
            
            <img src={modalProduct.product.image} alt={modalProduct.product.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>{modalProduct.product.description}</p>

            <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
              {modalProduct.product.isService ? 'Descreva o problema do aparelho / observações:' : 'Observações:'}
            </label>
            <textarea 
              value={modalNotes} 
              onChange={(e) => setModalNotes(e.target.value)}
              placeholder={modalProduct.product.isService ? "Ex: Ecrã partido após queda, telemóvel não liga..." : "Ex: Tamanho da peça, cor..."}
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

      {/* CHECKOUT COM RECOLHA / ENTREGA E PAGAMENTO */}
      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '600px', borderRadius: '20px 20px 0 0', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Finalizar {cart[0]?.store.isPickupService ? 'Solicitação de Serviço' : 'Pedido'}</h3>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
            </div>

            {/* Endereço */}
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
              📍 {cart[0]?.store.isPickupService ? 'Endereço para Recolha do Equipamento' : 'Endereço de Entrega'}
            </h4>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>{cart[0]?.store.isPickupService ? 'Taxa Leva e Traz:' : 'Taxa de Entrega:'}</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
              {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 'bold', marginBottom: '4px' }}><span>Desconto:</span><span>- R$ {discount.toFixed(2)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px', color: '#111827', marginTop: '8px', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}><span>Total:</span><span>R$ {total.toFixed(2)}</span></div>
            </div>

            <button onClick={handleFinishOrder} style={{ width: '100%', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
              Confirmar {cart[0]?.store.isPickupService ? 'Recolha ao Domicílio' : 'Pedido'}
            </button>
          </div>
        </div>
      )}

      {/* BARRA FIXA DO CARRINHO */}
      {cart.length > 0 && !showCheckout && orderTrackStatus === null && (
        <div style={{ position: 'fixed', bottom: '65px', left: 0, right: 0, padding: '0 16px', zIndex: 30 }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#111827', color: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Total acumulado</span>
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
