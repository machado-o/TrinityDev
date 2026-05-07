# Roteiro — Apresentação SAV Back-End (Casos de Uso)

**Formato:** 3 apresentadores · 1 processo por pessoa · ~5 min cada · Total ~17 min  
**Legenda:** 💬 o que falar · 👉 o que mostrar na tela

---

## CAPA (Slide 1) — ~1 min | Todos

💬 Apresentar o sistema e dividir os processos:
- SAV = sistema de aluguel de veículos para uso interno (atendentes e gestores)
- Três processos: **Reserva**, **Check-in**, **Check-out** — um por integrante
- Mostrar brevemente a stack: Node.js · Express · Sequelize · PostgreSQL

---

## PROCESSO 1 — RESERVA (Slides 2–6) | ~5 min

---

### Slide 2 — Visão Geral ⏱ ~1 min

💬 O que acontece numa reserva:
- Atendente informa cliente, categoria do veículo, seguro e as **duas agências** (retirada e devolução)
- **Valores financeiros são calculados pelo serviço** — o front-end não envia diária, quantidade de dias nem valor final

👉 Apontar para a tabela `reservas` e destacar que `ag_ret` e `ag_dev` podem ser agências diferentes (ex: reserva 2)

---

### Slide 3 — Fluxo de Transação ⏱ ~1 min

💬 Ordem de execução no service:
1. Busca paralela: cliente + funcionário + categoria (`Promise.all`)
2. Valida regras de negócio: data, agências ativas, conflito de período
3. Calcula valores financeiros (com possível desconto)
4. Valida modelo Sequelize
5. Se houver erro → lança string → middleware retorna 400
6. Sem erro → `Reserva.create()` (INSERT único, sem transação explícita)

👉 Clicar em "Visualizar Fluxo em Tabela" para mostrar a tabela completa

---

### Slide 4 — Regras de Negócio ⏱ ~1 min

💬 Três verificações antes de criar a reserva:

- **Pré-condições** (validação simples):
  - `dataRetirada` não pode ser no passado
  - Ambas as agências devem ter `status = 'Ativa'`

- **RN1 — Desconto** (cálculo):
  - Agência com ≥ 2 reservas concluídas **E** `quantidadeDias ≥ limiteDiasDesconto` → aplica desconto percentual no `valorFinal`

- **RN2 — Conflito de período** (bloqueio):
  - Cliente não pode ter duas reservas com datas sobrepostas e status ativo
  - Condição clássica de sobreposição de intervalos

---

### Slide 5 — Implementação da RN1 (Desconto) ⏱ ~1 min

💬 Como o desconto é calculado:
- O service faz `Agencia.findOne()` com **JOIN** em `reservasRetirada` filtrado por `status = 'Concluída'`
- Conta o array retornado em JavaScript (`reservasRetirada.length`)
- Se ≥ 2 reservas concluídas **E** `quantidadeDias ≥ limiteDiasDesconto` → `valorFinal *= (1 - percentual / 100)`

👉 Destacar o LEFT JOIN no SQL resultante que filtra só as reservas concluídas

---

### Slide 6 — Implementação da RN2 (Conflito de período) ⏱ ~1 min

💬 Como o conflito de período é detectado:
- `Reserva.findOne()` com filtro de sobreposição de datas:
  - `dataRetirada < dataDevolucaoNova` **E** `dataDevolucao > dataRetiradaNova`
- Exclui reservas com `status IN ('Cancelada', 'Concluída')` — só bloqueia se ativa
- Se encontrar qualquer resultado → erro "O cliente já possui uma reserva no período solicitado!"

👉 Mostrar o SQL resultante e apontar o `LIMIT 1` — basta encontrar 1 conflito para bloquear

---

## PROCESSO 2 — CHECK-IN (Slides 7–11) | ~5 min

---

### Slide 7 — Visão Geral ⏱ ~1 min

💬 O que o check-in faz:
- Vincula a reserva a um **veículo físico específico**
- Valida CNH, verifica débitos e encontra um veículo disponível
- Ao final: reserva vai para `Confirmada`, veículo vai para `Reservado`

👉 Mostrar a tabela `checkins` (2 exemplos) e a tabela `veiculos` — apontar os status `Disponível` / `Reservado`

---

### Slide 8 — Fluxo de Transação ⏱ ~1 min

💬 Diferença importante em relação à reserva: **usa transação explícita**
- Valida tudo antes de abrir a transação
- Dentro da transação: 3 escritas atômicas
  1. `Checkin.create()`
  2. `veiculo.status = 'Reservado'` → `save()`
  3. `reserva.status = 'Confirmada'` → `save()`
- Se qualquer escrita falhar → ROLLBACK automático

👉 Clicar em "Visualizar Fluxo em Tabela" e destacar as linhas coloridas de azul (BEGIN) e verde (COMMIT)

---

### Slide 9 — Regras de Negócio ⏱ ~1 min

💬 Três verificações antes do check-in:

- **Pré-condições** (validação simples):
  - Reserva deve estar com `status = 'Pendente'`
  - CNH informada deve ser idêntica à CNH do cliente da reserva

- **RN1 — Upgrade automático** (resolução de veículo):
  - Busca veículo `Disponível` na categoria da reserva
  - Se não encontrar → sobe de categoria (`id > categoriaId`) em ordem crescente
  - Seleciona o primeiro disponível da primeira categoria superior

- **RN2 — Débitos pendentes** (bloqueio):
  - Se cliente tiver qualquer multa com `status = 'Pendente'` → check-in negado

