import { CheckoutService } from "../services/CheckoutService.js";

class CheckoutController {
  
  static async findAll(req, res, next) {
    CheckoutService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    CheckoutService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    CheckoutService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    CheckoutService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    CheckoutService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { CheckoutController };