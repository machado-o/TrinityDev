import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const F = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.senha);
      navigate('/reservas', { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAFAF9' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-96 shrink-0 p-10"
        style={{ backgroundColor: '#111827' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#D97706' }}
            >
              <Car className="h-5 w-5" style={{ color: '#451A03' }} />
            </div>
            <div>
              <span className="font-display text-white font-semibold text-lg leading-none block">SAV</span>
              <span className="text-xs leading-none block" style={{ color: '#6B7280' }}>Aluguel de Veículos</span>
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold text-white leading-snug mb-4">
            Sistema de<br />Aluguel de Veículos
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
            Plataforma operacional para gestão de reservas, check-in, check-out e relatórios da frota.
          </p>
        </div>

        <div className="space-y-3">
          {['Reservas e contratos', 'Check-in e check-out', 'Relatórios operacionais'].map(item => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#D97706' }} />
              <span className="text-sm" style={{ color: '#9CA3AF' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D97706' }}>
              <Car className="h-4 w-4" style={{ color: '#451A03' }} />
            </div>
            <span className="font-display font-semibold text-xl" style={{ color: '#111827' }}>SAV</span>
          </div>

          <h2 className="font-display text-2xl font-semibold mb-1" style={{ color: '#111827' }}>
            Entrar
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
            Acesse com suas credenciais de funcionário.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="field-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                className="field-input"
                type="email"
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={F('email')}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="senha">Senha</label>
              <input
                id="senha"
                className="field-input"
                type="password"
                autoComplete="current-password"
                value={form.senha}
                onChange={F('senha')}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
