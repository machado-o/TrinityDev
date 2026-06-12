import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCrud } from '../hooks/useCrud.js';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';

const CATS_CNH = ['A','B','AB','C','D','E','AC','AD','AE'];
const EMPTY = { nome: '', cpf: '', dataNascimento: '', telefone: '', email: '', cnh: '', categoriaCnh: 'B', validadeCnh: '', endereco: '' };

export default function Clientes() {
  const { data, loading, refetch } = useCrud('/clientes');
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
    setForm({ nome: row.nome, cpf: row.cpf, dataNascimento: row.dataNascimento?.split('T')[0] || row.dataNascimento, telefone: row.telefone, email: row.email, cnh: row.cnh, categoriaCnh: row.categoriaCnh, validadeCnh: row.validadeCnh?.split('T')[0] || row.validadeCnh, endereco: row.endereco });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) { await api.put(`/clientes/${editing}`, form); toast('Cliente atualizado.'); }
      else { await api.post('/clientes', form); toast('Cliente criado.'); }
      setModal(false); refetch();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try { await api.delete(`/clientes/${delId}`); toast('Cliente removido.'); setDelId(null); refetch(); }
    catch (e) { toast(e.message, 'error'); }
    finally { setDelLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Clientes</h1>
        <button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Novo cliente</button>
      </div>
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#6B7280' }}>Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState message="Nenhum cliente cadastrado." action={<button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Novo cliente</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Nome</th>
                  <th className="th">CPF</th>
                  <th className="th">Email</th>
                  <th className="th">CNH</th>
                  <th className="th">Cat. CNH</th>
                  <th className="th">Validade CNH</th>
                  <th className="th" style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="td font-medium">{row.nome}</td>
                    <td className="td-mono">{row.cpf}</td>
                    <td className="td text-sm" style={{ color: '#6B7280' }}>{row.email}</td>
                    <td className="td-mono">{row.cnh}</td>
                    <td className="td">{row.categoriaCnh}</td>
                    <td className="td">{row.validadeCnh?.split('T')[0] || row.validadeCnh}</td>
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
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar cliente' : 'Novo cliente'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="field-label">Nome</label>
              <input className="field-input" value={form.nome} onChange={F('nome')} maxLength={50} />
            </div>
            <div>
              <label className="field-label">CPF</label>
              <input className="field-input" value={form.cpf} onChange={F('cpf')} placeholder="NNN.NNN.NNN-NN" />
            </div>
            <div>
              <label className="field-label">Data de nascimento</label>
              <input className="field-input" type="date" value={form.dataNascimento} onChange={F('dataNascimento')} />
            </div>
            <div>
              <label className="field-label">Telefone</label>
              <input className="field-input" value={form.telefone} onChange={F('telefone')} placeholder="(NN) NNNNN-NNNN" />
            </div>
            <div>
              <label className="field-label">E-mail</label>
              <input className="field-input" type="email" value={form.email} onChange={F('email')} />
            </div>
            <div>
              <label className="field-label">CNH</label>
              <input className="field-input" value={form.cnh} onChange={F('cnh')} maxLength={11} placeholder="11 dígitos" />
              <p className="field-hint">Apenas números, 11 dígitos</p>
            </div>
            <div>
              <label className="field-label">Categoria da CNH</label>
              <select className="field-select" value={form.categoriaCnh} onChange={F('categoriaCnh')}>
                {CATS_CNH.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="field-label">Validade da CNH</label>
              <input className="field-input" type="date" value={form.validadeCnh} onChange={F('validadeCnh')} />
            </div>
            <div className="col-span-2">
              <label className="field-label">Endereço</label>
              <input className="field-input" value={form.endereco} onChange={F('endereco')} maxLength={100} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar cliente'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={confirmDelete} loading={delLoading} title="Remover cliente" message="Este cliente será removido permanentemente. Confirma?" />
    </div>
  );
}
