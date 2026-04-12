import { Navigate, Route, Routes } from 'react-router-dom';
import SidebarLayout from './layout/SidebarLayout';
import DashboardPage from './components/DashboardPage';
import ModulePrototype from './components/ModulePrototype';
import { prototypes } from './data/prototypes';

function ModulePage({ moduleKey }) {
  return <ModulePrototype config={prototypes[moduleKey]} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="reservas" element={<ModulePage moduleKey="reservas" />} />
        <Route path="checkins" element={<ModulePage moduleKey="checkins" />} />
        <Route path="checkouts" element={<ModulePage moduleKey="checkouts" />} />
        <Route path="veiculos" element={<ModulePage moduleKey="veiculos" />} />
        <Route path="categorias" element={<ModulePage moduleKey="categorias" />} />
        <Route path="avarias" element={<ModulePage moduleKey="avarias" />} />
        <Route path="seguros" element={<ModulePage moduleKey="seguros" />} />
        <Route path="coberturas" element={<ModulePage moduleKey="coberturas" />} />
        <Route path="clientes" element={<ModulePage moduleKey="clientes" />} />
        <Route path="funcionarios" element={<ModulePage moduleKey="funcionarios" />} />
        <Route path="multas" element={<ModulePage moduleKey="multas" />} />
        <Route path="agencias" element={<ModulePage moduleKey="agencias" />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
