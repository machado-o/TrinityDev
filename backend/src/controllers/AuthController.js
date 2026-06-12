import { AuthService } from '../services/AuthService.js';

class AuthController {
  static async login(req, res, next) {
    try {
      const dados = await AuthService.login(req);
      res.status(200).json(dados);
    } catch (err) {
      next(err);
    }
  }
}

export { AuthController };
