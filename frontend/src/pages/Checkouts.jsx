import { useState, useEffect } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { useCrud } from '../hooks/useCrud.js';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';

const EMPTY = {
  checkinId: '', funcionarioId: '', dataCheckout: '', quilometragemCheckout: '',
  nivelCombustivel: 'Alto', condicaoPneus: 'Bom', condicaoPalhetas: 'Boas',
  limpoInternamente: true, limpoExternamente: true, observacoes: '', avariaIds: [],
};

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function Checkouts() {
  const { data, loading, refetch } = useCrud('/checkouts');
  const { data: checkins } = useCrud('/checkins');
  const { data: funcionarios } = useCrud('/funcionarios');
  const { data: avarias } = useCrud('/avarias');
  const toast = useToast();

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [kmError, setKmError] = useState('');

  const checkinsSemCheckout = checkins.filter(c => !c.checkout && c.reserva?.status === 'Confirmada');

  const F = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const FB = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.checked }));

  useEffect(() => {
    if (!form.checkinId) { setSelectedCheckin(null); return; }
    const c = checkins.find(x => x.id === parseInt(form.checkinId));
    setSelectedCheckin(c || null);
    setKmError('');
  }, [form.checkinId, checkins]);

  const validateKm = () => {
    if (!selectedCheckin || !form.quilometragemCheckout) return;
    if (parseFloat(form.quilometragemCheckout) <= parseFloat(selectedCheckin.quilometragemCheckin)) {
      setKmError(`Deve ser maior que ${parseFloat(selectedCheckin.quilometragemCheckin).toLocaleString('pt-BR')} km (quilometragem no check-in).`);
    } else {
      setKmError('');
    }
  };

  const toggleAvaria = (id) => {
    setForm(p => ({
      ...p,
      avariaIds: p.avariaIds.includes(id) ? p.avariaIds.filter(x => x !== id) : [...p.avariaIds, id],
    }));
  };

  const save = async () => {
    validateKm();
    if (kmError) return;
    setSaving(true);
    try {
      const body = {
        checkinId: parseInt(form.checkinId),
        funcionarioId: parseInt(form.funcionarioId),
        dataCheckout: form.dataCheckout,
        quilometragemCheckout: parseFloat(form.quilometragemCheckout),
        nivelCombustivel: form.nivelCombustivel,
        condicaoPneus: form.condicaoPneus,
        condicaoPalhetas: form.condicaoPalhetas,
        limpoInternamente: form.limpoInternamente,
        limpoExternamente: form.limpoExternamente,
        observacoes: form.observacoes,
        avariaIds: form.avariaIds,
      };
      await api.post('/checkouts', body);
      toast('Check-out concluído.');
      setModal(false);
      refetch();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try { await api.delete(`/checkouts/${delId}`); toast('Check-out removido.'); setDelId(null); refetch(); }
    catch (e) { toast(e.message, 'error'); }
    finally { setDelLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Check-out</h1>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setSelectedCheckin(null); setKmError(''); setModal(true); }}>
          <Plus className="h-4 w-4" /> Novo check-out
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#6B7280' }}>Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState message="Nenhum check-out registrado." action={<button className="btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}><Plus className="h-4 w-4" /> Novo check-out</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Check-in</th>
                  <th className="th">Placa</th>
                  <th className="th">Funcionário</th>
                  <th className="th">Data check-out</th>
                  <th className="th-r">Km devolução</th>
                  <th className="th">Combustível</th>
                  <th className="th-r">Avarias</th>
                  <th className="th-r">Taxa inspeção</th>
                  <th className="th" style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="td-mono" style={{ color: '#6B7280' }}>#{row.id}</td>
                    <td className="td-mono" style={{ color: '#6B7280' }}>#{row.checkinId}</td>
                    <td className="td-mono font-semibold">{row.checkin?.veiculo?.placa || '—'}</td>
                    <td className="td">{row.funcionario?.nome || '—'}</td>
                    <td className="td">{fmt(row.dataCheckout)}</td>
                    <td className="td-r">{parseFloat(row.quilometragemCheckout).toLocaleString('pt-BR')} km</td>
                    <td className="td">{row.nivelCombustivel}</td>
                    <td className="td-r">{(row.avarias || []).length}</td>
                    <td className="td-r">
                      {parseFloat(row.taxaInspecao) > 0
                        ? <span style={{ color: '#DC2626' }}>R$ {parseFloat(row.taxaInspecao).toFixed(2)}</span>
                        : <span style={{ color: '#6B7280' }}>—</span>}
                    </td>
                    <td className="td">
                      <button className="btn-ghost p-1.5" onClick={() => setDelId(row.id)}>
                        <Trash2 className="h-3.5 w-3.5" style={{ color: '#DC2626' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Concluir check-out" size="lg">
        <div className="space-y-4">
          <div>
            <label className="field-label">Check-in</label>
            <select className="field-select" value={form.checkinId} onChange={F('checkinId')}>
              <option value="">Selecione um check-in ativo…</option>
              {checkinsSemCheckout.map(c => (
                <option key={c.id} value={c.id}>
                  #{c.id} — {c.veiculo?.placa || '—'} — {c.reserva?.cliente?.nome || ''}
                </option>
              ))}
            </select>
          </div>

          {selectedCheckin && (
            <div className="callout-info">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Quilometragem no check-in: <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {parseFloat(selectedCheckin.quilometragemCheckin).toLocaleString('pt-BR')} km
                </strong> — a devolução deve ser maior que este valor.
              </span>
            </div>
          )}

          <div>
            <label className="field-label">Funcionário responsável</label>
            <select className="field-select" value={form.funcionarioId} onChange={F('funcionarioId')}>
              <option value="">Selecione…</option>
              {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nome} — {f.cargo}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Data e hora do check-out</label>
              <input className="field-input" type="datetime-local" value={form.dataCheckout} onChange={F('dataCheckout')} />
            </div>
            <div>
              <label className="field-label">Quilometragem de devolução</label>
              <input
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                value={form.quilometragemCheckout}
                onChange={F('quilometragemCheckout')}
                onBlur={validateKm}
              />
              {kmError && <p className="field-error">{kmError}</p>}
            </div>
            <div>
              <label className="field-label">Nível de combustível</label>
              <select className="field-select" value={form.nivelCombustivel} onChange={F('nivelCombustivel')}>
                {['Alto','Médio','Baixo','Vazio'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Condição dos pneus</label>
              <select className="field-select" value={form.condicaoPneus} onChange={F('condicaoPneus')}>
                {['Bom','Regular','Ruim','Furado'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Condição das palhetas</label>
              <select className="field-select" value={form.condicaoPalhetas} onChange={F('condicaoPalhetas')}>
                {['Boas','Ressecadas','Quebradas','Ausentes'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.limpoInternamente} onChange={FB('limpoInternamente')} className="h-4 w-4 rounded" style={{ accentColor: '#D97706' }} />
              <span className="text-sm" style={{ color: '#374151' }}>Limpo internamente</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.limpoExternamente} onChange={FB('limpoExternamente')} className="h-4 w-4 rounded" style={{ accentColor: '#D97706' }} />
              <span className="text-sm" style={{ color: '#374151' }}>Limpo externamente</span>
            </label>
          </div>

          {avarias.length > 0 && (
            <div>
              <label className="field-label">Avarias encontradas</label>
              <div className="border rounded-md p-3 space-y-2 max-h-36 overflow-y-auto" style={{ borderColor: '#E7E5E4' }}>
                {avarias.map(a => (
                  <label key={a.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.avariaIds.includes(a.id)}
                      onChange={() => toggleAvaria(a.id)}
                      className="h-4 w-4 rounded"
                      style={{ accentColor: '#DC2626' }}
                    />
                    <span className="text-sm flex-1" style={{ color: '#374151' }}>{a.nome}</span>
                    <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6B7280' }}>R$ {parseFloat(a.valor).toFixed(2)}</span>
                  </label>
                ))}
              </div>
              <p className="field-hint">Avarias geram multa automática. Taxa de inspeção de R$ 150,00 se o cliente tiver mais de 3 avarias no histórico.</p>
            </div>
          )}

          <div>
            <label className="field-label">Observações <span style={{ color: '#6B7280' }}>(opcional)</span></label>
            <textarea className="field-textarea" value={form.observacoes} onChange={F('observacoes')} maxLength={1000} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving || !!kmError}>
              {saving ? 'Processando…' : 'Concluir check-out'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={confirmDelete} loading={delLoading} title="Remover check-out" message="Este check-out será removido permanentemente. Confirma?" />
    </div>
  );
}
