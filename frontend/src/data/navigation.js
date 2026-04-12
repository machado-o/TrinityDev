export const menuGroups = [
  {
    title: 'Operacional',
    items: [
      { label: 'Reservas', path: '/reservas', icon: 'bi-calendar-check' },
      { label: 'Check-in', path: '/checkins', icon: 'bi-box-arrow-in-right' },
      { label: 'Check-out', path: '/checkouts', icon: 'bi-box-arrow-right' },
    ],
  },
  {
    title: 'Frota',
    items: [
      { label: 'Veículos', path: '/veiculos', icon: 'bi-car-front' },
      { label: 'Categorias de Veículo', path: '/categorias', icon: 'bi-grid-3x3-gap' },
      { label: 'Avarias', path: '/avarias', icon: 'bi-tools' },
    ],
  },
  {
    title: 'Seguros',
    items: [
      { label: 'Seguros', path: '/seguros', icon: 'bi-shield-check' },
      { label: 'Coberturas', path: '/coberturas', icon: 'bi-shield-plus' },
    ],
  },
  {
    title: 'Pessoas',
    items: [
      { label: 'Clientes', path: '/clientes', icon: 'bi-people' },
      { label: 'Funcionários', path: '/funcionarios', icon: 'bi-person-badge' },
      { label: 'Multas', path: '/multas', icon: 'bi-receipt' },
    ],
  },
  {
    title: 'Empresa',
    items: [{ label: 'Agências', path: '/agencias', icon: 'bi-building' }],
  },
];

export const routeNames = {
  '/': 'Dashboard',
  '/reservas': 'Reservas',
  '/checkins': 'Check-in',
  '/checkouts': 'Check-out',
  '/veiculos': 'Veículos',
  '/categorias': 'Categorias de Veículo',
  '/avarias': 'Avarias',
  '/seguros': 'Seguros',
  '/coberturas': 'Coberturas',
  '/clientes': 'Clientes',
  '/funcionarios': 'Funcionários',
  '/multas': 'Multas',
  '/agencias': 'Agências',
};
