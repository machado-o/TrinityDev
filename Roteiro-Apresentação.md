# Roteiro — Apresentação SAV Back-End (Casos de Uso)

**Formato:** 3 apresentadores · 1 processo por pessoa · ~5 min cada · Total ~17 min  
**Legenda:** 💬 o que falar · 👉 o que mostrar na tela

---

## CAPA (Slide 1) — ~1 min | Todos

O sistema que vamos apresentar hoje é o SAV — Sistema de Aluguel de Veículos. É um sistema de uso interno, voltado para atendentes e gestores de agências de locação — não para os clientes finais.

A stack é Node.js com Express, Sequelize e PostgreSQL. A apresentação está dividida em três processos: Reserva, Check-in e Check-out — um por integrante. Eu vou cobrir o processo de Reserva, depois vem o Check-in, e fechamos com o Check-out.

---

## PROCESSO 1 — RESERVA (Slides 2–6) | ~5 min

---

### Slide 2 — Visão Geral ⏱ ~1 min

Vou apresentar o processo de Reserva. No SAV, uma reserva é criada pelo atendente — ele informa o cliente, a categoria do veículo, o seguro e duas agências: a de retirada e a de devolução. Essas agências podem ser diferentes, o que permite o cliente pegar o carro numa cidade e devolver em outra.

Um detalhe importante: o front-end não envia os valores. O serviço é que calcula tudo — a diária, a quantidade de dias e o valor final. Isso garante que os preços nunca sejam manipulados pela requisição.

👉 Apontar para a tabela `reservas` e destacar que `ag_ret` e `ag_dev` podem ser agências diferentes (ex: reserva 2)

---

### Slide 3 — Fluxo de Transação ⏱ ~1 min

Aqui vou mostrar o ReservaService.create().

O serviço começa com um Promise.all buscando o cliente, o funcionário e a categoria ao mesmo tempo — em paralelo. Se qualquer um desses não existir, já para aqui e devolve um erro.

Passando essa etapa, entra a verificação das regras de negócio: a data de retirada, o status das agências e o conflito de período. Se houver erro em qualquer uma dessas, o service lança uma string e o middleware retorna HTTP 400.

Depois calcula os valores financeiros — com o possível desconto da RN1. Só então passa pela validação do modelo Sequelize e, se tudo estiver certo, executa o Reserva.create(). É um INSERT único, sem transação explícita, porque o service não faz mais de uma escrita.

👉 Clicar em "Visualizar Fluxo em Tabela" para mostrar a tabela completa

---

### Slide 4 — Regras de Negócio ⏱ ~1 min

O processo de reserva tem três verificações antes de criar o registro.

As duas primeiras são simples: a data de retirada não pode estar no passado, e as duas agências precisam ter status igual a Ativa. Se qualquer uma dessas falhar, o serviço nem segue em frente.

Depois tem a RN1, o desconto. A lógica é: se a agência de retirada tem pelo menos 2 reservas concluídas no histórico e a reserva tem dias suficientes para atingir o limite configurado, aplica o desconto percentual no valor final.

E a RN2 é o conflito de período — o sistema impede que o mesmo cliente tenha duas reservas com datas que se sobreponham e com status ativo. O clássico problema de sobreposição de intervalos.

---

### Slide 5 — Implementação da RN1 (Desconto) ⏱ ~1 min

O desconto depende de saber se a agência tem histórico suficiente — por isso o service faz um Agencia.findOne() com um JOIN em reservasRetirada, filtrando só as com status igual a Concluída.

O resultado vem como um objeto Sequelize com o array reservasRetirada populado. O código conta o tamanho desse array em JavaScript: se tiver pelo menos 2, e se a quantidade de dias da reserva for maior ou igual ao limiteDiasDesconto da categoria, aplica o desconto. A fórmula é: valorFinal multiplicado por 1 menos o percentual dividido por 100.

👉 Destacar o LEFT JOIN no SQL resultante que filtra só as reservas concluídas

---

### Slide 6 — Implementação da RN2 (Conflito de período) ⏱ ~1 min

Para detectar o conflito de período, o service faz um Reserva.findOne() com duas condições de data ao mesmo tempo.

A lógica é a condição clássica de sobreposição de intervalos: a dataRetirada da reserva existente precisa ser anterior à dataDevolução da nova, E a dataDevolução da existente precisa ser posterior à dataRetirada da nova. Se as duas forem verdadeiras ao mesmo tempo, há sobreposição.

O filtro exclui reservas com status Cancelada ou Concluída — só bloqueia se a reserva ainda está ativa. E se encontrar qualquer resultado, lança o erro "O cliente já possui uma reserva no período solicitado!".

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
