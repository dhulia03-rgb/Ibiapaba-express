import React, { useState } from 'react';

// As 9 cidades da Serra da Ibiapaba
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

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: '🍽️' },
  { id: 'restaurante', name: 'Restaurantes', icon: '🍔' },
  { id: 'mercado', name: 'Supermercados', icon: '🛒' },
  { id: 'regional', name: 'Produtos da Serra', icon: '🍓' },
  { id: 'farmacia', name: 'Farmácias', icon: '💊' },
  { id: 'bebidas', name: 'Bebidas', icon: '🍺' },
];

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface Store {
  id: number;
  name: string;
  city: string;
  category: string;
  catId: string;
  rating: number;
  time: string;
  fee: number;
  isOpen: boolean;
  banner: string;
  products: Product[];
}

const MOCK_STORES: Store[] = [
  {
    id: 1,
    name: 'Restaurante Sabor da Serra',
    city: 'Tianguá',
    category: 'Comida Típica & Regional',
    catId: 'restaurante',
    rating: 4.9,
    time: '25-35 min',
    fee: 5.00,
    isOpen: true,
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 101,
        name: 'Galinha Cabidela Completa',
        price: 48.00,
        description: 'Receita tradicional da serra. Acompanha arroz branco, pirão e salada.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 102,
        name: 'Carne de Sol Ibiapaba',
        price: 65.00,
        description: 'Servida com macaxeira frita na hora, feijão verde e queijo coalho.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 2,
    name: 'Doces & Licores de Viçosa',
    city: 'Viçosa do Ceará',
    category: 'Produtos da Serra',
    catId: 'regional',
    rating: 5.0,
    time: '20-30 min',
    fee: 4.00,
    isOpen: true,
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 201,
        name: 'Licor Artesanal de Jabuticaba (500ml)',
        price: 28.00,
        description: 'Produção artesanal da serra com frutos selecionados.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 202,
        name: 'Geleia Caseira de Morango da Serra',
        price: 18.00,
        description: '100% natural sem conservantes, potinho de 250g.',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 3,
    name: 'Mercadão Hortifrúti Ubajara',
    city: 'Ubajara',
    category: 'Supermercado & Hortifrúti',
    catId: 'mercado',
    rating: 4.8,
    time: '15-25 min',
    fee: 3.50,
    isOpen: true,
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 301,
        name: 'Cesta Hortifrúti Fresca da Serra',
        price: 35.00,
        description: 'Tomate, morangos, verduras e legumes colhidos no dia.',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 4,
    name: 'Flores & Decoração São Benedito',
    city: 'São Benedito',
    category: 'Produtos da Serra',
    catId: 'regional',
    rating: 4.9,
    time: '30-40 min',
    fee: 6.00,
    isOpen: true,
    banner: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 401,
        name: 'Buquê de Rosas da Serra',
        price: 55.00,
        description: 'Rosas produzidas nas estufas de São Benedito.',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState('Todas as Cidades');
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<{ product: Product; store: Store; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Filtragem de lojas
  const filteredStores = MOCK_STORES.filter(store => {
    const matchesCity = selectedCity === 'Todas as Cidades' || store.city === selectedCity;
    const matchesCat = selectedCat === 'all' || store.catId === selectedCat;
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          store.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCat && matchesSearch;
  });

  // Gestão do Carrinho
  const addToCart = (product: Product, store: Store) => {
    setCart(prev => {
      // Se for de outra loja, reseta carrinho para manter integridade
      if (prev.length > 0 && prev[0].store.id !== store.id) {
        if (!window.confirm('Seu carrinho possui itens de outra loja. Deseja limpar para adicionar este item?')) {
          return prev;
        }
        return [{ product, store, quantity: 1 }];
      }
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, store, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as typeof prev;
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const currentStore = cart.length > 0 ? cart[0].store : selectedStore;
  const deliveryFee = currentStore ? currentStore.fee : 0;
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  const handleCheckout = () => {
    setOrderPlaced(true);
    setCart([]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Header com Marca e Seletor de Cidades */}
      <header style={{ backgroundColor: '#c2410c', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => { setSelectedStore(null); setOrderPlaced(false); }}
            >
              <span style={{ fontSize: '26px' }}>🚀</span>
              <div>
                <h1 style={{ fontSize: '19px', fontWeight: '900', letterSpacing: '0.5px', color: '#ffffff', margin: 0 }}>IBIAPABA EXPRESS</h1>
                <p style={{ fontSize: '11px', color: '#fed7aa', margin: 0, fontWeight: '500' }}>O Super App da Serra</p>
              </div>
            </div>

            {/* Contador de Carrinho Flutuante no Topo */}
            {cart.length > 0 && !orderPlaced && (
              <div 
                style={{ backgroundColor: '#22d3ee', color: '#030712', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                onClick={() => { if(selectedStore === null) setSelectedStore(cart[0].store); }}
              >
                🛒 <span>R$ {total.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Seletor Local da Cidade da Serra */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '6px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '14px' }}>📍</span>
            <span style={{ fontSize: '12px', color: '#fdba74', fontWeight: 'bold' }}>Cidade:</span>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ backgroundColor: 'transparent', color: '#ffffff', border: 'none', fontWeight: 'bold', fontSize: '13px', outline: 'none', width: '100%', cursor: 'pointer' }}
            >
              {CITIES.map(city => (
                <option key={city} value={city} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                  {city}
                </option>
              ))}
            </select>
          </div>

        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
        
        {orderPlaced ? (
          /* Tela de Sucesso do Pedido */
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid #34d399', marginTop: '20px' }}>
            <span style={{ fontSize: '56px' }}>🎉</span>
            <h2 style={{ color: '#34d399', fontSize: '22px', fontWeight: 'bold', marginTop: '12px' }}>Pedido Enviado com Sucesso!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>
              O estabelecimento na Serra da Ibiapaba recebeu a sua encomenda e um entregador parceiro fará a entrega em breve.
            </p>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', marginTop: '16px', display: 'inline-block', textAlign: 'left', fontSize: '13px', color: '#94a3b8' }}>
              <p style={{ margin: '0 0 4px 0', color: '#22d3ee', fontWeight: 'bold' }}>Pagamento Selecionado:</p>
              <p style={{ margin: 0, textTransform: 'uppercase', fontWeight: 'bold', color: '#ffffff' }}>
                {paymentMethod === 'pix' ? '⚡ Pix Direto' : paymentMethod === 'card' ? '💳 Cartão na Entrega' : '💵 Dinheiro com Troco'}
              </p>
            </div>
            <br />
            <button 
              onClick={() => { setOrderPlaced(false); setSelectedStore(null); }}
              style={{ marginTop: '24px', backgroundColor: '#ea580c', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              Voltar ao Início
            </button>
          </div>
        ) : !selectedStore ? (
          /* Vitrine e Lista de Lojas */
          <div>
            
            {/* Campo de Pesquisa Rápida */}
            <div style={{ marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="🔍 Pesquise restaurantes, produtos ou cidades..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Banner de Destaque da Região */}
            <div style={{ background: 'linear-gradient(135deg, #c2410c 0%, #0284c7 100%)', borderRadius: '16px', padding: '16px', color: '#ffffff', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Especial Serra da Ibiapaba</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '8px 0 4px 0' }}>Sabor & Qualidade Direto para Você</h2>
              <p style={{ fontSize: '12px', color: '#f0f9ff', margin: 0 }}>Entregas rápidas nas 9 cidades da região com os melhores comércios locais.</p>
            </div>

            {/* Carrossel de Categorias */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', border: 'none', backgroundColor: selectedCat === cat.id ? '#22d3ee' : '#1e293b', color: selectedCat === cat.id ? '#030712' : '#cbd5e1', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Título da Seção */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fdba74', margin: 0 }}>
                Estabelecimentos ({filteredStores.length})
              </h3>
              {selectedCity !== 'Todas as Cidades' && (
                <span style={{ fontSize: '12px', color: '#22d3ee' }}>Filtrado por: {selectedCity}</span>
              )}
            </div>

            {/* Lista de Estabelecimentos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredStores.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', backgroundColor: '#1e293b', borderRadius: '12px' }}>
                  <p style={{ fontSize: '15px', margin: '0 0 6px 0' }}>Nenhum estabelecimento encontrado.</p>
                  <p style={{ fontSize: '12px', margin: 0 }}>Tente mudar a cidade selecionada ou a categoria.</p>
                </div>
              ) : (
                filteredStores.map(store => (
                  <div 
                    key={store.id} 
                    onClick={() => setSelectedStore(store)}
                    style={{ backgroundColor: '#1e293b', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'transform 0.2s' }}
                  >
                    <div style={{ height: '110px', width: '100%', backgroundImage: `url(${store.banner})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#22d3ee', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                        📍 {store.city}
                      </span>
                    </div>

                    <div style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{store.name}</h4>
                        <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold' }}>⭐ {store.rating}</span>
                      </div>
                      
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>{store.category}</p>

                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#cbd5e1' }}>
                        <span>⏱️ {store.time}</span>
                        <span>•</span>
                        <span style={{ color: '#34d399', fontWeight: '600' }}>Entrega: R$ {store.fee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        ) : (
          /* Tela do Cardápio / Loja Selecionada */
          <div>
            <button 
              onClick={() => setSelectedStore(null)}
              style={{ background: 'none', border: 'none', color: '#22d3ee', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              ← Voltar para as lojas
            </button>

            {/* Cabeçalho da Loja */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #c2410c' }}>
              <div style={{ height: '130px', backgroundImage: `url(${selectedStore.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{selectedStore.name}</h2>
                  <span style={{ fontSize: '12px', backgroundColor: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                    📍 {selectedStore.city}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 10px 0' }}>{selectedStore.category} • ⭐ {selectedStore.rating}</p>
                <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                  Tempo de Entrega: {selectedStore.time} | Taxa: R$ {selectedStore.fee.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Lista de Produtos com Fotografia */}
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fdba74', marginBottom: '12px' }}>Produtos Disponíveis</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
              {selectedStore.products.map(product => (
                <div key={product.id} style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '14px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '85px', height: '85px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, backgroundColor: '#0f172a' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc', margin: '0 0 3px 0' }}>{product.name}</h4>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 8px 0', lineHeight: '1.3' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: '#34d399' }}>R$ {product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product, selectedStore)}
                        style={{ backgroundColor: '#22d3ee', color: '#030712', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Painel do Carrinho e Finalização */}
            {cart.length > 0 && (
              <div style={{ backgroundColor: '#0f172a', padding: '18px', borderRadius: '16px', border: '2px solid #22d3ee', position: 'sticky', bottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 12px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Seu Carrinho</span>
                  <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Loja: {cart[0].store.name}</span>
                </h4>

                {/* Itens com Controle de Quantidade */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', fontSize: '13px' }}>
                  {cart.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '8px 10px', borderRadius: '8px' }}>
                      <span style={{ color: '#ffffff', fontWeight: '500' }}>{item.product.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => updateQuantity(item.product.id, -1)} style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', width: '22px', height: '22px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                        <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', width: '22px', height: '22px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        <span style={{ color: '#34d399', fontWeight: 'bold', marginLeft: '6px' }}>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Forma de Pagamento */}
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold', margin: '0 0 6px 0' }}>Forma de Pagamento:</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setPaymentMethod('pix')}
                      style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: paymentMethod === 'pix' ? '#c2410c' : '#1e293b', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      ⚡ Pix
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: paymentMethod === 'card' ? '#c2410c' : '#1e293b', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      💳 Cartão
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: paymentMethod === 'cash' ? '#c2410c' : '#1e293b', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      💵 Dinheiro
                    </button>
                  </div>
                </div>

                {/* Resumo Financeiro */}
                <div style={{ fontSize: '13px', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '8px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Taxa de Entrega ({cart[0].store.city})</span>
                    <span>R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontWeight: 'bold', fontSize: '16px', borderTop: '1px solid #334155', paddingTop: '6px' }}>
                    <span>Total</span>
                    <span style={{ color: '#34d399' }}>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  style={{ width: '100%', backgroundColor: '#34d399', color: '#030712', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                >
                  Confirmar e Pedir Agora
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Rodapé */}
      <footer style={{ backgroundColor: '#030712', textAlign: 'center', padding: '16px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #1e293b', marginTop: '40px' }}>
        Ibiapaba Express © 2026 • Servindo as 9 Cidades da Serra da Ibiapaba
      </footer>
    </div>
  );
}
