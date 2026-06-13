// Blocos de apresentação reutilizados pelas telas de detalhe (drill-down).
// Mantêm o mesmo vocabulário visual das listas: rótulo discreto + valor legível.

export function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function Field({ label, children, mono = false }) {
  return (
    <div>
      <dt className="text-xs mb-0.5" style={{ color: '#6B7280' }}>{label}</dt>
      <dd
        className="text-sm"
        style={mono ? { fontFamily: "'JetBrains Mono', monospace", color: '#1F2937' } : { color: '#1F2937' }}
      >
        {children ?? <span style={{ color: '#9CA3AF' }}>—</span>}
      </dd>
    </div>
  );
}

const GRID_COLS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };

export function FieldGrid({ children, cols = 2 }) {
  return <dl className={`grid ${GRID_COLS[cols] || 'grid-cols-2'} gap-x-6 gap-y-4`}>{children}</dl>;
}

export function money(v) {
  if (v == null || v === '') return '—';
  return `R$ ${parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function dateTime(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function dateOnly(d) {
  if (!d) return '—';
  // valores DATEONLY vêm como 'YYYY-MM-DD' (ou ISO); evita deslocamento de fuso
  const iso = String(d).split('T')[0];
  const [y, m, dd] = iso.split('-');
  if (y && m && dd) return `${dd}/${m}/${y}`;
  return new Date(d).toLocaleDateString('pt-BR');
}

export function km(v) {
  if (v == null || v === '') return '—';
  return `${parseFloat(v).toLocaleString('pt-BR')} km`;
}
