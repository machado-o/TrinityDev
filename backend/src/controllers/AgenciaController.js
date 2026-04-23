import { AgenciaService } from "../services/AgenciaService.js";

class AgenciaController {
  
  static async findAll(req, res, next) {
    AgenciaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    AgenciaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    AgenciaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    AgenciaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    AgenciaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { AgenciaController };