---

### Slide 10 — Implementação da RN1 (Upgrade) ⏱ ~1 min

💬 Três SQLs em sequência:
1. `SELECT * FROM veiculos WHERE categoria_veiculo_id = 1 AND status = 'Disponível'` → 0 linhas
2. `SELECT * FROM categoria_veiculos WHERE id > 1 ORDER BY id ASC` → lista de categorias superiores
3. Para cada categoria superior: `SELECT * FROM veiculos WHERE categoria_veiculo_id = N AND status = 'Disponível' LIMIT 1`
   - Primeiro resultado encontrado → esse é o veículo do check-in (upgrade gratuito)

👉 Apontar para o exemplo: catEconômico sem disponíveis → upgrade para catHatch → veículo id=3 (BYD Dolphin)

---

### Slide 11 — Implementação da RN2 (Débitos) ⏱ ~1 min

💬 Implementação mais simples do sistema:
- `Multa.count({ where: { clienteId, status: 'Pendente' } })`
- Um único `SELECT COUNT(*)` — não carrega os objetos de multa, só conta
- `count > 0` → lança erro → middleware retorna 400
- Exemplo: cliente1 (Henrique) tem 1 multa Pendente de R$ 195,23 → check-in bloqueado

👉 Mostrar o SQL resultante com o `COUNT(*)`

---

## PROCESSO 3 — CHECK-OUT (Slides 12–16) | ~5 min

---

### Slide 12 — Visão Geral ⏱ ~1 min

💬 O que o check-out faz:
- Registra a devolução: quilometragem final + avarias encontradas no veículo
- Ao final: reserva vai para `Concluída`, veículo volta para `Disponível`, quilometragem do veículo é atualizada

👉 Mostrar a tabela `checkouts` e a `checkout_avarias` — destacar que checkouts 5 e 6 (Lucas) têm 4 avarias no total

---

### Slide 13 — Fluxo de Transação ⏱ ~1 min

💬 Detalhe importante: RN2 é calculada **antes** de abrir a transação

A transação é um bloco de operações que o banco executa em conjunto. Se qualquer
uma falhar, todas são desfeitas (é um tudo ou nada).

Por que a taxa é calculada fora? Calcular a taxa `calcularTaxaInspecao()` exige duas consultas grandes no banco (JOIN em checkins + checkouts com avarias). Se a gente deixasse isso dentro da transação, o banco ficaria travado esperando essas consultas enquanto outras operações aguardam. Então o código calcula o número antes, guarda o resultado, e aí abre a transação só para as escritas — que são rápidas.

Dentro da transação acontecem 4 coisas em sequência:
- Só depois abre a transação com 4 escritas atômicas:
  1. Cria o registro do checkout (com a taxa já calculada) - `Checkout.create()`
  2. Vincula as avarias a esse checkout - `obj.setAvarias()`
  3. Atualiza o veículo (km nova + status Disponível) - `veiculo.quilometragem = quilometragemCheckout; veiculo.status = 'Disponível'` → `save()`
  4. Atualiza a reserva (status Concluída) - `reserva.status = 'Concluída'` → `save()`

👉 Clicar em "Visualizar Fluxo em Tabela" e destacar o passo 6 (cálculo da taxa fora da transação)

---

### Slide 14 — Regras de Negócio ⏱ ~1 min

💬 Duas regras:

- **RN1 — Quilometragem válida** (validação em 2 etapas):
  - Etapa 1: deve ser maior que a quilometragem do check-in
  - Etapa 2: não pode ser menor que o **máximo histórico** de todos os checkouts daquele veículo
  - Garante que o odômetro nunca regride

- **RN2 — Taxa de inspeção** (cálculo):
  - Soma todas as avarias de todos os checkouts anteriores do cliente
  - `totalAvarias > 3` → cobra R$ 150,00

---

### Slide 15 — Implementação da RN1 (Quilometragem) ⏱ ~1 min

💬 O desafio técnico: calcular o MAX via JOIN com Sequelize
- `Checkout.findOne()` com `Sequelize.fn('MAX', ...)` e **JOIN** com `Checkin` filtrado por `veiculoId`
- Parâmetros obrigatórios: `raw: true` e `subQuery: false` para gerar o SQL de agregação corretamente
- Exemplo: veículo 5 (Toyota Corolla) → histórico máximo = 31.800 km · check-in 7 registrou 50.000 km → checkout deve ser > 50.000

👉 Mostrar o SQL resultante com `MAX()` e `INNER JOIN checkins`

---

### Slide 16 — Implementação da RN2 (Taxa de Inspeção) ⏱ ~1 min

💬 Dois SQLs + contagem em JavaScript:
1. `SELECT checkins.id FROM checkins INNER JOIN reservas WHERE reservas.cliente_id = 5` → ids: 5, 6, 8
2. `SELECT checkouts + avarias WHERE checkin_id IN (5, 6, 8)` → checkout5 (2 avarias) + checkout6 (2 avarias)
3. `.reduce()` soma em JS: 4 avarias > 3 → `taxaInspecao = 150.00`

👉 Apontar que o checkin8 aparece na query mas ainda não tem checkout — contribui 0 avarias

---

> **Dica de timing:** cada slide = ~1 min. Nos slides de implementação, se precisar demo ao vivo, corte 30s da visão geral do mesmo processo.  
> **Dica de apresentação:** nas telas com tabelas, use o clique para expandir no modal quando quiser mostrar dados detalhados para a plateia.
