import { Cliente } from "../models/Cliente.js";

class ClienteService {

  static async findAll() {
    const objs = await Cliente.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const {
      nome,
      cpf,
      dataNascimento,
      telefone,
      email,
      cnh,
      categoriaCnh,
      validadeCnh,
      endereco,
    } = req.body;

    const obj = await Cliente.create({
      nome,
      cpf,
      dataNascimento,
      telefone,
      email,
      cnh,
      categoriaCnh,
      validadeCnh,
      endereco,
    });

    return await Cliente.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      nome,
      cpf,
      dataNascimento,
      telefone,
      email,
      cnh,
      categoriaCnh,
      validadeCnh,
      endereco,
    } = req.body;

    const obj = await Cliente.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw "Cliente não encontrado!";

    const patch = {
      nome,
      cpf,
      dataNascimento,
      telefone,
      email,
      cnh,
      categoriaCnh,
      validadeCnh,
      endereco,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();

    return await Cliente.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id);
    if (obj == null) throw "Cliente não encontrado!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover este cliente pois está vinculado a outros registros.";
    }
  }

}

export { ClienteService };
