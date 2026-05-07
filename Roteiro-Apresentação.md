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

Vou falar sobre o processo de Check-in. O objetivo é basicamente vincular uma reserva a um veículo físico.

A tabela checkins registra cada operação — campos como data_checkin, quilom., cnh_condutor e as chaves res_id e vei_id associando reserva e veículo.

Na tabela veiculos, o campo status tem um ciclo de vida bem definido: começa como 'Disponível', vai para 'Reservado' após o check-in, e volta para 'Disponível' após o check-out.

Para o check-in ser aceito, quatro pré-condições precisam ser satisfeitas: reserva com status = 'Pendente', CNH batendo com a do cliente, sem multas pendentes, e veículo disponível — ou upgrade automático."

---

### Slide 8 — Fluxo de Transação ⏱ ~1 min

Aqui vou mostrar o CheckinService.js

Primeiro, usamos o Promise.all([reserva, funcionario]) para buscar os dois em paralelo. Se qualquer um não existir, o array erros é preenchido e lança um throw erros.join() com HTTP 400 — sem nem entrar no banco.

Passando essa etapa, a gente chama o verificarRegrasDeNegocio(), que resolve qual veículo será usado.

Aí entra o sequelize.transaction(): o Checkin.create() é executado, depois veiculo.status = 'Reservado' e reserva.status = 'Confirmada' — tudo dentro da mesma transação, com COMMIT automático ao final.

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

Aqui o sistema executa três SQLs em sequência.

O primeiro busca veículos disponíveis na categoria da reserva — categoria_veiculo_id = 1 com status = 'Disponível'. Retornou zero linhas, então aciona o upgrade.

O segundo busca todas as categorias com ID maior que 1, em ordem crescente — essas são as categorias superiores disponíveis para upgrade.

O terceiro percorre cada uma dessas categorias e faz um SELECT com LIMIT 1 — pega o primeiro veículo disponível que encontrar.

Olhando pro exemplo aqui: catEconômico não tinha nenhum disponível, subiu para catHatch, e o veículo id=3 — o BYD Dolphin — foi selecionado. Upgrade feito, e de graça pro cliente.

👉 Apontar para o exemplo: catEconômico sem disponíveis → upgrade para catHatch → veículo id=3 (BYD Dolphin)

---

### Slide 11 — Implementação da RN2 (Débitos) ⏱ ~1 min

Agora, vamos pra Regra de negócio 2:

A função faz um Multa.count() filtrando por clienteId e status: 'Pendente'. O Sequelize traduz isso pra um único SELECT COUNT(*) — nem carrega os objetos de multa, só conta.

Se o resultado for maior que zero, lança o erro — e o middleware devolve um HTTP 400 pro cliente.

Por exemplo: se o cliente tiver qualquer multa de avaria pendente de checkins anteriores, isso já é suficiente pra bloquear o check-in completamente — ele precisa quitar antes de seguir.

E com isso fecho o processo: validações feitas, transação segura, status atualizados de forma atômica. (Ou seja, ou tudo salva, ou nada salva, por conta do rollback.)

---

## PROCESSO 3 — CHECK-OUT (Slides 12–16) | ~5 min

---

### Slide 12 — Visão Geral ⏱ ~1 min

O check-out é o momento em que você devolve o carro na agência. O atendente anota quantos km o carro rodou, vê se voltou com alguma batida ou arranhão, e fecha o contrato. É exatamente isso que o sistema faz.
Quando o check-out é registrado, três coisas acontecem no banco:

A reserva muda para Concluída — o contrato acabou
O veículo volta para Disponível — pode ser alugado de novo
A quilometragem do veículo é atualizada com o valor que o carro marcava na devolução

👉 Mostrar a tabela `checkouts` e a `checkout_avarias` — destacar que checkouts 5 e 6 (Lucas) têm 4 avarias no total

---

### Slide 13 — Fluxo de Transação ⏱ ~1 min

Esse slide mostra a ordem das operações. Vou descer pelo fluxo da esquerda acompanhando as setas:
As primeiras etapas são as validações, antes de qualquer escrita no banco:
1. Pega os dados do formulário
2. Busca o check-in e o funcionário ao mesmo tempo
3. Valida a quilometragem e a data
4. Se tiver qualquer erro → para tudo aqui e devolve HTTP 400. Se não tiver → segue

Depois das validações, ainda fora da transação, acontece o ponto mais importante do slide:
1. Busca a reserva usando o checkin.reservaId — porque é dentro da reserva que está o clienteId do cliente, que a gente precisa pra calcular a taxa na próxima etapa.
2. Calcula a taxa de inspeção com calcularTaxaInspecao()

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

 O desafio aqui é buscar o maior km já registrado para um veículo específico. Isso exige uma consulta com `MAX()` no banco, cruzando a tabela de checkouts com a de checkins para saber de qual veículo estamos falando.
Para fazer isso, o código usa `Checkout.findOne()` com `Sequelize.fn('MAX', ...)` — que é a forma do Sequelize de chamar uma função de agregação do banco, como o `MAX()` — junto com um `JOIN` na tabela de checkins filtrado pelo `veiculoId`.
O Sequelize tem um comportamento estranho nesse caso e gera um SQL errado por padrão. Por isso o código usa dois parâmetros especiais:

1. `raw: true` — diz pro Sequelize devolver o resultado como dado puro, sem tentar montar objetos por cima
2. `subQuery: false` — força ele a gerar um `JOIN` direto em vez de uma subquery aninhada, que quebraria o `MAX()`

Juntos, esses dois parâmetros garantem que o SQL gerado seja o correto.
O exemplo do slide: O Toyota Corolla já foi devolvido uma vez com 31.800 km. Depois, numa outra locação, o check-in registrou 50.000 km. Então o checkout dessa segunda locação precisa ser maior que 50.000 — a Etapa 1 já garante isso. A Etapa 2 só seria decisiva num cenário onde não há check-in anterior para comparar, mas existe um checkout antigo com km alta.

👉 Mostrar o SQL resultante com MAX() e INNER JOIN checkins

---

### Slide 16 — Implementação da RN2 (Taxa de Inspeção) ⏱ ~1 min
💬 O sistema precisa somar todas as avarias do cliente em todos os seus aluguéis anteriores. Ele faz isso em dois passos:

Passo 1: Busca todos os check-ins que o cliente já fez, passando pela tabela de reservas — porque é lá que fica o cliente_id. Para o Lucas, retorna os ids 5, 6 e 8.
Passo 2: Para esses check-ins, busca todos os checkouts e as avarias de cada um. O checkout 5 tinha 2 avarias, o checkout 6 tinha 2 avarias. O checkin 8 aparece na busca mas ainda não tem checkout — contribui zero.

Passo 3: O código soma tudo em JavaScript com `.reduce(): 2 + 2 + 0 = 4` avarias. Como 4 > 3, cobra R$ 150,00.

👉 Apontar que o checkin8 aparece na query mas ainda não tem checkout — contribui 0 avarias

---

> **Dica de timing:** cada slide = ~1 min. Nos slides de implementação, se precisar demo ao vivo, corte 30s da visão geral do mesmo processo.  
> **Dica de apresentação:** nas telas com tabelas, use o clique para expandir no modal quando quiser mostrar dados detalhados para a plateia.
