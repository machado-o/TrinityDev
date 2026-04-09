# Revisão de Design — SAV

Problemas de design, redundâncias e inconsistências encontrados no projeto.
Cada item descreve o problema, o motivo e a correção sugerida.

---

## Bugs Reais (já corrigidos)

### ✅ Seed sem `agenciaId` nos veículos
**Arquivo:** `src/config/database-connection.js:213–256`
**Problema:** Os 4 veículos eram criados sem `agenciaId`, que é `NOT NULL` no modelo. O servidor falhava na inicialização.
**Correção aplicada:** `agenciaId` adicionado a cada veículo, associando-os à agência correspondente.

---

## Alta Prioridade — Bugs Funcionais

### 1. Erro 404 nunca é retornado (error-handler quebrado)
**Arquivo:** `src/_middleware/error-handler.js:5`
**Problema:** A lógica detecta 404 verificando se o erro termina com `"not found"` em inglês. Mas **todas** as mensagens dos services são em português (ex: `"Reserva não encontrada!"`). Resultado: toda busca por ID inexistente retorna `400` em vez de `404`.
**Correção:** Trocar a condição para `err.toLowerCase().endsWith('não encontrado!') || err.toLowerCase().endsWith('não encontrada!')`, ou padronizar um sufixo único nas mensagens dos services.

---

### 2. Validação de data futura no model da Reserva quebra updates
**Arquivo:** `src/models/Reserva.js:13–22`
**Problema:** O validator `isValidDate` verifica se `dataRetirada >= hoje`. Funciona na criação, mas o Sequelize re-executa validações no `save()`. Se alguém tentar atualizar qualquer campo de uma reserva cuja data de retirada já passou (ex: trocar o funcionário), o update é rejeitado com erro de validação de data.
**Correção:** Mover essa validação para o `ReservaService.create()`, fora do model.

---

### 3. Senha do funcionário exposta na API
**Arquivo:** `src/services/FuncionarioService.js:5–13`
**Problema:** `findAll` e `findByPk` retornam o hash bcrypt da senha no JSON de resposta. Qualquer chamada para `GET /funcionarios` expõe todos os hashes.
**Correção:** Adicionar `attributes: { exclude: ['senha'] }` nas queries de leitura.

---

### 4. `SequelizeUniqueConstraintError` ignora as mensagens personalizadas dos models
**Arquivo:** `src/_middleware/error-handler.js:14–15`
**Problema:** O handler retorna `"Não podem existir dois registros com a mesma chave!"` — uma mensagem genérica. Os models definem mensagens específicas (ex: `"Este CPF já está cadastrado no sistema!"`), mas o handler as descarta.
**Correção:** Usar `err.errors[0].message` em vez da mensagem hardcoded, igual ao que já é feito para `SequelizeValidationError`.

---

## Média Prioridade — Design Questionável

### 5. `possuiAvarias` no Checkout é redundante
**Arquivo:** `src/models/Checkout.js:72–79`
**Problema:** Campo boolean que precisa ser mantido manualmente em sincronia com a relação M:N `Checkout ↔ Avaria`. Basta verificar `checkout.avarias.length > 0`. Se alguém criar um checkout com `possuiAvarias: false` mas depois associar avarias, os dados ficam inconsistentes.
**Correção:** Remover o campo. A informação é derivável da associação.

---

### 6. Campos financeiros da Reserva são enviados pelo cliente, não calculados
**Arquivo:** `src/models/Reserva.js:38–74` / `src/services/ReservaService.js:17–45`
**Problema:** `quantidadeDias`, `valorDiaria`, `valorSeguro` e `valorFinal` são persistidos exatamente como chegam no request body. O sistema não valida se os valores batem com a realidade (categoria escolhida, seguro, datas). Qualquer frontend ou Postman pode mandar `valorFinal: 1.00` numa reserva de 30 dias de SUV Premium com seguro.
**Correção:** O `ReservaService.create()` deve calcular esses campos a partir das entidades associadas:
- `quantidadeDias` = diferença entre `dataDevolucao` e `dataRetirada`
- `valorDiaria` = `CategoriaVeiculo.valorDiaria`
- `valorSeguro` = `Seguro.valorDiariaAdicional * quantidadeDias` (se houver seguro)
- `valorFinal` = `(valorDiaria + valorDiariaSeguro) * quantidadeDias`

---

### 7. `cnhCondutor` e `cnhValidade` no Checkin duplicam dados do Cliente
**Arquivo:** `src/models/Checkin.js:23–45`
**Problema:** O `Cliente` já tem `cnh` e `validadeCnh`. O `Checkin` guarda os mesmos dados novamente. Não há validação cruzada — o atendente poderia digitar uma CNH completamente diferente da CNH do cliente da reserva e o sistema aceita sem questionar.
**Opção A (simples):** Remover `cnhCondutor` e `cnhValidade` do Checkin, buscar direto do cliente via `checkin.reserva.cliente`.
**Opção B (auditoria):** Manter, mas no `CheckinService.create()` validar que `cnhCondutor === reserva.cliente.cnh` antes de persistir.

---

### 8. `Multa` não tem referência ao aluguel que a gerou
**Arquivo:** `src/models/Multa.js`
**Problema:** `Multa` pertence apenas ao `Cliente`, sem FK para `Reserva` ou `Checkout`. Se um cliente tem 3 multas, não dá para saber qual locação gerou cada uma.
**Correção:** Adicionar `reservaId` (ou `checkinId`) como FK opcional na Multa.

