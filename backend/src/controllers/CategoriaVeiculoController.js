import { CategoriaVeiculoService } from "../services/CategoriaVeiculoService.js";

class CategoriaVeiculoController {
  
  static async findAll(req, res, next) {
    CategoriaVeiculoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    CategoriaVeiculoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    CategoriaVeiculoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    CategoriaVeiculoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    CategoriaVeiculoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { CategoriaVeiculoController };