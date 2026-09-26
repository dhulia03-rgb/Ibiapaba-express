import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  city: string;
}

export function SearchBar({ value, onChange, city }: SearchBarProps) {
  return (
    <section className="border-b border-gray-200 bg-gradient-to-b from-orange-50 to-slate-50 px-4 py-5">
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
          />

          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Buscar produtos, lojas e ofertas..."
            className="w-full rounded-2xl border-2 border-cyan-500 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <p className="mt-2 text-xs text-gray-600">
          🏘️ Buscando em <strong className="text-gray-900">{city}</strong> e região
        </p>
      </div>
    </section>
  );
}
