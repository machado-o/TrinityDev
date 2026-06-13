import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCrud } from '../hooks/useCrud.js';
import { useListView } from '../hooks/useListView.js';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ListToolbar from '../components/ListToolbar.jsx';
import Pagination from '../components/Pagination.jsx';

const EMPTY = { valor: '', dataEmissao: '', descricao: '', status: 'Pendente', clienteId: '', reservaId: '' };

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('pt-BR');
}

export default function Multas() {
  const { data, loading, refetch } = useCrud('/multas');
  const { data: clientes } = useCrud('/clientes');
  const { data: reservas } = useCrud('/reservas');
  const list = useListView(data, r => `#${r.id} ${r.cliente?.nome ?? ''} ${r.status} ${r.descricao ?? ''}`);
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const F = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (row) => {
    setEditing(row.id);
    const de = row.dataEmissao ? new Date(row.dataEmissao).toISOString().slice(0, 16) : '';
    setForm({ valor: row.valor, dataEmissao: de, descricao: row.descricao || '', status: row.status, clienteId: row.clienteId, reservaId: row.reservaId || '' });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = { valor: parseFloat(form.valor), dataEmissao: form.dataEmissao, descricao: form.descricao, status: form.status, clienteId: parseInt(form.clienteId) };
      if (form.reservaId) body.reservaId = parseInt(form.reservaId);
      if (editing) { await api.put(`/multas/${editing}`, body); toast('Multa atualizada.'); }
      else { await api.post('/multas', body); toast('Multa criada.'); }
      setModal(false); refetch();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try { await api.delete(`/multas/${delId}`); toast('Multa removida.'); setDelId(null); refetch(); }
    catch (e) { toast(e.message, 'error'); }
    finally { setDelLoading(false); }
  };

  const clienteNome = (id) => clientes.find(c => c.id === id)?.nome || `#${id}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Multas</h1>
        <button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Nova multa</button>
      </div>

      {data.length > 0 && (
        <ListToolbar query={list.query} onQuery={list.setQuery} placeholder="Buscar por cliente, status ou descrição…" total={list.paginacao.total} />
      )}

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#6B7280' }}>Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState message="Nenhuma multa registrada." action={<button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Nova multa</button>} />
        ) : list.isEmpty ? (
          <EmptyState message={`Nenhuma multa encontrada para “${list.query}”.`} />
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Cliente</th>
                  <th className="th-r">Valor</th>
                  <th className="th">Status</th>
                  <th className="th">Data emissão</th>
                  <th className="th">Reserva</th>
                  <th className="th" style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {list.pageItems.map(row => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="td-mono" style={{ color: '#6B7280' }}>#{row.id}</td>
                    <td className="td font-medium">{row.cliente?.nome || clienteNome(row.clienteId)}</td>
                    <td className="td-r">R$ {parseFloat(row.valor).toFixed(2)}</td>
                    <td className="td"><StatusBadge status={row.status} entity="multa" /></td>
                    <td className="td">{fmt(row.dataEmissao)}</td>
                    <td className="td-mono" style={{ color: '#6B7280' }}>{row.reservaId ? `#${row.reservaId}` : '—'}</td>
                    <td className="td">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="btn-ghost p-1.5" onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="btn-ghost p-1.5" onClick={() => setDelId(row.id)}><Trash2 className="h-3.5 w-3.5" style={{ color: '#DC2626' }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination paginacao={list.paginacao} onChange={list.setPage} />
          </>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar multa' : 'Nova multa'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Valor (R$)</label>
              <input className="field-input" type="number" min="0" step="0.01" value={form.valor} onChange={F('valor')} />
            </div>
            <div>
              <label className="field-label">Data de emissão</label>
              <input className="field-input" type="datetime-local" value={form.dataEmissao} onChange={F('dataEmissao')} />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="field-select" value={form.status} onChange={F('status')}>
                <option>Pendente</option><option>Paga</option>
              </select>
            </div>
            <div>
              <label className="field-label">Cliente</label>
              <select className="field-select" value={form.clienteId} onChange={F('clienteId')}>
                <option value="">Selecione…</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.cpf}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="field-label">Reserva <span style={{ color: '#6B7280' }}>(opcional)</span></label>
              <select className="field-select" value={form.reservaId} onChange={F('reservaId')}>
                <option value="">Sem reserva vinculada</option>
                {reservas.map(r => <option key={r.id} value={r.id}>#{r.id} — {r.cliente?.nome || ''} — {r.status}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="field-label">Descrição <span style={{ color: '#6B7280' }}>(opcional)</span></label>
              <textarea className="field-textarea" value={form.descricao} onChange={F('descricao')} maxLength={1000} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar multa'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={confirmDelete} loading={delLoading} title="Remover multa" message="Esta multa será removida permanentemente. Confirma?" />
    </div>
  );
}
