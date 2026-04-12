export default function DashboardPage() {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <section>
      <div className="alert alert-primary" role="alert">
        <h5 className="alert-heading mb-1">Bem-vindo ao painel Mova-se</h5>
        <small>Data: {today}</small>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle text-body-secondary">Veículos disponíveis</h6>
              <p className="display-6 mb-0">28</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle text-body-secondary">Veículos reservados</h6>
              <p className="display-6 mb-0">11</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle text-body-secondary">Reservas</h6>
              <p className="display-6 mb-0">46</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle text-body-secondary">Agências ativas</h6>
              <p className="display-6 mb-0">5</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
