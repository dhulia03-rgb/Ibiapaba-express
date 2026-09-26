import { ShoppingBag, Zap } from 'lucide-react';

interface ModeToggleProps {
  mode: 'express' | 'shopping';
  onModeChange: (mode: 'express' | 'shopping') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onModeChange('express')}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-black transition ${
              mode === 'express'
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Zap size={20} />
            Express
          </button>

          <button
            onClick={() => onModeChange('shopping')}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-black transition ${
              mode === 'shopping'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag size={20} />
            Shopping
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-gray-600">
          {mode === 'express'
            ? '⚡ Entrega rápida para o dia a dia'
            : '🛍️ Variedade e catálogo regional'}
        </p>
      </div>
    </section>
  );
}