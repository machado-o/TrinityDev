import bcrypt from 'bcryptjs';
import { Funcionario } from '../models/Funcionario.js';
import { Agencia } from '../models/Agencia.js';

class AuthService {
  static async login(req) {
    const { email, senha } = req.body;

    if (!email || !senha) throw 'E-mail e senha são obrigatórios!';

    const funcionario = await Funcionario.findOne({
      where: { email },
      include: [{ model: Agencia, as: 'agencia', attributes: ['id', 'nome'] }],
    });

    if (!funcionario) throw 'Credenciais inválidas!';

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    if (!senhaValida) throw 'Credenciais inválidas!';

    const { senha: _, ...dados } = funcionario.toJSON();
    return dados;
  }
}

export { AuthService };
