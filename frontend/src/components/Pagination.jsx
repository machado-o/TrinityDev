import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ paginacao, onChange }) {
  if (!paginacao || paginacao.totalPaginas <= 1) return null;
  const { pagina, totalPaginas, total, itensPorPagina } = paginacao;
  const start = (pagina - 1) * itensPorPagina + 1;
  const end = Math.min(pagina * itensPorPagina, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#E7E5E4' }}>
      <p className="text-xs" style={{ color: '#6B7280' }}>
        {start}–{end} de {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
          className="p-1.5 rounded transition-colors hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs px-2" style={{ color: '#6B7280' }}>
          {pagina} / {totalPaginas}
        </span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => onChange(pagina + 1)}
          className="p-1.5 rounded transition-colors hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
