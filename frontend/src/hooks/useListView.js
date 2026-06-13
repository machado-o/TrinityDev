import { useState } from 'react';

// Busca + paginação no cliente para as listas de cadastro/operações.
// `getSearchText(row)` devolve o texto pesquisável da linha. Listas internas são pequenas,
// então filtrar a cada render é suficiente (sem memo).
export function useListView(data, getSearchText, perPage = 12) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? data.filter(r => String(getSearchText(r) ?? '').toLowerCase().includes(q))
    : data;

  const total = filtered.length;
  const totalPaginas = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPaginas);
  const pageItems = filtered.slice((current - 1) * perPage, current * perPage);
  const paginacao = { pagina: current, itensPorPagina: perPage, total, totalPaginas };

  return {
    query,
    setQuery: (v) => { setQuery(v); setPage(1); },
    page: current,
    setPage: (p) => setPage(Math.min(Math.max(1, p), totalPaginas)),
    pageItems,
    paginacao,
    isEmpty: total === 0,
    isFiltered: q.length > 0,
  };
}
