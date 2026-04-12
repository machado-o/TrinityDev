import { Funcionario } from "../models/Funcionario.js";

class FuncionarioService {

  static async findAll() {
    const objs = await Funcionario.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const {
      nome,
      cpf,
      cargo,
      dataNascimento,
      telefone,
      email,
      senha,
      agenciaId,
    } = req.body;

    const obj = await Funcionario.create({
      nome,
      cpf,
      cargo,
      dataNascimento,
      telefone,
      email,
      senha,
      agenciaId,
    });

    return await Funcionario.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      nome,
      cpf,
      cargo,
      dataNascimento,
      telefone,
      email,
      senha,
      agenciaId,
    } = req.body;

    const obj = await Funcionario.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw "FuncionÃ¡rio nÃ£o encontrado!";

    const patch = {
      nome,
      cpf,
      cargo,
      dataNascimento,
      telefone,
      email,
      senha,
      agenciaId,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();

    return await Funcionario.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id);
    if (obj == null) throw "FuncionÃ¡rio nÃ£o encontrado!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover este funcionÃ¡rio pois estÃ¡ vinculado a outros registros.";
    }
  }

}

export { FuncionarioService };
