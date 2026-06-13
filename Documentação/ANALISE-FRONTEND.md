# Análise de Cobertura do Frontend — SAV

> Documento gerado a partir da leitura completa do backend (Express + Sequelize) e do
> frontend (React + Vite + Tailwind) na branch `frontend`.
> Objetivo: mapear todas as funcionalidades que o backend oferece e medir o que o
> frontend já cobre, listando as mudanças necessárias para cobrir 100%.

---

## 1. Resumo executivo

O frontend está **bem mais completo do que um protótipo**: já existem páginas com CRUD
completo para **todas as 13 entidades**, os **6 relatórios**, **login** e as **3 operações**
(reserva, check-in, check-out) com dicas das regras de negócio embutidas.

A cobertura "bruta" de endpoints é alta. As lacunas restantes são de **3 tipos**:

1. **Bugs / incompatibilidades reais** entre o que o front envia e o que o back aceita.
2. **Capacidades do backend não expostas** na interface (edição de operações, etc.).
3. **Funcionalidades de produto ausentes** (autenticação real, dashboard, busca/filtros,
   telas de detalhe).

> Legenda de prioridade: 🔴 Alta · 🟡 Média · 🟢 Baixa

---

## 2. Inventário do backend

### 2.1 Endpoints REST (`backend/src/routes.js`)

