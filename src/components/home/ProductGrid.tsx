import { Product, ProductCard } from './ProductCard';

interface ProductGridProps {
  mode: 'express' | 'shopping';
  searchQuery: string;
  city: string;
  onAddToCart: () => void;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Açaí da Serra 300ml',
    price: 18.9,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600',
    rating: 4.8,
    delivery: 'Entrega hoje',
    store: 'Açaí do João',
    category: 'Alimentação',
    mode: 'express',
  },
  {
    id: '2',
    name: 'Marmita Caseira de Frango',
    price: 22.5,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    rating: 4.9,
    delivery: '15 minutos',
    store: 'Comidas da Ibiapaba',
    category: 'Alimentação',
    mode: 'express',
  },
  {
    id: '3',
    name: 'Camiseta Serra da Ibiapaba',
    price: 59.9,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    rating: 4.6,
    delivery: '2 a 3 dias',
    store: 'Moda Regional',
    category: 'Roupas',
    mode: 'shopping',
  },
  {
    id: '4',
    name: 'Fone Bluetooth Sem Fio',
    price: 189.9,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    rating: 4.5,
    delivery: '2 a 4 dias',
    store: 'TechCenter Ibiapaba',
    category: 'Eletrônicos',
    mode: 'shopping',
  },
];

export function ProductGrid({
  mode,
  searchQuery,
  onAddToCart,
}: ProductGridProps) {
  const search = searchQuery.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesMode = product.mode === mode;
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.store.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesMode && matchesSearch;
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-900">
          {mode === 'express' ? '⚡ Disponível agora' : '🛍️ Mais vendidos'}
        </h2>

        <span className="text-xs text-gray-500">
          {filteredProducts.length} produtos
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
