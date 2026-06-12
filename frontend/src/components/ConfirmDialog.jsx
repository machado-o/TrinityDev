import { AlertTriangle } from 'lucide-react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirmar ação'} size="sm">
      <div className="flex gap-3 mb-6">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
        <p className="text-sm" style={{ color: '#374151' }}>{message}</p>
      </div>
      <div className="flex justify-end gap-2">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Aguarde…' : 'Confirmar'}
        </button>
      </div>
    </Modal>
  );
}
