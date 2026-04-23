# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SAV (Sistema de Aluguel de Veículos) — a vehicle rental management system built for internal use by company employees (attendants and managers). The system handles reservations, check-in, and check-out processes.

## Running the Application

**Primary method (Docker — recommended):**
```bash
docker compose up --build -d
```
This starts the Node.js app on port 3000, PostgreSQL on 5432, and pgAdmin on port 5050.

**Development without Docker:**
```bash
cd backend && npm run dev
```
Uses `nodemon` to watch for changes. Server runs on port 3333.

There are no test scripts configured.

## Architecture

The app is a REST API using **Express + Sequelize ORM** with ES Modules (`"type": "module"` in package.json).

**Layer structure (Controller → Service → Model):**
- `backend/src/routes.js` — registers all routes; each entity gets 5 standard CRUD endpoints
- `backend/src/controllers/` — thin controllers that call the corresponding service and pass errors to `next`
- `backend/src/services/` — business logic layer; all queries use `{ include: { all: true, nested: true } }` to return fully populated objects
- `backend/src/models/` — Sequelize models with `static init(sequelize)` and `static associate(models)` methods
- `backend/src/_middleware/error-handler.js` — global error handler; differentiates string errors (thrown manually as business rule violations), Sequelize validation errors, FK constraint errors, and unique constraint errors. String errors ending in `"não encontrado!"` or `"não encontrada!"` return 404; others return 400. `SequelizeUniqueConstraintError` uses the model's own message via `err.errors[0].message`.

**Database setup:**
- `backend/src/config/database-config.js` — exports `databaseConfig`; has commented-out SQLite config for local testing and a production Postgres config
- `backend/src/config/database-connection.js` — instantiates Sequelize, calls `init` and `associate` on every model, then runs `databaseInserts()` which does `sequelize.sync({ force: true })` and seeds the database on every startup

> **Important:** `sync({ force: true })` drops and recreates all tables on every server restart. The database is always re-seeded from `database-connection.js`.

## Domain Model

Key entities and their relationships:

- **Agencia** → has many Funcionarios and Veiculos
- **Funcionario** → belongs to Agencia; creates Reservas and Checkins
- **Cliente** → has many Reservas and Multas
- **CategoriaVeiculo** → has many Veiculos; referenced by Reservas
- **Veiculo** → belongs to CategoriaVeiculo; used in Checkins
- **Seguro** → belongs to many Coberturas (M:N); referenced by Reservas
- **Cobertura** → belongs to many Seguros (M:N)
- **Reserva** → belongs to Cliente, CategoriaVeiculo, Funcionario, Seguro, and two Agencias (retirada/devolucao); has one Checkin; has many Multas. Has a `status` field: `Pendente` → `Confirmada` (on check-in) → `Concluída` (on check-out) | `Cancelada`.
- **Checkin** → belongs to Reserva, Veiculo, Funcionario; has one Checkout. `dataCheckin` is `DATE` (datetime, no separate time field).
- **Checkout** → belongs to Checkin, Funcionario; has many Avarias (M:N). `dataCheckout` is `DATE` (datetime, no separate time field). No `possuiAvarias` field — derive from `checkout.avarias.length > 0`.
- **Avaria** → belongs to many Checkouts (M:N)
- **Multa** → belongs to Cliente and optionally to Reserva (`reservaId` nullable FK)

## Adding a New Entity

Follow the pattern already established:
1. Create `backend/src/models/EntityName.js` with `static init(sequelize)` and `static associate(models)`
2. Create `backend/src/services/EntityNameService.js` with `findAll`, `findByPk`, `create`, `update`, `delete`
3. Create `backend/src/controllers/EntityNameController.js` (delegates to service, passes errors to `next`)
4. Register model in `backend/src/config/database-connection.js` (both `init` and `associate` calls)
5. Add routes in `backend/src/routes.js`

## Business Rules (implemented in Services)

**ReservaService.create():**
- `dataRetirada` must not be in the past (validated here, not in the model)
- Both `agenciaRetirada` and `agenciaDevolucao` must have `status = 'Ativa'`
- Conflicting reservations for the same client are blocked
- `valorDiaria`, `quantidadeDias`, `valorSeguro`, and `valorFinal` are **calculated by the service** from `CategoriaVeiculo` and `Seguro` — never accepted from the request body
- Automatic discount applied if `quantidadeDias >= agencia.limiteDiasDesconto`

**CheckinService.create():**
- `cnhCondutor` must match `reserva.cliente.cnh` exactly
- Blocked if client has pending multas (`status = 'Pendente'`)
- If no vehicle available in requested category, client gets a free category upgrade (next category by ID with an available vehicle)
- After creating: vehicle status → `'Reservado'`; reserva status → `'Confirmada'`

**CheckoutService.create():**
- `quilometragemCheckout` must be greater than `checkin.quilometragemCheckin`
- Clients with more than 3 avarias across previous rentals get a R$ 150.00 inspection fee (`taxaInspecao`)
- After creating: vehicle status → `'Disponível'`; reserva status → `'Concluída'`

**FuncionarioService:**
- `senha` is excluded from all read queries (`findAll`, `findByPk`) — never returned in responses
