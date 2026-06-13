import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reservas from './pages/Reservas.jsx';
import Checkins from './pages/Checkins.jsx';
import Checkouts from './pages/Checkouts.jsx';
import Relatorios from './pages/Relatorios.jsx';
import Agencias from './pages/Agencias.jsx';
import Clientes from './pages/Clientes.jsx';
import Funcionarios from './pages/Funcionarios.jsx';
import Veiculos from './pages/Veiculos.jsx';
import Categorias from './pages/Categorias.jsx';
import Seguros from './pages/Seguros.jsx';
import Coberturas from './pages/Coberturas.jsx';
import Avarias from './pages/Avarias.jsx';
import Multas from './pages/Multas.jsx';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Gating só de UI: restringe telas de gestão/relatórios a Gerentes. Sem enforcement no backend ainda.
function GerenteRoute({ children }) {
  const { user } = useAuth();
  return user?.cargo === 'Gerente' ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/checkins" element={<Checkins />} />
                <Route path="/checkouts" element={<Checkouts />} />
                <Route path="/relatorios/*" element={<GerenteRoute><Relatorios /></GerenteRoute>} />
                <Route path="/agencias" element={<GerenteRoute><Agencias /></GerenteRoute>} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/funcionarios" element={<GerenteRoute><Funcionarios /></GerenteRoute>} />
                <Route path="/veiculos" element={<Veiculos />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/seguros" element={<Seguros />} />
                <Route path="/coberturas" element={<Coberturas />} />
                <Route path="/avarias" element={<Avarias />} />
                <Route path="/multas" element={<Multas />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
