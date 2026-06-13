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

const EMPTY = { nome: '', cnpj: '', endereco: '', telefone: '', status: 'Ativa', limiteDiasDesconto: 7, percentualDesconto: 10 };

export default function Agencias() {
  const { data, loading, refetch } = useCrud('/agencias');
  const list = useListView(data, r => `${r.nome} ${r.cnpj} ${r.status}`);
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
    setForm({
      nome: row.nome, cnpj: row.cnpj, endereco: row.endereco, telefone: row.telefone,
      status: row.status, limiteDiasDesconto: row.limiteDiasDesconto, percentualDesconto: row.percentualDesconto,
    });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form, limiteDiasDesconto: parseInt(form.limiteDiasDesconto), percentualDesconto: parseFloat(form.percentualDesconto) };
      if (editing) { await api.put(`/agencias/${editing}`, body); toast('Agência atualizada.'); }
      else { await api.post('/agencias', body); toast('Agência criada.'); }
      setModal(false); refetch();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try { await api.delete(`/agencias/${delId}`); toast('Agência removida.'); setDelId(null); refetch(); }
    catch (e) { toast(e.message, 'error'); }
    finally { setDelLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Agências</h1>
        <button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Nova agência</button>
      </div>

      {data.length > 0 && (
        <ListToolbar query={list.query} onQuery={list.setQuery} placeholder="Buscar por nome, CNPJ ou status…" total={list.paginacao.total} />
      )}

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#6B7280' }}>Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState message="Nenhuma agência cadastrada." action={<button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Nova agência</button>} />
        ) : list.isEmpty ? (
          <EmptyState message={`Nenhuma agência encontrada para “${list.query}”.`} />
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Nome</th>
                  <th className="th">CNPJ</th>
                  <th className="th">Status</th>
                  <th className="th">Telefone</th>
                  <th className="th-r">Limite dias desc.</th>
                  <th className="th-r">Desconto %</th>
                  <th className="th" style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {list.pageItems.map(row => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="td font-medium">{row.nome}</td>
                    <td className="td-mono text-sm" style={{ color: '#6B7280' }}>{row.cnpj}</td>
                    <td className="td"><StatusBadge status={row.status} /></td>
                    <td className="td">{row.telefone}</td>
                    <td className="td-r">{row.limiteDiasDesconto}d</td>
                    <td className="td-r">{parseFloat(row.percentualDesconto).toFixed(1)}%</td>
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar agência' : 'Nova agência'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="field-label">Nome</label>
              <input className="field-input" value={form.nome} onChange={F('nome')} maxLength={50} />
            </div>
            <div>
              <label className="field-label">CNPJ</label>
              <input className="field-input" value={form.cnpj} onChange={F('cnpj')} placeholder="NN.NNN.NNN/NNNN-NN" />
            </div>
            <div>
              <label className="field-label">Telefone</label>
              <input className="field-input" value={form.telefone} onChange={F('telefone')} placeholder="(NN) NNNNN-NNNN" />
            </div>
            <div className="col-span-2">
              <label className="field-label">Endereço</label>
              <input className="field-input" value={form.endereco} onChange={F('endereco')} maxLength={100} />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="field-select" value={form.status} onChange={F('status')}>
                <option>Ativa</option>
                <option>Inativa</option>
              </select>
            </div>
            <div>
              <label className="field-label">Limite de dias para desconto</label>
              <input className="field-input" type="number" min="1" value={form.limiteDiasDesconto} onChange={F('limiteDiasDesconto')} />
            </div>
            <div>
              <label className="field-label">Percentual de desconto (%)</label>
              <input className="field-input" type="number" min="0" max="100" step="0.01" value={form.percentualDesconto} onChange={F('percentualDesconto')} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar agência'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={confirmDelete} loading={delLoading} title="Remover agência" message="Esta agência será removida permanentemente. Confirma?" />
    </div>
  );
}
