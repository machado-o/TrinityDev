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
npm run dev
```
Uses `nodemon` to watch for changes. Server runs on port 3333.

There are no test scripts configured.

## Architecture

The app is a REST API using **Express + Sequelize ORM** with ES Modules (`"type": "module"` in package.json).

**Layer structure (Controller → Service → Model):**
- `src/routes.js` — registers all routes; each entity gets 5 standard CRUD endpoints
- `src/controllers/` — thin controllers that call the corresponding service and pass errors to `next`
- `src/services/` — business logic layer; all queries use `{ include: { all: true, nested: true } }` to return fully populated objects
- `src/models/` — Sequelize models with `static init(sequelize)` and `static associate(models)` methods
- `src/_middleware/error-handler.js` — global error handler; differentiates string errors (thrown manually as business rule violations), Sequelize validation errors, FK constraint errors, and unique constraint errors

**Database setup:**
- `src/config/database-config.js` — exports `databaseConfig`; has commented-out SQLite config for local testing and a production Postgres config
- `src/config/database-connection.js` — instantiates Sequelize, calls `init` and `associate` on every model, then runs `databaseInserts()` which does `sequelize.sync({ force: true })` and seeds the database on every startup

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
- **Reserva** → belongs to Cliente, CategoriaVeiculo, Funcionario, Seguro, and two Agencias (retirada/devolucao); has one Checkin
- **Checkin** → belongs to Reserva, Veiculo, Funcionario; has one Checkout
- **Checkout** → belongs to Checkin, Funcionario; has many Avarias (M:N)
- **Avaria** → belongs to many Checkouts (M:N)
- **Multa** → belongs to Cliente

## Adding a New Entity

Follow the pattern already established:
1. Create `src/models/EntityName.js` with `static init(sequelize)` and `static associate(models)`
2. Create `src/services/EntityNameService.js` with `findAll`, `findByPk`, `create`, `update`, `delete`
3. Create `src/controllers/EntityNameController.js` (delegates to service, passes errors to `next`)
4. Register model in `database-connection.js` (both `init` and `associate` calls)
5. Add routes in `src/routes.js`

## Business Rules (implemented in Services)

- Reservas with days ≥ manager-configured limit get automatic discount
- Conflicting reservations for the same client are blocked
- Check-in: if no vehicle available in requested category, client gets free category upgrade
- Check-in: blocked if client has pending debts from previous rentals
- Check-out: vehicle mileage must be ≥ last recorded mileage
- Check-out: clients with more than 3 avarias in previous rentals get an inspection fee applied
