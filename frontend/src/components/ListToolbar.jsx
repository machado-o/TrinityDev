import { Search } from 'lucide-react';

// Barra de busca das listas. Largura controlada para não competir com o título/CTA.
export default function ListToolbar({ query, onQuery, placeholder = 'Buscar…', total }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search
          className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#9CA3AF' }}
        />
        <input
          className="field-input"
          style={{ paddingLeft: '2.25rem' }}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Buscar na lista"
        />
      </div>
      {total != null && (
        <span className="text-xs whitespace-nowrap" style={{ color: '#6B7280' }}>
          {total} registro{total === 1 ? '' : 's'}
        </span>
      )}
    </div>
  );
}
