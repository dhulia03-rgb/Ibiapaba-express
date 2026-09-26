import { useState } from 'react';
import { MapPin, ShoppingCart, User } from 'lucide-react';
import { ModeToggle } from './home/ModeToggle';
import { SearchBar } from './home/SearchBar';
import { PromoBanner } from './home/PromoBanner';
import { CategoryCarousel } from './home/CategoryCarousel';
import { ProductGrid } from './home/ProductGrid';
import type { Product } from './home/ProductCard';
import { CartDrawer } from './home/CartDrawer';

export interface CartItem extends Product {
  quantity: number;
}

export function Home() {
  const [mode, setMode] = useState<'express' | 'shopping'>('express');
  const [selectedCity, setSelectedCity] = useState('Tianguá');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function addToCart(product: Product) {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(productId: string, change: number) {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + change } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">⛰️</span>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-sm sm:text-base font-black tracking-tight leading-none">
                <span className="text-orange-600">Ibiapaba</span>
                <span className="text-gray-900">Express</span>
              </h1>

              <div className="flex items-center gap-1 text-[11px] text-gray-600">
                <MapPin size={11} className="flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-none focus:outline-none cursor-pointer font-medium"
                >
                  <option value="Tianguá">Tianguá</option>
                  <option value="Ubajara">Ubajara</option>
                  <option value="Ibiapina">Ibiapina</option>
                  <option value="São Benedito">São Benedito</option>
                  <option value="Carnaubal">Carnaubal</option>
                  <option value="Croatá">Croatá</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button aria-label="Perfil" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <User size={20} className="text-gray-700" strokeWidth={1.5} />
            </button>
            <button aria-label="Abrir carrinho" onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart size={20} className="text-gray-700" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        city={selectedCity}
      />

      <ModeToggle mode={mode} onModeChange={setMode} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <PromoBanner mode={mode} />
        <CategoryCarousel mode={mode} />
        <ProductGrid
          mode={mode}
          searchQuery={searchQuery}
          city={selectedCity}
          onAddToCart={addToCart}
        />
      </main>

      <div className="h-8" />

      {isCartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onChangeQuantity={changeQuantity}
        />
      )}
    </div>
  );
}