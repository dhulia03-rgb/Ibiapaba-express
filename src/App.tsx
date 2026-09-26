import React, { useState } from 'react';

// Tipos de dados
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
  category: string;
  time: string;
  fee: number;
  products: Product[];
}

const STORES: Store[] = [
  {
    id: 1,
    name: 'Restaurante Sabor da Serra',
    category: 'Comida Típica • Regional',
    time: '30-40 min',
    fee: 6.00,
    products: [
      { 
        id: 101, 
        name: 'Galinha Cabidela Completa', 
        price: 45.00, 
        description: 'Acompanha arroz, pirão e salada.', 
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80' 
      },
      { 
        id: 102, 
        name: 'Carne de Sol do Sertão (2 pessoas)', 
        price: 68.00, 
        description: 'Acompanha macaxeira frita e feijão verde.', 
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80' 
      },
      { 
        id: 103, 
        name: 'Refrigerante 2 Litros', 
        price: 12.00, 
        description: 'Coca-Cola ou Guaraná gelado.', 
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80' 
      }
    ]
  },
  {
    id: 2,
    name: 'Mercadão Ibiapaba',
    category: 'Supermercado • Hortifrúti',
    time: '20-30 min',
    fee: 4.50,
    products: [
      { 
        id: 201, 
        name: 'Cesta Básica Familiar', 
        price: 95.00, 
        description: 'Itens essenciais de primeira qualidade.', 
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80' 
      },
      { 
        id: 202, 
        name: 'Kg de Tomate Fresco', 
        price: 8.50, 
        description: 'Selecionados diretamente do produtor local.', 
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80' 
      },
      { 
        id: 203, 
        name: 'Água Mineral 20L', 
        price: 14.00, 
        description: 'Retirada e entrega rápida em casa.', 
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&auto=format&fit=crop&q=80' 
      }
    ]
  }
];

export default function App() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Adicionar ao carrinho
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Calcular total
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = selectedStore ? selectedStore.fee : 0;
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  const handleCheckout = () => {
    setOrderPlaced(true);
    setCart([]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <header style={{ backgroundColor: '#c2410c', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setSelectedStore(null); setOrderPlaced(false); }}>
          <span style={{ fontSize: '24px' }}>🚀</span>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', margin: 0 }}>IBIAPABA EXPRESS</h1>
            <p style={{ fontSize: '11px', color: '#fed7aa', margin: 0 }}>📍 Serra da Ibiapaba</p>
          </div>
        </div>
        
        {cart.length > 0 && !orderPlaced && (
          <div style={{ backgroundColor: '#22d3ee', color: '#030712', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
            🛒 {cart.reduce((sum, i) => sum + i.quantity, 0)} itens (R$ {total.toFixed(2)})
          </div>
        )}
      </header>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {orderPlaced ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #34d399' }}>
            <span style={{ fontSize: '48px' }}>✅</span>
            <h2 style={{ color: '#34d399', fontSize: '22px', marginTop: '12px' }}>Encomenda Realizada com Sucesso!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '8px' }}>O estabelecimento já recebeu o seu pedido e está a preparar. Acompanhe em breve no radar!</p>
            <button 
              onClick={() => { setOrderPlaced(false); setSelectedStore(null); }}
              style={{ marginTop: '20px', backgroundColor: '#c2410c', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Fazer Nova Compra
            </button>
          </div>
        ) : !selectedStore ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 6px 0' }}>O que deseja pedir hoje?</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Os melhores comércios da região direto para a sua porta.</p>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fb923c', marginBottom: '12px' }}>Estabelecimentos Disponíveis</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STORES.map(store => (
                <div 
                  key={store.id} 
                  onClick={() => setSelectedStore(store)}
                  style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.3)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>{store.name}</h4>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>{store.category}</p>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', padding: '3px 8px', borderRadius: '6px' }}>⏱️ {store.time} • Entrega R$ {store.fee.toFixed(2)}</span>
                  </div>
                  <span style={{ fontSize: '18px', color: '#fb923c' }}>➔</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setSelectedStore(null)}
              style={{ background: 'none', border: 'none', color: '#22d3ee', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              ← Voltar para as lojas
            </button>

            <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #c2410c' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>{selectedStore.name}</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{selectedStore.category} • Taxa: R$ {selectedStore.fee.toFixed(2)}</p>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fb923c', marginBottom: '12px' }}>Cardápio</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
              {selectedStore.products.map(product => (
                <div key={product.id} style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, backgroundColor: '#334155' }} 
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc', margin: '0 0 2px 0' }}>{product.name}</h4>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px 0', lineHeight: '1.2' }}>{product.description}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '900', color: '#34d399' }}>R$ {product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        style={{ backgroundColor: '#22d3ee', color: '#030712', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do Carrinho */}
            {cart.length > 0 && (
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid #22d3ee', position: 'sticky', bottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 10px 0' }}>O seu Carrinho</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', fontSize: '13px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', borderTop: '1px solid #1f2937', paddingTop: '6px', marginTop: '4px' }}>
                    <span>Taxa de Entrega</span>
                    <span>R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', paddingTop: '4px' }}>
                    <span>Total a Pagar</span>
                    <span style={{ color: '#34d399' }}>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  style={{ width: '100%', backgroundColor: '#34d399', color: '#030712', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                >
                  Finalizar Encomenda (WhatsApp / Pix)
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#030712', textAlign: 'center', padding: '14px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #1e293b' }}>
        Ibiapaba Express © 2026 • App do Cliente
      </footer>
    </div>
  );
}
