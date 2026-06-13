import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, FileWarning } from 'lucide-react';
import { useCrud } from '../hooks/useCrud.js';
import { useDetail } from '../hooks/useDetail.js';
import { useListView } from '../hooks/useListView.js';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ListToolbar from '../components/ListToolbar.jsx';
import Pagination from '../components/Pagination.jsx';
import { Section, Field, FieldGrid, money, dateOnly, dateTime } from '../components/Detail.jsx';

const CATS_CNH = ['A','B','AB','C','D','E','AC','AD','AE'];
const EMPTY = { nome: '', cpf: '', dataNascimento: '', telefone: '', email: '', cnh: '', categoriaCnh: 'B', validadeCnh: '', endereco: '' };

export default function Clientes() {
  const { data, loading, refetch } = useCrud('/clientes');
  const list = useListView(data, r => `${r.nome} ${r.cpf} ${r.email} ${r.cnh}`);
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [detailId, setDetailId] = useState(null);

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

      {data.length > 0 && (
        <ListToolbar query={list.query} onQuery={list.setQuery} placeholder="Buscar por nome, CPF, e-mail ou CNH…" total={list.paginacao.total} />
      )}

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#6B7280' }}>Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState message="Nenhum cliente cadastrado." action={<button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Novo cliente</button>} />
        ) : list.isEmpty ? (
          <EmptyState message={`Nenhum cliente encontrado para “${list.query}”.`} />
        ) : (
          <>
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
                  <th className="th" style={{ width: 110 }}></th>
                </tr>
              </thead>
              <tbody>
                {list.pageItems.map(row => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="td font-medium">{row.nome}</td>
                    <td className="td-mono">{row.cpf}</td>
                    <td className="td text-sm" style={{ color: '#6B7280' }}>{row.email}</td>
                    <td className="td-mono">{row.cnh}</td>
                    <td className="td">{row.categoriaCnh}</td>
                    <td className="td">{row.validadeCnh?.split('T')[0] || row.validadeCnh}</td>
                    <td className="td">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="btn-ghost p-1.5" onClick={() => setDetailId(row.id)} title="Ver detalhes"><Eye className="h-3.5 w-3.5" /></button>
                        <button className="btn-ghost p-1.5" onClick={() => openEdit(row)} title="Editar"><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="btn-ghost p-1.5" onClick={() => setDelId(row.id)} title="Remover"><Trash2 className="h-3.5 w-3.5" style={{ color: '#DC2626' }} /></button>
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

      <ClienteDetail id={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}

function ClienteDetail({ id, onClose }) {
  const { data: c, loading, error } = useDetail('/clientes', id);
  const reservas = c?.reservas || [];
  const multas = c?.multas || [];
  const multasPendentes = multas.filter(m => m.status === 'Pendente');

  return (
    <Modal open={id != null} onClose={onClose} title={c ? c.nome : 'Cliente'} size="xl">
      {loading && <p className="text-sm py-8 text-center" style={{ color: '#6B7280' }}>Carregando…</p>}
      {error && <p className="callout-warning">{error}</p>}
      {c && (
        <div className="space-y-6">
          {multasPendentes.length > 0 && (
            <div className="callout-warning">
              <FileWarning className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Cliente possui <strong>{multasPendentes.length} multa(s) pendente(s)</strong> — o
                check-in será bloqueado até a regularização.
              </span>
            </div>
          )}

          <Section title="Dados do cliente">
            <FieldGrid cols={3}>
              <Field label="CPF" mono>{c.cpf}</Field>
              <Field label="Nascimento">{dateOnly(c.dataNascimento)}</Field>
              <Field label="Telefone" mono>{c.telefone}</Field>
              <Field label="E-mail">{c.email}</Field>
              <Field label="CNH" mono>{c.cnh}</Field>
              <Field label="Categoria / validade">{c.categoriaCnh} · {dateOnly(c.validadeCnh)}</Field>
              <div className="col-span-3"><Field label="Endereço">{c.endereco}</Field></div>
            </FieldGrid>
          </Section>

          <Section title={`Reservas (${reservas.length})`}>
            {reservas.length === 0 ? (
              <p className="text-sm" style={{ color: '#6B7280' }}>Nenhuma reserva.</p>
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="th">ID</th>
                      <th className="th">Status</th>
                      <th className="th">Retirada</th>
                      <th className="th">Devolução</th>
                      <th className="th-r">Dias</th>
                      <th className="th-r">Valor final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map(r => (
                      <tr key={r.id}>
                        <td className="td-mono" style={{ color: '#6B7280' }}>#{r.id}</td>
                        <td className="td"><StatusBadge status={r.status} /></td>
                        <td className="td">{dateTime(r.dataRetirada)}</td>
                        <td className="td">{dateTime(r.dataDevolucao)}</td>
                        <td className="td-r">{r.quantidadeDias}d</td>
                        <td className="td-r">{money(r.valorFinal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          <Section title={`Multas (${multas.length})`}>
            {multas.length === 0 ? (
              <p className="text-sm" style={{ color: '#6B7280' }}>Nenhuma multa.</p>
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="th">ID</th>
                      <th className="th">Status</th>
                      <th className="th">Descrição</th>
                      <th className="th">Emissão</th>
                      <th className="th-r">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multas.map(m => (
                      <tr key={m.id}>
                        <td className="td-mono" style={{ color: '#6B7280' }}>#{m.id}</td>
                        <td className="td"><StatusBadge status={m.status} entity="multa" /></td>
                        <td className="td">{m.descricao}</td>
                        <td className="td">{dateOnly(m.dataEmissao)}</td>
                        <td className="td-r">{money(m.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </div>
      )}
    </Modal>
  );
}
