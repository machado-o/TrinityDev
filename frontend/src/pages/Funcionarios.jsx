import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCrud } from '../hooks/useCrud.js';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const EMPTY = { nome: '', cpf: '', cargo: 'Atendente', dataNascimento: '', telefone: '', email: '', senha: '', agenciaId: '' };

export default function Funcionarios() {
  const { data, loading, refetch } = useCrud('/funcionarios');
  const { data: agencias } = useCrud('/agencias');
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
    setForm({ nome: row.nome, cpf: row.cpf, cargo: row.cargo, dataNascimento: row.dataNascimento?.split('T')[0] || row.dataNascimento, telefone: row.telefone, email: row.email, senha: '', agenciaId: row.agenciaId });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = { nome: form.nome, cpf: form.cpf, cargo: form.cargo, dataNascimento: form.dataNascimento, telefone: form.telefone, email: form.email, agenciaId: form.agenciaId ? parseInt(form.agenciaId) : undefined };
      if (editing) {
        if (form.senha) body.senha = form.senha;
        await api.put(`/funcionarios/${editing}`, body); toast('Funcionário atualizado.');
      } else {
        body.senha = form.senha;
        await api.post('/funcionarios', body); toast('Funcionário criado.');
      }
      setModal(false); refetch();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try { await api.delete(`/funcionarios/${delId}`); toast('Funcionário removido.'); setDelId(null); refetch(); }
    catch (e) { toast(e.message, 'error'); }
    finally { setDelLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Funcionários</h1>
        <button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Novo funcionário</button>
      </div>
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#6B7280' }}>Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState message="Nenhum funcionário cadastrado." action={<button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Novo funcionário</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Nome</th>
                  <th className="th">Cargo</th>
                  <th className="th">Agência</th>
                  <th className="th">CPF</th>
                  <th className="th">E-mail</th>
                  <th className="th" style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="td font-medium">{row.nome}</td>
                    <td className="td"><StatusBadge status={row.cargo} /></td>
                    <td className="td">{row.agencia?.nome || '—'}</td>
                    <td className="td-mono">{row.cpf}</td>
                    <td className="td text-sm" style={{ color: '#6B7280' }}>{row.email}</td>
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar funcionário' : 'Novo funcionário'} size="lg">
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
              <label className="field-label">Cargo</label>
              <select className="field-select" value={form.cargo} onChange={F('cargo')}>
                <option>Atendente</option><option>Gerente</option>
              </select>
            </div>
            <div>
              <label className="field-label">Data de nascimento</label>
              <input className="field-input" type="date" value={form.dataNascimento} onChange={F('dataNascimento')} />
            </div>
            <div>
              <label className="field-label">Telefone</label>
              <input className="field-input" value={form.telefone} onChange={F('telefone')} placeholder="(NN) NNNNN-NNNN" />
            </div>
            <div className="col-span-2">
              <label className="field-label">E-mail</label>
              <input className="field-input" type="email" value={form.email} onChange={F('email')} />
            </div>
            <div>
              <label className="field-label">Agência</label>
              <select className="field-select" value={form.agenciaId} onChange={F('agenciaId')}>
                <option value="">Selecione…</option>
                {agencias.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">
                Senha {editing && <span style={{ color: '#6B7280' }}>(deixe em branco para não alterar)</span>}
              </label>
              <input className="field-input" type="password" value={form.senha} onChange={F('senha')} placeholder={editing ? 'Nova senha…' : 'Senha'} />
              {!editing && <p className="field-hint">Mín. 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar funcionário'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={confirmDelete} loading={delLoading} title="Remover funcionário" message="Este funcionário será removido permanentemente. Confirma?" />
    </div>
  );
}
