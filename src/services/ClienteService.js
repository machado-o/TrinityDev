import { Cliente } from "../models/Cliente.js";

class ClienteService {

  static async findAll() {
    const objs = await Cliente.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id, { include: { all: true, nested: false } });
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

    return await Cliente.findByPk(obj.id, { include: { all: true, nested: false } });
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

    const obj = await Cliente.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw "Cliente nÃ£o encontrado!";

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

    return await Cliente.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id);
    if (obj == null) throw "Cliente nÃ£o encontrado!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover este cliente pois estÃ¡ vinculado a outros registros.";
    }
  }

}

export { ClienteService };
