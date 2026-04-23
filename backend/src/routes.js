import express from "express";

import { AgenciaController } from './controllers/AgenciaController.js';
import { AvariaController } from './controllers/AvariaController.js';
import { CategoriaVeiculoController } from './controllers/CategoriaVeiculoController.js';
import { CheckinController } from './controllers/CheckinController.js';
import { CheckoutController } from './controllers/CheckoutController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { CoberturaController } from './controllers/CoberturaController.js';
import { FuncionarioController } from './controllers/FuncionarioController.js';
import { MultaController } from './controllers/MultaController.js';
import { ReservaController } from './controllers/ReservaController.js';
import { SeguroController } from './controllers/SeguroController.js';
import { VeiculoController } from './controllers/VeiculoController.js';

const routes = express.Router();

// Agencia
routes.get("/agencias", AgenciaController.findAll);
routes.get("/agencias/:id", AgenciaController.findByPk);
routes.post("/agencias", AgenciaController.create);
routes.put("/agencias/:id", AgenciaController.update);
routes.delete("/agencias/:id", AgenciaController.delete);

// Avaria
routes.get("/avarias", AvariaController.findAll);
routes.get("/avarias/:id", AvariaController.findByPk);
routes.post("/avarias", AvariaController.create);
routes.put("/avarias/:id", AvariaController.update);
routes.delete("/avarias/:id", AvariaController.delete);

// CategoriaVeiculo
routes.get("/categoriasdeveiculos", CategoriaVeiculoController.findAll);
routes.get("/categoriasdeveiculos/:id", CategoriaVeiculoController.findByPk);
routes.post("/categoriasdeveiculos", CategoriaVeiculoController.create);
routes.put("/categoriasdeveiculos/:id", CategoriaVeiculoController.update);
routes.delete("/categoriasdeveiculos/:id", CategoriaVeiculoController.delete);

// Checkin
routes.get("/checkins", CheckinController.findAll);
routes.get("/checkins/:id", CheckinController.findByPk);
routes.post("/checkins", CheckinController.create);
routes.put("/checkins/:id", CheckinController.update);
routes.delete("/checkins/:id", CheckinController.delete);

// Checkout
routes.get("/checkouts", CheckoutController.findAll);
routes.get("/checkouts/:id", CheckoutController.findByPk);
routes.post("/checkouts", CheckoutController.create);
routes.put("/checkouts/:id", CheckoutController.update);
routes.delete("/checkouts/:id", CheckoutController.delete);

// Cliente
routes.get("/clientes", ClienteController.findAll);
routes.get("/clientes/:id", ClienteController.findByPk);
routes.post("/clientes", ClienteController.create);
routes.put("/clientes/:id", ClienteController.update);
routes.delete("/clientes/:id", ClienteController.delete);

// Cobertura
routes.get("/coberturas", CoberturaController.findAll);
routes.get("/coberturas/:id", CoberturaController.findByPk);
routes.post("/coberturas", CoberturaController.create);
routes.put("/coberturas/:id", CoberturaController.update);
routes.delete("/coberturas/:id", CoberturaController.delete);

// Funcionario
routes.get("/funcionarios", FuncionarioController.findAll);
routes.get("/funcionarios/:id", FuncionarioController.findByPk);
routes.post("/funcionarios", FuncionarioController.create);
routes.put("/funcionarios/:id", FuncionarioController.update);
routes.delete("/funcionarios/:id", FuncionarioController.delete);

// Multa
routes.get("/multas", MultaController.findAll);
routes.get("/multas/:id", MultaController.findByPk);
routes.post("/multas", MultaController.create);
routes.put("/multas/:id", MultaController.update);
routes.delete("/multas/:id", MultaController.delete);

// Reserva
routes.get("/reservas", ReservaController.findAll);
routes.get("/reservas/:id", ReservaController.findByPk);
routes.post("/reservas", ReservaController.create);
routes.put("/reservas/:id", ReservaController.update);
routes.delete("/reservas/:id", ReservaController.delete);

// Seguro
routes.get("/seguros", SeguroController.findAll);
routes.get("/seguros/:id", SeguroController.findByPk);
routes.post("/seguros", SeguroController.create);
routes.put("/seguros/:id", SeguroController.update);
routes.delete("/seguros/:id", SeguroController.delete);

// Veiculo
routes.get("/veiculos", VeiculoController.findAll);
routes.get("/veiculos/:id", VeiculoController.findByPk);
routes.post("/veiculos", VeiculoController.create);
routes.put("/veiculos/:id", VeiculoController.update);
routes.delete("/veiculos/:id", VeiculoController.delete);

export default routes;
