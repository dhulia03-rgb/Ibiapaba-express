import React from 'react';
import { Search, MapPin, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, onOpenCart }) => {
  const { cart } = useApp();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-3">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo / Localização */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Entregar em</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                Centro, Angra dos Reis
              </p>
            </div>
          </div>

          {/* Botão do Carrinho com Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* 🔍 Barra de Pesquisa com Lupa Funcional */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar lojas, reparações ou serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
