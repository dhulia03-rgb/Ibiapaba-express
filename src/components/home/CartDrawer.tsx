import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import type { CartItem } from '../Home';

interface CartDrawerProps {
  items: CartItem[];
  onClose: () => void;
  onChangeQuantity: (productId: string, change: number) => void;
}

export function CartDrawer({
  items,
  onClose,
  onChangeQuantity,
}: CartDrawerProps) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40"
      onClick={onClose}
    >
      <aside
        className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Seu carrinho
            </h2>
            <p className="text-xs text-gray-500">
              Confira seus produtos
            </p>
          </div>

          <button
            aria-label="Fechar carrinho"
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={48} className="mb-4 text-gray-300" />

            <h3 className="font-bold text-gray-800">
              Seu carrinho está vazio
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Adicione um produto para começar.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border-b border-gray-100 pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {item.store}
                    </p>

                    <strong className="text-orange-600">
                      R${' '}
                      {(item.price * item.quantity)
                        .toFixed(2)
                        .replace('.', ',')}
                    </strong>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        aria-label="Diminuir quantidade"
                        onClick={() => onChangeQuantity(item.id, -1)}
                        className="rounded-lg bg-gray-100 p-1"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="text-sm font-bold">
                        {item.quantity}
                      </span>

                      <button
                        aria-label="Aumentar quantidade"
                        onClick={() => onChangeQuantity(item.id, 1)}
                        className="rounded-lg bg-gray-100 p-1"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-gray-200 p-5">
              <div className="mb-4 flex justify-between text-lg font-black">
                <span>Total</span>

                <span className="text-orange-600">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button className="w-full rounded-xl bg-orange-600 py-3 font-black text-white hover:bg-orange-700">
                Continuar para pagamento
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
