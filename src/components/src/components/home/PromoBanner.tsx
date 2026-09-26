interface PromoBannerProps {
  mode: 'express' | 'shopping';
}

export function PromoBanner({ mode }: PromoBannerProps) {
  const isExpress = mode === 'express';

  return (
    <section>
      <h2 className="mb-4 text-lg font-black text-gray-900">
        Ofertas em destaque
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <article
          className={`rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg ${
            isExpress
              ? 'from-cyan-500 to-blue-600'
              : 'from-orange-500 to-red-600'
          }`}
        >
          <p className="text-2xl">{isExpress ? '⚡' : '🛍️'}</p>

          <h3 className="mt-2 text-xl font-black">
            {isExpress ? 'Entrega rápida' : 'Comércio regional'}
          </h3>

          <p className="mt-2 text-sm opacity-90">
            {isExpress
              ? 'Produtos do dia a dia entregues em minutos.'
              : 'Encontre produtos e ofertas da Serra da Ibiapaba.'}
          </p>

          <button className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900">
            Ver ofertas
          </button>
        </article>

        <article className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
          <p className="text-2xl">📍</p>
          <h3 className="mt-2 text-xl font-black">Compre local</h3>
          <p className="mt-2 text-sm opacity-90">
            Valorize os lojistas e parceiros da sua cidade.
          </p>
          <button className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900">
            Explorar
          </button>
        </article>
      </div>
    </section>
  );
}