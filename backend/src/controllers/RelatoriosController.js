import { RelatoriosService } from "../services/RelatoriosService.js";

class RelatoriosController {

  // HENRIQUE
  static async findReservasPorFuncionario(req, res, next) {
    RelatoriosService.findReservasPorFuncionario(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findReservasPorFuncionarioById(req, res, next) {
    RelatoriosService.findReservasPorFuncionarioById(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findReservasPorCategoria(req, res, next) {
    RelatoriosService.findReservasPorCategoria(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findReservasPorCategoriaById(req, res, next) {
    RelatoriosService.findReservasPorCategoriaById(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  // LORRAYNE
  static async findCheckinsPorAgencia(req, res, next) {
    RelatoriosService.findCheckinsPorAgencia(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findCheckinsPorAgenciaById(req, res, next) {
    RelatoriosService.findCheckinsPorAgenciaById(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findCheckinsPorVeiculo(req, res, next) {
    RelatoriosService.findCheckinsPorVeiculo(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findCheckinsPorVeiculoById(req, res, next) {
    RelatoriosService.findCheckinsPorVeiculoById(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  // JULIA
  static async findCheckoutsComAvariasPorVeiculo(req, res, next) {
    RelatoriosService.findCheckoutsComAvariasPorVeiculo(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findCheckoutsComAvariasPorVeiculoById(req, res, next) {
  RelatoriosService.findCheckoutsComAvariasPorVeiculoById(req)
    .then(objs => res.json(objs))
    .catch(next);
}

    static async findCheckoutsComMultasPorCliente(req, res, next) {
    RelatoriosService.findCheckoutsComMultasPorCliente(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

    static async findCheckoutsComMultasPorClienteById(req, res, next) {
    RelatoriosService.findCheckoutsComMultasPorClienteById(req)
      .then(objs => res.json(objs))
      .catch(next);
  }
  

}

export { RelatoriosController };
