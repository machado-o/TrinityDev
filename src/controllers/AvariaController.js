import { AvariaService } from "../services/AvariaService.js";

class AvariaController {
  
  static async findAll(req, res, next) {
    AvariaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    AvariaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    AvariaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    AvariaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    AvariaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { AvariaController };