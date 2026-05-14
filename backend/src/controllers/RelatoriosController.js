import { RelatoriosService } from "../services/RelatoriosService.js";

class RelatoriosController {

  // HENRIQUE
  static async findReservasPorFuncionario(req, res, next) {
    RelatoriosService.findReservasPorFuncionario(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findReservasPorCategoria(req, res, next) {
    RelatoriosService.findReservasPorCategoria(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  // LORRAYNE
  static async findCheckinsPorAgencia(req, res, next) {
    RelatoriosService.findCheckinsPorAgencia(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findCheckinsPorVeiculo(req, res, next) {
    RelatoriosService.findCheckinsPorVeiculo(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  // JULIA

  static async findCheckoutsComAvariasPorVeiculo(req, res, next) {
    RelatoriosService.findCheckoutsComAvariasPorVeiculo(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findCheckoutsComMultasPorCliente(req, res, next) {
    RelatoriosService.findCheckoutsComMultasPorCliente(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

}

export { RelatoriosController };
