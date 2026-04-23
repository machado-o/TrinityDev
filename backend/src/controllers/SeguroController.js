import { SeguroService } from "../services/SeguroService.js";

class SeguroController {
  
  static async findAll(req, res, next) {
    SeguroService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    SeguroService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    SeguroService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    SeguroService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    SeguroService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { SeguroController };