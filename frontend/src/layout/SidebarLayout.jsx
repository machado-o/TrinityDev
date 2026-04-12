import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { menuGroups, routeNames } from '../data/navigation';

export default function SidebarLayout() {
  const location = useLocation();
  const pageTitle = routeNames[location.pathname] || 'Módulo';

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <aside className="col-12 col-md-4 col-lg-3 col-xl-2 bg-white border-end p-0">
          <div className="p-3 border-bottom">
            <h5 className="mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-car-front-fill"></i>
              Mova-se
            </h5>
            <small className="text-body-secondary">Gestão inteligente de frotas</small>
          </div>

          <div className="p-3">
            {menuGroups.map((group) => (
              <div className="mb-4" key={group.title}>
                <small className="text-uppercase text-body-secondary fw-semibold">{group.title}</small>
                <div className="list-group mt-2">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
                      }
                    >
                      <i className={`bi ${item.icon} me-2`}></i>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="col-12 col-md-8 col-lg-9 col-xl-10 p-4">
          <div className="mb-3">
            <h4 className="mb-0">{pageTitle}</h4>
          </div>
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">Painel</li>
              <li className="breadcrumb-item active" aria-current="page">{pageTitle}</li>
            </ol>
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
