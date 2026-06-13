import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

// Busca GET /endpoint/:id quando `id` é definido. Usado pelas telas de detalhe (drill-down).
export function useDetail(endpoint, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id == null) { setData(null); setError(null); return; }
    let active = true;
    setLoading(true);
    setError(null);
    api.get(`${endpoint}/${id}`)
      .then(res => { if (active) setData(res); })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [endpoint, id]);

  return { data, loading, error };
}
