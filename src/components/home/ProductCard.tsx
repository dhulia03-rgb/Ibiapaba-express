import { ShoppingCart, Star } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  delivery: string;
  store: string;
  category: string;
  mode: 'express' | 'shopping';
}

interface ProductCardProps extends Product {
  onAddToCart: () => void;
}

export function ProductCard({
  name,
  price,
  image,
  rating,
  delivery,
  store,
  category,
  mode,
  onAddToCart,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img
        src={image}
        alt={name}
        className="aspect-square w-full object-cover"
      />

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700">
            {category}
          </span>

          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {rating}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-gray-900">
          {name}
        </h3>

        <p className="text-[11px] text-gray-500">{store}</p>

        <strong className="text-xl font-black text-orange-600">
          R$ {price.toFixed(2).replace('.', ',')}
        </strong>

        <p className="text-xs font-bold text-cyan-600">
          {mode === 'express' ? '⚡' : '📦'} {delivery}
        </p>

        <button
          onClick={onAddToCart}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-black text-white transition hover:bg-orange-700"
        >
          <ShoppingCart size={16} />
          Comprar
        </button>
      </div>
    </article>
  );
}
