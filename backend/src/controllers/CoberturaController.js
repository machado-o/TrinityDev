import { CoberturaService } from "../services/CoberturaService.js";

class CoberturaController {
  
  static async findAll(req, res, next) {
    CoberturaService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    CoberturaService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    CoberturaService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    CoberturaService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    CoberturaService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { CoberturaController };