---

### 9. `Avaria` é uma entidade global com M:N — design não reflete a realidade
**Arquivo:** `src/models/Avaria.js` / `src/models/Checkout.js:114–133`
**Problema:** Uma Avaria é criada solta, sem pertencer a nenhum Checkout, e pode ser reutilizada em múltiplos checkouts via M:N. Isso significa "Arranhão na porta" vira um cadastro genérico reaproveitável — o que não reflete a realidade: cada dano é um evento único de um veículo em um momento específico.
**Correção:** Mudar para relação 1:N — `Avaria` pertence a um `Checkout` com FK direta. Remover a tabela pivot `checkout_avaria`.

---

### 10. Status do veículo é totalmente manual
**Arquivo:** `src/models/Veiculo.js:27–35`
**Problema:** O campo `status` ('Disponível', 'Reservado', 'Manutenção') não é gerenciado automaticamente. Criar uma reserva não muda o veículo para 'Reservado'. Concluir um checkout não o volta para 'Disponível'. O status fica inconsistente por omissão.
**Correção:** Atualizar o status do veículo dentro dos services de Checkin e Checkout:
- `CheckinService.create()` → veículo associado vai para `'Reservado'`
- `CheckoutService.create()` → veículo associado volta para `'Disponível'`

---

### 11. Reserva não tem campo de status
**Arquivo:** `src/models/Reserva.js`
**Problema:** Não há como saber se uma reserva está pendente, ativa, cancelada ou concluída sem percorrer checkin e checkout. Para relatórios ou listagens isso é problemático.
**Correção:** Adicionar `status: ENUM('Pendente', 'Confirmada', 'Cancelada', 'Concluída')` ao model Reserva, atualizado automaticamente pelos services de Checkin e Checkout.

---

## Baixa Prioridade — Inconsistências Menores

### 12. Inconsistência de tipos entre data+hora de Reserva e data/hora de Checkin/Checkout
**Problema:** `Reserva` usa `DataTypes.DATE` (datetime) para `dataRetirada`/`dataDevolucao`. `Checkin` e `Checkout` usam `DataTypes.DATEONLY` + `DataTypes.TIME` separados. Não há padrão no projeto.
**Sugestão:** Padronizar para `DataTypes.DATE` (datetime) em todos, eliminando os campos de horário separados.

---

### 13. `include: { all: true, nested: true }` em todos os findAll — risco de performance
**Arquivo:** Todos os services
**Problema:** Um `GET /reservas` carrega cada reserva com cliente, categoria, funcionario, seguro (com todas as coberturas), duas agências (com todos os funcionários e veículos), e o checkin (com veículo, funcionário e checkout com avarias e funcionário). Para um dataset real isso é muito pesado e pode gerar N+1 queries.
**Sugestão:** Para as listagens (`findAll`), usar includes seletivos apenas das associações diretas. Manter `{ all: true, nested: true }` apenas no `findByPk` onde o detalhe completo faz sentido.

---

### 14. Agência inativa pode receber novas reservas
**Arquivo:** `src/services/ReservaService.js`
**Problema:** Não há validação se a `agenciaRetirada` ou `agenciaDevolucao` tem `status: 'Inativa'` antes de criar uma reserva.
**Correção:** No `ReservaService.create()`, buscar as agências e lançar erro se alguma estiver inativa.

---

### 15. `FuncionarioService.update()` não exige confirmação para trocar senha
**Arquivo:** `src/services/FuncionarioService.js:42–73`
**Problema:** Qualquer PUT para `/funcionarios/:id` com um campo `senha` no body vai substituir a senha sem exigir a senha atual. Para um sistema interno pode ser aceitável, mas é um risco se houver autenticação no futuro.
**Sugestão:** Pelo menos validar se `senha` está presente no body antes de incluir no patch (já acontece pelo `Object.keys` filter), mas considerar exigir `senhaAtual` para confirmação.

---

## Resumo por Prioridade

| # | Problema | Categoria | Arquivo Principal |
|---|---|---|---|
| 1 | Erro 404 nunca retornado | Bug funcional | `error-handler.js` |
| 2 | Validação de data quebra updates de Reserva | Bug funcional | `Reserva.js` |
| 3 | Senha exposta no GET /funcionarios | Segurança | `FuncionarioService.js` |
| 4 | UniqueConstraintError ignora msg personalizada | Bug funcional | `error-handler.js` |
| 5 | `possuiAvarias` redundante | Design | `Checkout.js` |
| 6 | Valores financeiros não calculados | Integridade | `ReservaService.js` |
| 7 | CNH duplicada no Checkin | Redundância | `Checkin.js` |
| 8 | Multa sem referência ao aluguel | Rastreabilidade | `Multa.js` |
| 9 | Avaria M:N em vez de 1:N | Design | `Avaria.js` / `Checkout.js` |
| 10 | Status do veículo não atualizado automaticamente | Inconsistência | `VeiculoService.js` |
| 11 | Reserva sem campo de status | Design | `Reserva.js` |
| 12 | Tipos de data/hora inconsistentes | Inconsistência | Vários models |
| 13 | `include: { all: true, nested: true }` em findAll | Performance | Todos os services |
| 14 | Agência inativa aceita reservas | Regra de negócio | `ReservaService.js` |
| 15 | Troca de senha sem confirmação | Segurança | `FuncionarioService.js` |
