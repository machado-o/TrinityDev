function FieldControl({ type, label }) {
  if (type === 'textarea') {
    return (
      <div className="mb-3 col-12 col-md-6">
        <label className="form-label">{label}</label>
        <textarea className="form-control" rows="3" placeholder="Exemplo" />
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="mb-3 col-12 col-md-6 d-flex align-items-center">
        <div className="form-check mt-4">
          <input className="form-check-input" type="checkbox" id={`chk-${label}`} />
          <label className="form-check-label" htmlFor={`chk-${label}`}>{label}</label>
        </div>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="mb-3 col-12 col-md-6">
        <label className="form-label">{label}</label>
        <select className="form-select">
          <option>Selecione...</option>
          <option>Opção 1</option>
          <option>Opção 2</option>
        </select>
      </div>
    );
  }

  return (
    <div className="mb-3 col-12 col-md-6">
      <label className="form-label">{label}</label>
      <input className="form-control" type={type} placeholder="Exemplo" />
    </div>
  );
}

export default function ModulePrototype({ config }) {
  const dataColumns = config.columns.filter((col) => col !== 'Ações');
  const modalId = `delete-modal-${config.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()}`;

  const statusBadgeMap = {
    Disponível: 'success',
    Reservado: 'warning',
    Manutenção: 'danger',
    Ativa: 'success',
    Inativa: 'secondary',
    Pendente: 'warning',
    Paga: 'success',
    Sim: 'warning',
    Não: 'success',
  };

  const renderCell = (cell) => {
    const badgeType = statusBadgeMap[cell];
    if (badgeType) {
      return <span className={`badge text-bg-${badgeType}`}>{cell}</span>;
    }
    return cell;
  };

  return (
    <section>
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>{config.title}</strong>
          <button type="button" className="btn btn-warning btn-sm">{config.buttonLabel}</button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  {dataColumns.map((col) => <th key={col}>{col}</th>)}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {config.rows.map((row, idx) => (
                  <tr key={`${config.title}-${idx}`}>
                    {row.map((cell, cellIdx) => <td key={`${idx}-${cellIdx}`}>{renderCell(cell)}</td>)}
                    <td>
                      <div className="btn-group btn-group-sm" role="group" aria-label="Ações">
                        <button type="button" className="btn btn-outline-primary">
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          data-bs-toggle="modal"
                          data-bs-target={`#${modalId}`}
                        >
                          <i className="bi bi-trash"></i> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Paginação de tabela" className="mt-3">
            <ul className="pagination pagination-sm mb-0 justify-content-end">
              <li className="page-item disabled"><button className="page-link">Anterior</button></li>
              <li className="page-item active" aria-current="page"><button className="page-link">1</button></li>
              <li className="page-item"><button className="page-link">2</button></li>
              <li className="page-item"><button className="page-link">3</button></li>
              <li className="page-item"><button className="page-link">Próxima</button></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <strong>Formulário de {config.title}</strong>
        </div>
        <div className="card-body">
          <form className="row">
            {config.fields.map(([label, type]) => (
              <FieldControl key={`${config.title}-${label}`} label={label} type={type} />
            ))}
            <div className="col-12 d-flex gap-2">
              <button type="button" className="btn btn-primary">Salvar</button>
              <button type="button" className="btn btn-outline-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar exclusão</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div className="modal-body">Deseja realmente excluir este registro?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
