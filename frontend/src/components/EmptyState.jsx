import { FileX } from 'lucide-react';

export default function EmptyState({ message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileX className="h-10 w-10 mb-3" style={{ color: '#D1D5DB' }} strokeWidth={1.5} />
      <p className="text-sm" style={{ color: '#6B7280' }}>{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
