# Documentação dos Relatórios

## Sumário

1. [Fluxo geral de uma requisição](#fluxo-geral-de-uma-requisição)
2. [Funções auxiliares do service](#funções-auxiliares-do-service)
3. [Glossário de funções SQL](#glossário-de-funções-sql)
4. [Relatório 1 — Reservas por Funcionário](#relatório-1--reservas-por-funcionário)
5. [Relatório 2 — Reservas por Categoria de Veículo](#relatório-2--reservas-por-categoria-de-veículo)
6. [Relatório 3 — Check-ins por Agência](#relatório-3--check-ins-por-agência)
7. [Relatório 4 — Check-ins por Veículo](#relatório-4--check-ins-por-veículo)
8. [Relatório 5 — Checkouts com Avarias por Veículo](#relatório-5--checkouts-com-avarias-por-veículo)
9. [Relatório 6 — Checkouts com Multas por Cliente](#relatório-6--checkouts-com-multas-por-cliente)

---

## Fluxo geral de uma requisição

Todos os relatórios seguem o mesmo caminho, do momento em que a requisição chega até a resposta ser enviada:

```
Cliente HTTP
    │
    ▼
routes.js                      → registra a rota e aponta para o controller correto
    │
    ▼
RelatoriosController           → recebe (req, res, next), chama o service e
    │                            encaminha o resultado com res.json()
    │                            se der erro, repassa para o error-handler via next(err)
    ▼
RelatoriosService              → valida os parâmetros, monta e executa o SQL,
    │                            formata e retorna o objeto de resposta
    ▼
sequelize.query()              → executa o SQL bruto no PostgreSQL
    │
    ▼
montarResposta()               → remove a coluna auxiliar "totalRegistros" e
    │                            empacota os dados com os metadados de paginação
    ▼
res.json()                     → serializa o objeto como JSON e envia ao cliente
```

### Por que o controller é tão simples?

```js
static async findReservasPorFuncionario(req, res, next) {
  RelatoriosService.findReservasPorFuncionario(req)
    .then(objs => res.json(objs))
    .catch(next);
}
```

O controller tem uma única responsabilidade: fazer a ponte entre o Express e o service. Toda a lógica de negócio fica no service. Se o service lançar um erro (seja uma string de validação, seja uma exceção do banco), o `.catch(next)` passa esse erro para o `error-handler` global (`_middleware/error-handler.js`), que decide o status HTTP correto e formata a resposta de erro.

### Parâmetros aceitos por todos os relatórios

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `inicio` | Sim | Data de início do período (`YYYY-MM-DD`) |
| `termino` | Sim | Data de fim do período (`YYYY-MM-DD`) |
| `pagina` | Não | Número da página (padrão: 1) |
| `itensPorPagina` | Não | Itens por página (padrão: 20, máximo: 100) |
| filtro específico | Não | Cada relatório aceita um filtro opcional (ver cada seção) |

### Formato da resposta

```json
{
  "dados": [ { ... }, { ... } ],
  "paginacao": {
    "pagina": 1,
    "itensPorPagina": 20,
    "total": 45,
    "totalPaginas": 3
  }
}
```

---

## Funções auxiliares do service

### `validarPeriodo(inicio, termino)`

Chamada no início de cada método do service. Verifica três coisas:

1. Se `inicio` e `termino` foram fornecidos — se um deles estiver ausente, retorna erro imediatamente sem checar o resto.
2. Se os dois valores conseguem ser convertidos em datas válidas via `new Date()` — um valor como `"abc"` geraria `NaN`.
3. Se `termino` não é anterior a `inicio` — não faz sentido um período que termina antes de começar.

Se encontrar qualquer problema, junta todos os erros em uma string e lança com `throw`. O `error-handler` global captura essa string e responde com status 400.

### `parsePaginacao(query)`

Lê `pagina` e `itensPorPagina` da query string e calcula o `deslocamento` (quantas linhas pular no banco):

```js
const pagina = Math.max(1, parseInt(query.pagina) || 1);
// Math.max(1, ...) garante que a página nunca seja 0 ou negativa
// parseInt(...) || 1 trata valores não-numéricos usando 1 como padrão

const itensPorPagina = Math.min(100, Math.max(1, parseInt(query.itensPorPagina) || 20));
// Math.min(100, ...) impõe o limite máximo de 100 itens por página
// Math.max(1, ...) impede 0 ou negativos

const deslocamento = (pagina - 1) * itensPorPagina;
// Página 1 → deslocamento 0 (começa do início)
// Página 2 → deslocamento 20 (pula os 20 primeiros)
// Página 3 → deslocamento 40 (pula os 40 primeiros)
```

### `montarResposta(rows, pagina, itensPorPagina)`

Recebe as linhas brutas do banco e formata a resposta final:

```js
const total = rows.length > 0 ? parseInt(rows[0].totalRegistros) : 0;
// "totalRegistros" é uma coluna virtual calculada pelo SQL com COUNT(*) OVER()
// ela vem em todas as linhas com o mesmo valor — lemos só da primeira

const totalPaginas = Math.ceil(total / itensPorPagina) || 1;
// Math.ceil arredonda para cima: 45 resultados / 20 por página = 2,25 → 3 páginas
// || 1 garante que mesmo com 0 resultados tenhamos "1 página"

const dados = rows.map(({ totalRegistros, ...rest }) => rest);
// Remove "totalRegistros" de cada objeto antes de enviar ao cliente
// Era uma coluna auxiliar de contagem, não faz parte dos dados do relatório
```

---

## Glossário de funções SQL

Estas funções aparecem repetidamente nos SQLs. Entendê-las uma vez vale para todos os relatórios.

### `COUNT(expressão)`

Conta quantas linhas têm um valor não-nulo na expressão.

- `COUNT(r.id)` — conta todas as reservas (id nunca é nulo).
- `COUNT(DISTINCT r.cliente_id)` — conta quantos clientes *diferentes* aparecem; se o mesmo cliente fez 3 reservas, conta como 1.
- `COUNT(CASE WHEN r.status = 'Concluída' THEN 1 END)` — conta só as linhas em que a condição é verdadeira; quando é falsa, o `CASE` retorna `NULL`, e `COUNT` ignora `NULL`.

### `COUNT(*) OVER()`

É uma **window function** (função de janela). Diferente de `COUNT(r.id)` que conta dentro do grupo atual (depois do `GROUP BY`), o `OVER()` sem partição opera sobre o conjunto inteiro de linhas *após o filtro do `WHERE`*, mas *antes do `LIMIT`*. Por isso consegue retornar o total real de registros em cada linha, permitindo calcular `totalPaginas` sem fazer uma segunda query.

### `SUM(expressão)`

Soma os valores de uma coluna em todas as linhas do grupo.

- `SUM(r.valor_final)` — soma o valor de todas as reservas do funcionário/categoria.

### `AVG(expressão)`

Calcula a média aritmética dos valores de uma coluna no grupo. `AVG(r.valor_final)` soma todos os valores e divide pela contagem.

### `MAX(expressão)`

Retorna o maior valor encontrado no grupo. `MAX(ci.quilometragem_checkin)` devolve a quilometragem mais alta registrada nos check-ins do veículo.

### `COALESCE(valor, substituto)`

Retorna o primeiro argumento que *não* for `NULL`. É usado como proteção: se `SUM` ou `AVG` não encontrar nenhuma linha, retorna `NULL`; `COALESCE(..., 0)` converte esse `NULL` em zero, evitando que o campo apareça como `null` na resposta.

- `COALESCE(SUM(r.valor_final), 0)` — se não houver nenhuma reserva, retorna 0 em vez de null.

### `ROUND(valor::numeric, casas)`

Arredonda um número para a quantidade de casas decimais especificada.

- `::numeric` é um **cast** do PostgreSQL: converte o valor para o tipo `numeric` antes de arredondar, porque `ROUND` exige esse tipo.
- `ROUND(COALESCE(AVG(r.valor_final), 0)::numeric, 2)` — calcula a média, substitui null por 0 e arredonda para 2 casas decimais.

### `CASE WHEN condição THEN valor ELSE outro END`

Expressão condicional dentro do SQL — equivale a um `if/else`.

- `CASE WHEN r.status = 'Concluída' THEN 1 END` — produz `1` quando verdadeiro e `NULL` quando falso (sem `ELSE`, o padrão é `NULL`).
- Combinado com `COUNT`, funciona como um contador condicional: conta apenas as linhas que satisfazem a condição.
- Combinado com `SUM`, acumula valores só quando a condição é verdadeira.

### `INNER JOIN tabela ON condição`

Une duas tabelas trazendo apenas as linhas que têm correspondência nos dois lados. Se uma reserva não tiver funcionário, ela não aparece no resultado.

### `GROUP BY colunas`

Agrupa as linhas que têm os mesmos valores nas colunas indicadas. Todas as colunas do `SELECT` que não são funções de agregação (`COUNT`, `SUM`, etc.) precisam estar no `GROUP BY`.

### `ORDER BY coluna DESC`

Ordena os resultados. `DESC` = decrescente (maior primeiro). Sem `DESC` seria crescente (`ASC`).

### `LIMIT n OFFSET m`

`LIMIT` restringe quantas linhas o banco retorna. `OFFSET` diz quantas linhas pular antes de começar a retornar — é o mecanismo de paginação.

### `STRING_AGG(expressão, separador ORDER BY ...)`

Concatena os valores de uma coluna em uma única string, separando-os com o separador indicado. `STRING_AGG(DISTINCT av.nome, ', ' ORDER BY av.nome)` junta os nomes de avarias distintos em ordem alfabética, ex.: `"Amassado, Arranhão, Quebrado"`.

### Subconsulta correlacionada `(SELECT ... WHERE campo = alias_externo.campo)`

Uma query dentro da query principal. É **correlacionada** porque referencia um alias da query externa (ex.: `a.id` ou `v.id`). É executada uma vez para cada linha do resultado externo. Usada nos relatórios 3 e 4 para encontrar o cliente/funcionário com mais check-ins em uma agência/veículo.

### `:parametro` (replacements)

Sintaxe do Sequelize para parâmetros nomeados. Em vez de concatenar strings (o que abriria brechas para SQL injection), o valor é passado separadamente no objeto `replacements` e o banco trata o escaping automaticamente.

---

## Relatório 1 — Reservas por Funcionário

**Rota:** `GET /relatorios/reservas-por-funcionario`

**Filtro opcional:** `?funcionarioId=<id>`

**O que responde:** uma linha por funcionário que fez pelo menos uma reserva no período, com totais e contagens por status.

### SQL explicado linha a linha

```sql
SELECT
  f.id        AS "funcionarioId",      -- id do funcionário (alias para nome mais claro no JSON)
  f.nome      AS "funcionarioNome",    -- nome do funcionário
  f.cargo,                             -- cargo (sem alias pois o nome já está em camelCase)
  a.nome      AS "agenciaNome",        -- nome da agência onde o funcionário trabalha
```

As quatro linhas acima são colunas de identificação — vêm direto das tabelas `funcionarios` e `agencias` e não são calculadas.

```sql
  COUNT(r.id)                         AS "quantidadeReservas",
```

Conta quantas reservas esse funcionário fez no período. Como o `GROUP BY` é por funcionário, o `COUNT` opera só dentro do grupo daquele funcionário.

```sql
  COALESCE(SUM(r.valor_final), 0)     AS "valorTotal",
```

Soma o valor de todas as reservas do funcionário. `COALESCE(..., 0)` protege contra o caso de não haver nenhuma reserva com valor (retornaria null sem o coalesce).

```sql
  ROUND(COALESCE(AVG(r.valor_final), 0)::numeric, 2)  AS "valorMedio",
```

Média do valor das reservas, arredondada em 2 casas. O `::numeric` converte para o tipo exigido pelo `ROUND` no PostgreSQL.

```sql
  COUNT(CASE WHEN r.status = 'Concluída'  THEN 1 END)  AS "reservasConcluidas",
  COUNT(CASE WHEN r.status = 'Cancelada'  THEN 1 END)  AS "reservasCanceladas",
  COUNT(CASE WHEN r.status = 'Pendente'   THEN 1 END)  AS "reservasPendentes",
  COUNT(CASE WHEN r.status = 'Confirmada' THEN 1 END)  AS "reservasConfirmadas",
```

Quatro contadores condicionais: cada um conta apenas as reservas com aquele status específico, tudo em uma única passagem pela tabela — sem precisar de subqueries separadas.

```sql
  COUNT(*) OVER()  AS "totalRegistros"
```

Conta o total de funcionários que apareceriam no resultado sem paginação. O `OVER()` vazio significa "olhe para todas as linhas do resultado", não só o grupo atual. É usado pela `montarResposta` para calcular `totalPaginas`.

```sql
FROM reservas r
INNER JOIN funcionarios f ON r.funcionario_id = f.id
INNER JOIN agencias a     ON f.agencia_id     = a.id
```

Parte das reservas (`r`) e junta com funcionários (`f`) e agências (`a`). `INNER JOIN` garante que só apareçam funcionários que tenham reservas no período.

```sql
WHERE r.data_retirada >= :inicio
  AND r.data_retirada <= :termino
  ${filtroFuncionario}
```

Filtra reservas dentro do período informado. `${filtroFuncionario}` é uma interpolação JavaScript: se `funcionarioId` foi passado na query string, adiciona `AND f.id = :funcionarioId`; caso contrário, fica vazio e o relatório traz todos os funcionários.

```sql
GROUP BY f.id, f.nome, f.cargo, a.nome
```

Agrupa por funcionário (e pelos campos de texto que aparecem no `SELECT`). Cada grupo vira uma linha no resultado com os totais daquele funcionário.

```sql
ORDER BY "quantidadeReservas" DESC
LIMIT :limite OFFSET :deslocamento
```

Ordena do funcionário com mais reservas para o com menos. `LIMIT` e `OFFSET` implementam a paginação.

---

## Relatório 2 — Reservas por Categoria de Veículo

**Rota:** `GET /relatorios/reservas-por-categoria`

**Filtro opcional:** `?categoriaVeiculoId=<id>`

**O que responde:** uma linha por categoria de veículo, com contagens, valores e diversidade de clientes/funcionários.

### SQL explicado linha a linha

```sql
SELECT
  cv.id               AS "categoriaId",
  cv.nome             AS "categoriaNome",
  cv.tipo_carroceria  AS "tipoCarroceria",       -- ex.: "Sedan", "SUV", "Hatch"
  cv.valor_diaria     AS "valorDiariaCadastrado", -- valor base cadastrado na categoria
```

Identificação da categoria. `tipo_carroceria` e `valor_diaria` são colunas snake_case no banco — os aliases camelCase são só para a resposta JSON.

```sql
  COUNT(r.id)                                    AS "quantidadeReservas",
  COALESCE(SUM(r.valor_final), 0)                AS "valorTotal",
  ROUND(COALESCE(AVG(r.valor_final), 0)::numeric, 2)  AS "valorMedio",
```

Mesma lógica do relatório 1: quantidade, soma e média dos valores das reservas, agora agrupadas por categoria.

```sql
  COUNT(DISTINCT r.cliente_id)      AS "clientesUnicos",
```

Conta quantos clientes *diferentes* fizeram reservas nessa categoria. `DISTINCT` é essencial aqui: sem ele, um cliente que fez 3 reservas contaria como 3. Com `DISTINCT`, conta como 1.

```sql
  COUNT(DISTINCT r.funcionario_id)  AS "funcionariosQueReservaram",
```

Mesma lógica, mas para funcionários: quantos atendentes distintos processaram reservas dessa categoria.

```sql
  COUNT(CASE WHEN r.status = 'Concluída' THEN 1 END)  AS "reservasConcluidas",
  COUNT(CASE WHEN r.status = 'Cancelada' THEN 1 END)  AS "reservasCanceladas",
  COUNT(*) OVER()                                      AS "totalRegistros"
```

Contadores condicionais por status (só Concluída e Cancelada neste relatório) e o total para paginação.

```sql
FROM reservas r
INNER JOIN "categoriasVeiculos" cv ON r.categoria_veiculo_id = cv.id
```

Parte das reservas e junta com categorias. A tabela `"categoriasVeiculos"` precisa de aspas duplas porque tem letra maiúscula no nome — convenção do Sequelize quando `underscored: true` não se aplica a nomes com camelCase já no modelo.

```sql
WHERE r.data_retirada >= :inicio
  AND r.data_retirada <= :termino
  ${filtroCategoria}
GROUP BY cv.id, cv.nome, cv.tipo_carroceria, cv.valor_diaria
ORDER BY "quantidadeReservas" DESC
LIMIT :limite OFFSET :deslocamento
```

Mesma estrutura do relatório 1: filtro de período + filtro opcional + agrupamento + ordenação + paginação.

---

## Relatório 3 — Check-ins por Agência

**Rota:** `GET /relatorios/checkins-por-agencia`

**Filtro opcional:** `?agenciaId=<id>`

**O que responde:** uma linha por agência, com totais de check-ins e uma subconsulta que identifica o cliente que mais usou aquela agência no período.

### SQL explicado linha a linha

```sql
SELECT
  a.id       AS "agenciaId",
  a.nome     AS "agenciaNome",
  a.endereco,
  a.status   AS "agenciaStatus",
```

Dados de identificação da agência.

```sql
  COUNT(ci.id)                       AS "quantidadeCheckins",
  COUNT(DISTINCT r.cliente_id)       AS "clientesUnicos",
  COUNT(DISTINCT ci.veiculo_id)      AS "veiculosUtilizados",
  COUNT(DISTINCT ci.funcionario_id)  AS "funcionariosEnvolvidos",
```

Métricas de volume: total de check-ins, e contagens de distintos — clientes diferentes atendidos, veículos diferentes utilizados, funcionários diferentes que fizeram check-in nessa agência.

```sql
  (
    SELECT cl.nome
    FROM clientes cl
    INNER JOIN reservas r2  ON r2.cliente_id  = cl.id
    INNER JOIN checkins ci2 ON ci2.reserva_id = r2.id
    WHERE r2.agencia_retirada_id = a.id        -- correlação com a agência da linha atual
      AND ci2.data_checkin >= :inicio
      AND ci2.data_checkin <= :termino
    GROUP BY cl.id, cl.nome
    ORDER BY COUNT(ci2.id) DESC                -- ordena pelo cliente com mais check-ins
    LIMIT 1                                    -- pega só o primeiro (o campeão)
  )  AS "clienteComMaisCheckins",
```

Esta é uma **subconsulta correlacionada**: para cada agência da query externa, executa uma query interna que:
1. pega todos os check-ins daquela agência no mesmo período,
2. agrupa por cliente,
3. ordena do que mais fez check-in para o que menos fez,
4. retorna só o nome do primeiro — o cliente mais frequente.

O `a.id` dentro da subconsulta referencia a linha corrente da query externa — é a "correlação".

```sql
  COUNT(*) OVER()  AS "totalRegistros"
FROM checkins ci
INNER JOIN reservas r ON ci.reserva_id         = r.id
INNER JOIN agencias a ON r.agencia_retirada_id = a.id
```

Parte dos check-ins, sobe para a reserva associada e de lá para a agência de retirada. A agência de um check-in é sempre a agência *de retirada* da reserva (onde o carro é entregue ao cliente).

```sql
WHERE ci.data_checkin >= :inicio
  AND ci.data_checkin <= :termino
  ${filtroAgencia}
GROUP BY a.id, a.nome, a.endereco, a.status
ORDER BY "quantidadeCheckins" DESC
LIMIT :limite OFFSET :deslocamento
```

Filtro no período de check-in (não de reserva), filtro opcional de agência, agrupamento e paginação.

---

## Relatório 4 — Check-ins por Veículo

**Rota:** `GET /relatorios/checkins-por-veiculo`

**Filtro opcional:** `?veiculoId=<id>`

**O que responde:** uma linha por veículo, com estatísticas de quilometragem e uma subconsulta identificando o funcionário que mais fez check-in com aquele veículo.

### SQL explicado linha a linha

```sql
SELECT
  v.id             AS "veiculoId",
  v.placa,
  v.marca,
  v.modelo,
  v.ano_fabricacao AS "anoFabricacao",
  cv.nome          AS "categoriaNome",
```

Identificação completa do veículo e sua categoria.

```sql
  COUNT(ci.id)  AS "quantidadeCheckins",
```

Quantas vezes esse veículo passou por check-in no período.

```sql
  ROUND(AVG(ci.quilometragem_checkin)::numeric, 2)  AS "quilometragemMediaCheckin",
```

Quilometragem média registrada nos check-ins desse veículo. Permite ver se o carro entra com quilometragem coerente ao longo do tempo.

```sql
  MAX(ci.quilometragem_checkin)  AS "maiorQuilometragemCheckin",
```

O maior valor de quilometragem já registrado num check-in desse veículo no período. `MAX` retorna o valor máximo da coluna dentro do grupo.

```sql
  COUNT(DISTINCT r.cliente_id)  AS "clientesUnicos",
```

Quantos clientes diferentes utilizaram esse veículo.

```sql
  (
    SELECT f.nome
    FROM funcionarios f
    INNER JOIN checkins ci2 ON ci2.funcionario_id = f.id
    WHERE ci2.veiculo_id = v.id          -- correlação com o veículo da linha atual
      AND ci2.data_checkin >= :inicio
      AND ci2.data_checkin <= :termino
    GROUP BY f.id, f.nome
    ORDER BY COUNT(ci2.id) DESC
    LIMIT 1
  )  AS "funcionarioComMaisCheckins",
```

Subconsulta correlacionada igual à do relatório 3, mas desta vez procura o **funcionário** (não o cliente) que mais fez check-in com aquele veículo específico no período.

```sql
  COUNT(*) OVER()  AS "totalRegistros"
FROM checkins ci
INNER JOIN veiculos v              ON ci.veiculo_id          = v.id
INNER JOIN "categoriasVeiculos" cv ON v.categoria_veiculo_id = cv.id
INNER JOIN reservas r              ON ci.reserva_id          = r.id
```

Parte dos check-ins e junta veículo, categoria do veículo e reserva (a reserva é necessária para acessar `cliente_id` no `COUNT DISTINCT`).

```sql
WHERE ci.data_checkin >= :inicio
  AND ci.data_checkin <= :termino
  ${filtroVeiculo}
GROUP BY v.id, v.placa, v.marca, v.modelo, v.ano_fabricacao, cv.nome
ORDER BY "quantidadeCheckins" DESC
LIMIT :limite OFFSET :deslocamento
```

Mesmo padrão dos outros: filtro de período, filtro opcional, agrupamento, ordenação e paginação.

---

## Relatório 5 — Checkouts com Avarias por Veículo

**Rota:** `GET /relatorios/checkouts-avarias-por-veiculo`

**Filtro opcional:** `?veiculoId=<id>`

**O que responde:** apenas veículos que tiveram avarias registradas em checkouts no período, com totais de valor e uma lista dos tipos de avaria.

### SQL explicado linha a linha

```sql
SELECT
  v.id    AS "veiculoId",
  v.placa,
  v.marca,
  v.modelo,
  cv.nome AS "categoriaNome",
```

Identificação do veículo e categoria.

```sql
  COUNT(DISTINCT co.id)  AS "quantidadeCheckouts",
```

Quantos checkouts distintos desse veículo tiveram avarias. `DISTINCT` é necessário porque o join com `checkout_avaria` e `avarias` multiplica linhas — um checkout com 3 avarias gera 3 linhas para o mesmo `co.id`.

```sql
  COUNT(ca.avaria_id)  AS "quantidadeAvarias",
```

Total de avarias (sem `DISTINCT`): conta cada avaria individualmente, mesmo que do mesmo checkout.

```sql
  COALESCE(SUM(av.valor), 0)                      AS "valorTotalAvarias",
  ROUND(COALESCE(AVG(av.valor), 0)::numeric, 2)   AS "valorMedioAvaria",
  MAX(av.valor)                                    AS "maiorValorAvaria",
```

Valor total, médio e máximo das avarias registradas para o veículo no período.

```sql
  STRING_AGG(DISTINCT av.nome, ', ' ORDER BY av.nome)  AS "tiposAvarias",
```

Concatena os **nomes distintos** das avarias em uma string separada por vírgula. `DISTINCT` evita repetição quando o mesmo tipo de avaria aparece em checkouts diferentes. `ORDER BY av.nome` garante ordem alfabética. Exemplo de resultado: `"Amassado, Arranhão, Vidro quebrado"`.

```sql
  COUNT(*) OVER()  AS "totalRegistros"
FROM checkouts co
INNER JOIN checkins ci             ON co.checkin_id          = ci.id
INNER JOIN veiculos v              ON ci.veiculo_id          = v.id
INNER JOIN "categoriasVeiculos" cv ON v.categoria_veiculo_id = cv.id
INNER JOIN checkout_avaria ca      ON ca.checkout_id         = co.id
INNER JOIN avarias av              ON av.id                  = ca.avaria_id
```

Percorre o caminho: `checkouts → checkins → veiculos → categorias`. Além disso junta a tabela intermediária `checkout_avaria` (relação N:N entre checkout e avaria) e a tabela `avarias`. O `INNER JOIN` com `checkout_avaria` já exclui naturalmente checkouts sem nenhuma avaria — se não há linha na tabela de junção, o checkout não aparece no resultado.

```sql
WHERE co.data_checkout >= :inicio
  AND co.data_checkout <= :termino
  ${filtroVeiculo}
GROUP BY v.id, v.placa, v.marca, v.modelo, cv.nome
ORDER BY "quantidadeAvarias" DESC
LIMIT :limite OFFSET :deslocamento
```

Filtra pela data do checkout (não do check-in), filtro opcional, agrupa por veículo, ordena pelos que mais tiveram avarias e pagina.

---

## Relatório 6 — Checkouts com Multas por Cliente

**Rota:** `GET /relatorios/checkouts-multas-por-cliente`

**Filtro opcional:** `?clienteId=<id>`

**O que responde:** clientes que têm multas vinculadas a reservas que passaram por checkout no período, com totais de valor e discriminação por status da multa.

### SQL explicado linha a linha

```sql
SELECT
  cl.id    AS "clienteId",
  cl.nome  AS "clienteNome",
  cl.cpf,
  cl.email,
```

Identificação do cliente.

```sql
  COUNT(DISTINCT co.id)  AS "quantidadeCheckouts",
```

Quantos checkouts distintos o cliente teve no período. `DISTINCT` pelo mesmo motivo do relatório 5: o join com multas multiplica linhas para o mesmo checkout quando há mais de uma multa.

```sql
  COUNT(m.id)               AS "quantidadeMultas",
  COALESCE(SUM(m.valor), 0) AS "valorTotalMultas",
```

Total de multas e soma dos valores. Sem `DISTINCT` em `COUNT(m.id)` porque queremos contar cada multa individualmente.

```sql
  COUNT(CASE WHEN m.status = 'Pendente' THEN 1 END)  AS "multasPendentes",
  COUNT(CASE WHEN m.status = 'Paga'     THEN 1 END)  AS "multasPagas",
```

Contadores condicionais: separa as multas por status. Permite saber, de um cliente com 5 multas, quantas ele já pagou e quantas ainda deve.

```sql
  COALESCE(SUM(CASE WHEN m.status = 'Pendente' THEN m.valor ELSE 0 END), 0)  AS "valorMultasPendentes",
```

Soma só o valor das multas pendentes. Combina `SUM` com `CASE`: para cada linha, se a multa for pendente soma o valor dela; se não for, soma 0 (não contribui). `COALESCE` protege o resultado contra null.

```sql
  COALESCE(SUM(co.taxa_inspecao), 0)  AS "totalTaxasInspecao",
```

Soma as taxas de inspeção dos checkouts do cliente. A taxa de inspeção (R$ 150,00) é cobrada quando o cliente acumula mais de 3 avarias históricas; esse campo fica no próprio registro do checkout.

```sql
  COUNT(*) OVER()  AS "totalRegistros"
FROM checkouts co
INNER JOIN checkins ci ON co.checkin_id = ci.id
INNER JOIN reservas r  ON ci.reserva_id = r.id
INNER JOIN clientes cl ON r.cliente_id  = cl.id
INNER JOIN multas m    ON m.reserva_id  = r.id
```

Percorre: `checkouts → checkins → reservas → clientes`. A junção com `multas` é feita via `reserva_id` (a multa é vinculada à reserva, não diretamente ao checkout). O `INNER JOIN` com `multas` já exclui clientes sem multas vinculadas às reservas do período.

```sql
WHERE co.data_checkout >= :inicio
  AND co.data_checkout <= :termino
  ${filtroCliente}
GROUP BY cl.id, cl.nome, cl.cpf, cl.email
ORDER BY "valorTotalMultas" DESC
LIMIT :limite OFFSET :deslocamento
```

Filtra pela data do checkout. Agrupa por cliente, ordena do cliente com maior valor total de multas para o menor e pagina.
