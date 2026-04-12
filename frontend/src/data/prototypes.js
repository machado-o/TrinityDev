export const prototypes = {
  reservas: {
    title: 'Reservas',
    buttonLabel: '+ Nova Reserva',
    columns: ['Cliente', 'Categoria', 'Funcionário', 'Retirada', 'Devolução', 'Valor Final', 'Ações'],
    rows: [
      ['Ana Souza', 'SUV', 'Carlos Lima', '15/04/2026 09:00', '18/04/2026 09:00', 'R$ 1.250,00'],
      ['Paulo Dias', 'Sedan', 'Marina Costa', '17/04/2026 14:30', '20/04/2026 14:30', 'R$ 980,00'],
    ],
    fields: [
      ['Cliente', 'select'], ['Categoria de Veículo', 'select'], ['Funcionário', 'select'], ['Seguro (opcional)', 'select'],
      ['Agência de Retirada', 'select'], ['Agência de Devolução', 'select'], ['Data Retirada', 'datetime-local'], ['Data Devolução', 'datetime-local'],
      ['Valor Diária', 'number'], ['Quantidade Dias', 'number'], ['Valor Seguro', 'number'], ['Valor Final', 'number'],
    ],
  },
  checkins: {
    title: 'Check-in',
    buttonLabel: '+ Novo Check-in',
    columns: ['Reserva', 'Veículo', 'Funcionário', 'Data', 'Horário', 'Quilometragem', 'Ações'],
    rows: [['#124', 'ABC1D23', 'Marina Costa', '15/04/2026', '09:15', '42.130 km']],
    fields: [
      ['Reserva', 'select'], ['Veículo Disponível', 'select'], ['Funcionário', 'select'], ['Data Check-in', 'date'],
      ['Horário Check-in', 'time'], ['CNH Condutor', 'text'], ['Validade CNH', 'date'], ['Quilometragem Check-in', 'number'],
      ['Nível Combustível', 'select'],
    ],
  },
  checkouts: {
    title: 'Check-out',
    buttonLabel: '+ Novo Check-out',
    columns: ['Check-in', 'Funcionário', 'Data', 'Quilometragem', 'Avarias', 'Taxa', 'Ações'],
    rows: [['#98', 'Carlos Lima', '20/04/2026', '43.011 km', 'Não', 'R$ 0,00']],
    fields: [
      ['Check-in', 'select'], ['Funcionário', 'select'], ['Data Check-out', 'date'], ['Horário Check-out', 'time'],
      ['Quilometragem Check-out', 'number'], ['Nível Combustível', 'select'], ['Condição Pneus', 'select'], ['Condição Palhetas', 'select'],
      ['Limpo Internamente', 'checkbox'], ['Limpo Externamente', 'checkbox'], ['Possui Avarias', 'checkbox'], ['Avarias', 'select'],
      ['Taxa Inspeção', 'number'], ['Observações', 'textarea'],
    ],
  },
  veiculos: {
    title: 'Veículos',
    buttonLabel: '+ Novo Veículo',
    columns: ['Placa', 'Marca/Modelo', 'Categoria', 'Agência', 'Status', 'Ações'],
    rows: [['ABC1D23', 'Toyota Corolla', 'Sedan', 'Matriz', 'Disponível']],
    fields: [
      ['Placa', 'text'], ['Chassi', 'text'], ['Marca', 'select'], ['Modelo', 'text'], ['Cor', 'select'], ['Ano Fabricação', 'number'],
      ['Quilometragem', 'number'], ['Status', 'select'], ['Categoria', 'select'], ['Agência', 'select'],
    ],
  },
  categorias: {
    title: 'Categorias de Veículo',
    buttonLabel: '+ Nova Categoria',
    columns: ['Nome', 'Diária', 'Carroceria', 'Propulsão', 'Capacidade', 'Ações'],
    rows: [['SUV Premium', 'R$ 320,00', 'SUV', 'Híbrido', '5 passageiros']],
    fields: [
      ['Nome', 'text'], ['Descrição', 'textarea'], ['Valor Diária', 'number'], ['Tipo Carroceria', 'select'], ['Propulsão', 'select'],
      ['Câmbio', 'select'], ['Ar-condicionado', 'checkbox'], ['Capacidade', 'number'],
    ],
  },
  avarias: {
    title: 'Avarias',
    buttonLabel: '+ Nova Avaria',
    columns: ['Descrição', 'Valor', 'Ações'],
    rows: [['Arranhão lateral', 'R$ 350,00']],
    fields: [['Nome/Descrição', 'text'], ['Valor', 'number']],
  },
  seguros: {
    title: 'Seguros',
    buttonLabel: '+ Novo Seguro',
    columns: ['Nome', 'Seguradora', 'Diária Adicional', 'Franquia', 'Ações'],
    rows: [['Proteção Total', 'Segura Bem', 'R$ 45,00', 'R$ 2.000,00']],
    fields: [['Nome', 'text'], ['Empresa Seguradora', 'text'], ['Descrição', 'textarea'], ['Valor Diária Adicional', 'number'], ['Franquia', 'number']],
  },
  coberturas: {
    title: 'Coberturas',
    buttonLabel: '+ Nova Cobertura',
    columns: ['Nome', 'Indenização Máxima', 'Descrição', 'Ações'],
    rows: [['Terceiros', 'R$ 50.000,00', 'Cobertura contra danos a terceiros']],
    fields: [['Nome', 'text'], ['Descrição', 'textarea'], ['Valor Indenização Máx.', 'number']],
  },
  clientes: {
    title: 'Clientes',
    buttonLabel: '+ Novo Cliente',
    columns: ['Nome', 'CPF', 'CNH', 'Validade CNH', 'Contato', 'Ações'],
    rows: [['Ana Souza', '123.456.789-00', '12345678901', '11/09/2029', 'ana@email.com']],
    fields: [
      ['Nome', 'text'], ['CPF', 'text'], ['Data Nascimento', 'date'], ['E-mail', 'email'], ['Telefone', 'text'],
      ['CNH', 'text'], ['Validade CNH', 'date'], ['Endereço', 'text'],
    ],
  },
  funcionarios: {
    title: 'Funcionários',
    buttonLabel: '+ Novo Funcionário',
    columns: ['Nome', 'CPF', 'Cargo', 'Agência', 'Contato', 'Ações'],
    rows: [['Carlos Lima', '987.654.321-00', 'Gerente', 'Matriz', 'carlos@email.com']],
    fields: [
      ['Nome', 'text'], ['CPF', 'text'], ['Cargo', 'select'], ['E-mail', 'email'], ['Telefone', 'text'], ['Senha', 'password'], ['Agência', 'select'],
    ],
  },
  multas: {
    title: 'Multas',
    buttonLabel: '+ Nova Multa',
    columns: ['Cliente', 'Valor', 'Emissão', 'Status', 'Ações'],
    rows: [['Paulo Dias', 'R$ 180,00', '14/04/2026 10:20', 'Pendente']],
    fields: [['Cliente', 'select'], ['Valor', 'number'], ['Data Emissão', 'datetime-local'], ['Descrição', 'textarea'], ['Status', 'select']],
  },
  agencias: {
    title: 'Agências',
    buttonLabel: '+ Nova Agência',
    columns: ['Nome', 'CNPJ', 'Telefone', 'Status', 'Ações'],
    rows: [['Mova-se Matriz', '12.345.678/0001-90', '(27) 4002-8922', 'Ativa']],
    fields: [['Nome', 'text'], ['CNPJ', 'text'], ['Endereço', 'text'], ['Telefone', 'text'], ['E-mail', 'email'], ['Status', 'select']],
  },
};
