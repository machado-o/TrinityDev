import { useState } from 'react';
import { Plus, Trash2, Info, AlertTriangle } from 'lucide-react';
import { useCrud } from '../hooks/useCrud.js';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const EMPTY = {
  clienteId: '', categoriaVeiculoId: '', funcionarioId: '', seguroId: '',
  agenciaRetiradaId: '', agenciaDevolucaoId: '', dataRetirada: '', dataDevolucao: '',
};

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function Reservas() {
  const { data, loading, refetch } = useCrud('/reservas');
  const { data: clientes } = useCrud('/clientes');
  const { data: categorias } = useCrud('/categoriasdeveiculos');
  const { data: funcionarios } = useCrud('/funcionarios');
  const { data: seguros } = useCrud('/seguros');
  const { data: agencias } = useCrud('/agencias');
  const toast = useToast();

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [dateError, setDateError] = useState('');

  const F = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const agenciaRetirada = agencias.find(a => a.id === parseInt(form.agenciaRetiradaId));
  const agenciaDevolucao = agencias.find(a => a.id === parseInt(form.agenciaDevolucaoId));

  const validateDates = () => {
    if (form.dataRetirada && new Date(form.dataRetirada) < new Date()) {
      setDateError('A data de retirada não pode ser no passado.');
      return false;
    }
    setDateError('');
    return true;
  };

  const save = async () => {
    if (!validateDates()) return;
    setSaving(true);
    try {
      const body = {
        clienteId: parseInt(form.clienteId),
        categoriaVeiculoId: parseInt(form.categoriaVeiculoId),
        funcionarioId: parseInt(form.funcionarioId),
        agenciaRetiradaId: parseInt(form.agenciaRetiradaId),
        agenciaDevolucaoId: parseInt(form.agenciaDevolucaoId),
        dataRetirada: form.dataRetirada,
        dataDevolucao: form.dataDevolucao,
      };
      if (form.seguroId) body.seguroId = parseInt(form.seguroId);
      await api.post('/reservas', body);
      toast('Reserva criada.');
      setModal(false);
      refetch();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try { await api.delete(`/reservas/${delId}`); toast('Reserva removida.'); setDelId(null); refetch(); }
    catch (e) { toast(e.message, 'error'); }
    finally { setDelLoading(false); }
  };

  const confirmCancel = async () => {
    setCancelLoading(true);
    try { await api.put(`/reservas/${cancelId}`, { status: 'Cancelada' }); toast('Reserva cancelada.'); setCancelId(null); refetch(); }
    catch (e) { toast(e.message, 'error'); }
    finally { setCancelLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Reservas</h1>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setDateError(''); setModal(true); }}>
          <Plus className="h-4 w-4" /> Nova reserva
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#6B7280' }}>Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState message="Nenhuma reserva registrada." action={<button className="btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}><Plus className="h-4 w-4" /> Nova reserva</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Status</th>
                  <th className="th">Cliente</th>
                  <th className="th">Categoria</th>
                  <th className="th">Ag. retirada</th>
                  <th className="th">Retirada</th>
                  <th className="th">Devolução</th>
                  <th className="th-r">Dias</th>
                  <th className="th-r">Valor final</th>
                  <th className="th" style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="td-mono" style={{ color: '#6B7280' }}>#{row.id}</td>
                    <td className="td"><StatusBadge status={row.status} /></td>
                    <td className="td font-medium">{row.cliente?.nome || '—'}</td>
                    <td className="td">{row.categoriaVeiculo?.nome || '—'}</td>
                    <td className="td">{row.agenciaRetirada?.nome || '—'}</td>
                    <td className="td">{fmt(row.dataRetirada)}</td>
                    <td className="td">{fmt(row.dataDevolucao)}</td>
                    <td className="td-r">{row.quantidadeDias}d</td>
                    <td className="td-r">R$ {parseFloat(row.valorFinal).toFixed(2)}</td>
                    <td className="td">
                      <div className="flex items-center gap-1 justify-end">
                        {row.status === 'Pendente' && (
                          <button className="btn-ghost p-1.5 text-xs" onClick={() => setCancelId(row.id)} title="Cancelar reserva">
                            <AlertTriangle className="h-3.5 w-3.5" style={{ color: '#D97706' }} />
                          </button>
                        )}
                        <button className="btn-ghost p-1.5" onClick={() => setDelId(row.id)} title="Remover">
                          <Trash2 className="h-3.5 w-3.5" style={{ color: '#DC2626' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nova reserva" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Cliente</label>
              <select className="field-select" value={form.clienteId} onChange={F('clienteId')}>
                <option value="">Selecione…</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.cpf}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Categoria de veículo</label>
              <select className="field-select" value={form.categoriaVeiculoId} onChange={F('categoriaVeiculoId')}>
                <option value="">Selecione…</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome} — R$ {parseFloat(c.valorDiaria).toFixed(2)}/dia</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Funcionário responsável</label>
              <select className="field-select" value={form.funcionarioId} onChange={F('funcionarioId')}>
                <option value="">Selecione…</option>
                {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nome} — {f.cargo}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Seguro <span style={{ color: '#6B7280' }}>(opcional)</span></label>
              <select className="field-select" value={form.seguroId} onChange={F('seguroId')}>
                <option value="">Sem seguro</option>
                {seguros.map(s => <option key={s.id} value={s.id}>{s.nome} — {s.empresaSeguradora}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Agência de retirada</label>
              <select className="field-select" value={form.agenciaRetiradaId} onChange={F('agenciaRetiradaId')}>
                <option value="">Selecione…</option>
                {agencias.map(a => <option key={a.id} value={a.id}>{a.nome} {a.status === 'Inativa' ? '(Inativa)' : ''}</option>)}
              </select>
              {agenciaRetirada?.status === 'Inativa' && (
                <p className="field-error">Esta agência está inativa e não pode receber reservas.</p>
              )}
            </div>
            <div>
              <label className="field-label">Agência de devolução</label>
              <select className="field-select" value={form.agenciaDevolucaoId} onChange={F('agenciaDevolucaoId')}>
                <option value="">Selecione…</option>
                {agencias.map(a => <option key={a.id} value={a.id}>{a.nome} {a.status === 'Inativa' ? '(Inativa)' : ''}</option>)}
              </select>
              {agenciaDevolucao?.status === 'Inativa' && (
                <p className="field-error">Esta agência está inativa e não pode receber reservas.</p>
              )}
            </div>
            <div>
              <label className="field-label">Data e hora de retirada</label>
              <input className="field-input" type="datetime-local" value={form.dataRetirada} onChange={F('dataRetirada')} onBlur={validateDates} />
              {dateError && <p className="field-error">{dateError}</p>}
              {!dateError && <p className="field-hint">Não pode ser no passado</p>}
            </div>
            <div>
              <label className="field-label">Data e hora de devolução</label>
              <input className="field-input" type="datetime-local" value={form.dataDevolucao} onChange={F('dataDevolucao')} />
            </div>
          </div>

          <div className="callout-info">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Valores financeiros (diária, seguro, total e quantidade de dias) são calculados automaticamente pelo sistema com base na categoria, seguro e datas informadas.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Criar reserva'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={confirmCancel}
        loading={cancelLoading}
        title="Cancelar reserva"
        message="Esta reserva será marcada como Cancelada. Essa ação não pode ser desfeita. Confirma?"
      />

      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={confirmDelete}
        loading={delLoading}
        title="Remover reserva"
        message="Esta reserva será removida permanentemente. Confirma?"
      />
    </div>
  );
}