| Recurso | Endpoints | Observação |
|---|---|---|
| Auth | `POST /login` | Retorna o funcionário **sem token** |
| Agência | `GET /agencias`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` | CRUD |
| Avaria | idem | CRUD |
| Categoria de veículo | `/categoriasdeveiculos` | CRUD |
| Check-in | `/checkins` | CRUD + regras |
| Check-out | `/checkouts` | CRUD + regras |
| Cliente | `/clientes` | CRUD |
| Cobertura | `/coberturas` | CRUD |
| Funcionário | `/funcionarios` | CRUD (`senha` nunca retornada) |
| Multa | `/multas` | CRUD |
| Reserva | `/reservas` | CRUD + regras |
| Seguro | `/seguros` | CRUD (M:N com coberturas) |
| Veículo | `/veiculos` | CRUD |
| Relatórios | 6 rotas `GET /relatorios/*` | Paginados, filtros por período + entidade |

### 2.2 Regras de negócio (já documentadas no `CLAUDE.md`)

- **Reserva**: valores calculados no servidor; desconto condicionado a histórico da agência;
  agências precisam estar `Ativa`; bloqueio de reservas conflitantes; data de retirada não no passado.
- **Check-in**: CNH deve bater com a do cliente; bloqueio por multas pendentes; upgrade
  automático de categoria quando não há veículo disponível.
- **Check-out**: quilometragem crescente (inclusive vs. histórico do veículo); taxa de inspeção
  (R$ 150) acima de 3 avarias no histórico; geração automática de multa a partir das avarias.

---

## 3. Cobertura atual do frontend

### 3.1 O que JÁ existe e funciona

- ✅ **Login** (`/login`) com guarda de rota client-side (`PrivateRoute`) e persistência em `localStorage`.
- ✅ **CRUD completo** (listar / criar / editar / excluir) para: Agências, Funcionários,
  Clientes, Veículos, Categorias, Seguros (com seleção M:N de coberturas), Coberturas,
  Avarias, Multas.
- ✅ **Reservas**: listar, **criar** (com aviso de cálculo automático e validação de agência inativa),
  excluir. Botão de **cancelar** (ver bug em §4.1).
- ✅ **Check-in**: listar, criar com painel de regras (CNH do cliente, bloqueio por multa
  pendente, aviso de upgrade automático, lista de veículos disponíveis por categoria), excluir.
- ✅ **Check-out**: listar, criar (combustível, pneus, palhetas, limpeza, avarias, observações,
  validação de quilometragem), excluir. Mostra taxa de inspeção e nº de avarias.
- ✅ **Relatórios**: todos os 6, com filtro obrigatório de período, filtro opcional por entidade,
  paginação e colunas específicas por relatório.
- ✅ Infra de UI: `Modal`, `ConfirmDialog`, `Toast`, `EmptyState`, `StatusBadge`, `Pagination`,
  hook `useCrud`, cliente `api` e proxy nginx `/api` → `app:3000`.

### 3.2 Verificação de campos (front × modelo) — OK

Os formulários cobrem corretamente os campos e enums dos modelos:
`Checkout` (combustível/pneus/palhetas/limpeza/observações), `Checkin` (cnhValidade),
`Veiculo.status` (Disponível/Reservado/Manutenção), `Multa.status` (Pendente/Paga),
`Reserva.status` (Pendente/Confirmada/Cancelada/Concluída), `Seguro.descricao` + coberturas.

---

## 4. Lacunas e mudanças necessárias

### 4.1 🔴 Bug: cancelamento de reserva não funciona

- **Onde**: `frontend/src/pages/Reservas.jsx` → `confirmCancel()` faz
  `PUT /reservas/:id { status: 'Cancelada' }`.
- **Problema**: `ReservaService.update()` (`backend/src/services/ReservaService.js`) **não
  inclui `status`** entre os campos do `patch`. O valor é descartado e a reserva continua `Pendente`.
- **Correção (escolher uma)**:
  - **Back**: aceitar `status` no `update` da reserva (validando transições permitidas), **ou**
  - criar endpoint dedicado `PATCH /reservas/:id/cancelar`.
- **Impacto**: a ação mais visível da tela de reservas está quebrada hoje.

### 4.2 🔴 Autenticação real (token) ausente

> **Decisão (2026-06-13):** por ser um projeto acadêmico, a autenticação real (JWT)
> fica **fora de escopo por enquanto**. O login permanece cosmético e nenhuma rota é
> protegida no backend. Será implementada mais à frente caso o professor solicite,
> usando o recurso/abordagem que ele indicar. As notas abaixo ficam como referência
> para essa implementação futura.


- **Estado atual**: `POST /login` retorna o funcionário, mas **não há JWT**; **nenhuma rota é
  protegida** no backend (`grep` por jwt/token/authenticate = nada). O `PrivateRoute` do front é
  puramente cosmético e o `api` não envia `Authorization`.
- **Mudanças**:
  - **Back**: emitir token no login + middleware de autenticação nas rotas protegidas.
  - **Front**: armazenar token, enviar header `Authorization` em `api/client.js`, tratar `401`
    (redirect para login) e expiração de sessão.
- **Observação**: se o escopo do projeto for "rede interna confiável", documentar a decisão;
  caso contrário é uma lacuna de segurança importante.

### 4.3 🟡 Edição das operações (Reserva / Check-in / Check-out)

> **Decisão (2026-06-13) — implementado:**
> - **Reserva**: edição liberada **somente enquanto `Pendente`** (antes do check-in). O front tem
>   modal de edição (ícone lápis na lista). O `ReservaService.update` passou a **recalcular os
>   valores financeiros no servidor** quando datas/categoria/seguro/agência mudam (mesma regra do
>   create) — assim a edição nunca deixa valores defasados. Reservas `Confirmada`/`Concluída`/
>   `Cancelada` não são editáveis pela UI.
> - **Check-in**: edição liberada (modal com lápis), enquanto **não houver check-out**. O
>   `CheckinService.update` foi endurecido: trocar o veículo **libera o antigo** (`Disponível`) e
>   **reserva o novo** (`Reservado`) numa transação, e a troca é **bloqueada se já existe
>   check-out**. A reserva vinculada não muda.
> - **Check-out**: edição **restrita a campos de inspeção/observação** (combustível, pneus,
>   palhetas, limpeza, observações, funcionário). **Quilometragem e avarias são imutáveis** — o
>   `CheckoutService.update` ignora esses campos, pois alterá-los exigiria refazer odômetro do
>   veículo, taxa de inspeção e a multa gerada (que é vinculada à reserva, não ao checkout). Para
>   corrigir km/avarias, remova e recrie o check-out.
>
> *(Opção A "meio-termo", 2026-06-13 — verificada em runtime: troca de veículo, bloqueio com
> checkout e imutabilidade de km/avarias.)*

### 4.4 🟡 Telas de detalhe (drill-down) ausentes

As listas mostram só resumo. Faltam visões de detalhe que o backend já entrega via
`include: { all: true }`:

- **Reserva**: quebra financeira (valorDiária, valorSeguro, valorFinal, **desconto aplicado**),
  seguro escolhido, agência de devolução, multas vinculadas.
- **Check-out**: lista das avarias selecionadas e a **multa gerada automaticamente**.
- **Cliente**: histórico de reservas e multas (pendentes/pagas).
- **Veículo**: histórico de check-ins/checkouts e quilometragem.
- **Mudança**: criar páginas/modais de detalhe (`GET /:id`) para essas entidades.

### 4.5 🟡 Listagens sem busca, filtro, ordenação e paginação

> **Feito (2026-06-13):** criados o hook `useListView` (busca + paginação no cliente) e o
> componente `ListToolbar`. Aplicados a **todas** as listas (9 cadastros + Reservas/Check-in/
> Check-out): campo de busca por campos relevantes, contador de registros e paginação (12/pág.)
> reusando o componente `Pagination`. Para escala maior, ainda vale paginar no backend.

### 4.6 🟡 Dashboard / página inicial

> **Feito (2026-06-13):** a rota `/` agora é o **Dashboard** (`pages/Dashboard.jsx`), com item
> "Visão geral" no menu. Indicadores calculados client-side a partir das listas existentes:
> KPIs (reservas pendentes, check-ins de hoje, veículos disponíveis, multas pendentes),
> quebra de reservas e da frota por status (com as cores de status) e uma seção acionável de
> multas pendentes (que bloqueiam check-in). KPIs e seções linkam para as telas correspondentes.

### 4.7 🟢 Ajustes finos de UX/robustez

> **Feito (2026-06-13):**
> - **Reservas**: validação `dataDevolucao > dataRetirada` no front (create e edit).
> - **Pré-visualização de valores**: estimativa (diária × dias + seguro) exibida no modal de
>   reserva antes de salvar, deixando claro que o total final é calculado no servidor e pode ter
>   desconto.
> - **Feedback de upgrade**: ao concluir o check-in, o toast informa o veículo atribuído e, quando
>   houve upgrade automático, qual categoria foi usada.
> - **Veículos em manutenção**: destacados pelo `StatusBadge` (vermelho), contabilizados no
>   dashboard (frota por status) e sinalizados no detalhe do veículo; já são excluídos da seleção
>   de veículos no check-in (só `Disponível`).
>
> **Pendente (aceito para o escopo acadêmico):** `AuthContext` ainda confia no `localStorage` e
> não revalida a sessão ao recarregar — alinhado à decisão de adiar a autenticação real (§4.2).
> Controle de acesso por cargo: ver §4.8 / item 8.

---

## 5. Matriz de cobertura por área

| Área | Backend | Front hoje | Lacuna | Prioridade |
|---|---|---|---|---|
| Login | ✅ (sem token) | ✅ cosmético | Token + proteção real | 🔴 |
| Reservas — criar | ✅ | ✅ | — | — |
| Reservas — cancelar | ⚠️ ignora status | ✅ (no-op) | Corrigir back/endpoint | 🔴 |
| Reservas — editar/detalhe | ✅ PUT/GET:id | ❌ | Edição + detalhe financeiro | 🟡 |
| Check-in | ✅ | ✅ criar/excluir | Editar + detalhe + feedback upgrade | 🟡 |
| Check-out | ✅ | ✅ criar/excluir | Editar + detalhe (avarias/multa) | 🟡 |
| CRUDs de cadastro (9) | ✅ | ✅ completo | Busca/filtro/paginação | 🟡 |
| Relatórios (6) | ✅ | ✅ completo | — | — |
| Dashboard | — | ❌ | Criar visão geral | 🟡 |
| Detalhes (drill-down) | ✅ GET:id | ❌ | Telas de detalhe | 🟡 |
| Acesso por cargo | ❌ (sem enforcement) | ✅ UI-only | Enforcement no back (com auth) | 🟢 |

---

## 6. Lista priorizada de mudanças

1. ✅ **Corrigir cancelamento de reserva** — *feito (2026-06-13)*: `ReservaService.update` agora
   aceita `status` validando as transições permitidas (`TRANSICOES_STATUS`). O front já enviava
   `{ status: 'Cancelada' }`.
2. ⏸️ **Autenticação real** — *adiada por decisão (projeto acadêmico)*; ver §4.2. Implementar
   quando/se o professor solicitar.
3. 🟡 **Telas de detalhe** para Reserva (quebra financeira + desconto), Check-out
   (avarias + multa gerada), Cliente e Veículo.
4. ✅ **Edição** — *feito (2026-06-13)*: Reserva editável só em `Pendente` (recálculo no back);
   Check-in editável com troca de veículo consistente (bloqueada após check-out); Check-out
   editável só em campos de inspeção (km/avarias imutáveis). Ver §4.3.
5. ✅ **Busca/paginação** nas listagens — *feito (2026-06-13)*: `useListView` + `ListToolbar` em
   todas as listas. Ver §4.5.
6. ✅ **Dashboard** inicial — *feito (2026-06-13)*. Ver §4.6.
7. ✅ **UX** — *feito (2026-06-13)*: validação `devolução > retirada`, prévia de valores, feedback
   de upgrade, destaque de manutenção. Revalidação de sessão fica para quando houver auth. Ver §4.7.
8. ✅ **Controle de acesso por cargo** — *feito (UI-only, 2026-06-13)*: Atendentes não veem
   Funcionários, Agências nem Relatórios (menu filtrado + `GerenteRoute` redireciona acesso direto).
   **Não há enforcement no backend** — quando a autenticação real entrar (§4.2), aplicar a mesma
   regra via middleware por cargo.

---

## 7. Notas técnicas

- O front fala com o back pelo proxy nginx `location /api/ → http://app:3000/`
  (`frontend/nginx.conf`); em dev o cliente usa `BASE = '/api'`.
- O backend recria e popula o banco a cada start **apenas** quando `databaseInserts()` está
  ativo em `database-connection.js` — em produção (Render) está comentado de propósito.
- Não há testes automatizados em nenhuma das camadas.
