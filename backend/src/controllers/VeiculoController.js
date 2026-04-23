import { VeiculoService } from "../services/VeiculoService.js";

class VeiculoController {
  
  static async findAll(req, res, next) {
    VeiculoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    VeiculoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    VeiculoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    VeiculoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    VeiculoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { VeiculoController };