# Rodando o SAV localmente (Docker) — notas e pegadinhas

> Estas são armadilhas reais encontradas ao subir o projeto local com `docker compose up --build -d`.
> Nenhuma delas é óbvia pelo código — daí este documento.

## Subindo a stack

```bash
docker compose up --build -d
```

Serviços e portas (host):

| Serviço   | Porta host | Observação |
|-----------|-----------|------------|
| frontend  | **8080** → 80 (nginx) | App React servido pelo nginx; faz proxy `/api/` → `app:3000` |
| app       | **3000** → 3000 | Backend Express |
| db        | **5432** → 5432 | Postgres 15 (acesso interno via host `db`) |
| pgadmin   | **5050** → 80 | login `admin@admin.com` / senha `admin` |

Acesse o sistema em **http://localhost:8080**.

## Pegadinha 1 — o banco não popula sozinho (tabelas inexistentes)

`backend/src/config/database-connection.js` tem a chamada **`databaseInserts()` comentada de
propósito** (commit "Comentando a população"). Isso evita que o deploy no Render fique dropando e
recriando as tabelas a cada push (`sync({ force: true })`).

**Sintoma local:** API responde `500` com `relation "agencias" does not exist`.

**Solução local (NÃO commitar):** descomente a linha `databaseInserts();` em
`database-connection.js`, reinicie o container do app e reverta antes de qualquer commit:

```bash
# depois de editar, reinicie (ver Pegadinha 2)
git checkout backend/src/config/database-connection.js   # reverter antes de commitar
```

## Pegadinha 2 — nodemon não detecta alterações no Docker (Windows)

O bind mount `./backend:/app` no Windows **não propaga eventos de file-watch**, então o `nodemon`
não reinicia ao editar arquivos. Após qualquer mudança no backend (ex.: descomentar o
`databaseInserts()`), reinicie manualmente:

```bash
docker compose restart app
```

## Pegadinha 3 — conflito de porta 5432

Se já houver outro Postgres ocupando a `5432` no host (ex.: outra stack docker), o `db` falha com
`Bind for 0.0.0.0:5432 failed: port is already allocated`. Pare o serviço conflitante **ou**
remapeie a porta do `db` (ex.: `5433:5432`) — o app/pgadmin acessam o banco pela rede interna
(`DB_HOST=db`), então o mapeamento de host serve só para acesso externo.

## Pegadinha 4 — container `db` sem rede após falha

Se a primeira subida falhar no meio, o container `db` pode ficar sem rede anexada
(`NetworkSettings.Networks: {}`) e o app não resolve o host `db`
(`getaddrinfo ENOTFOUND db`). Resolva recriando a stack:

```bash
docker compose down && docker compose up -d
```

## Credenciais de acesso (seed)

Todos os funcionários do seed usam a senha **`Senha@1234`**. Não há token/JWT — o login só
retorna os dados do funcionário.

| E-mail | Cargo | Agência |
|---|---|---|
| `emanuelly@example.com` | Gerente | Cachoeiro |
| `carlos@example.com` | Atendente | Vitória |
| `juliana@example.com` | Atendente | Vila Velha |
| `rafael@example.com` | Gerente | Serra |
| `amanda@example.com` | Atendente | Cachoeiro |

## Branches de frontend

Há **duas** branches distintas com frontend:

- **`front`** (local) — protótipos React + Bootstrap.
- **`frontend`** (origin) — "Implementação inicial do frontend" (React + Vite + Tailwind).
  É a branch de trabalho atual desta análise.
