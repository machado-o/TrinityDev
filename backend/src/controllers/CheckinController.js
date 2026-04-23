import { CheckinService } from "../services/CheckinService.js";

class CheckinController {
  
  static async findAll(req, res, next) {
    CheckinService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    CheckinService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    CheckinService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    CheckinService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    CheckinService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { CheckinController };