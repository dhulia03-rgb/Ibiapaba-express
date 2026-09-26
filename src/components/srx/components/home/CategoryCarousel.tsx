interface CategoryCarouselProps {
  mode: 'express' | 'shopping';
}

export function CategoryCarousel({ mode }: CategoryCarouselProps) {
  const categories =
    mode === 'express'
      ? ['🍔 Alimentação', '💊 Farmácia', '🏪 Conveniência', '☕ Bebidas', '🍰 Doces']
      : ['👕 Roupas', '👟 Calçados', '📱 Eletrônicos', '🏠 Casa', '💄 Beleza'];

  return (
    <section>
      <h2 className="mb-4 text-lg font-black text-gray-900">
        Categorias
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className="whitespace-nowrap rounded-full bg-orange-100 px-4 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-200"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}