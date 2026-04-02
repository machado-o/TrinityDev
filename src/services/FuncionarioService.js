import { Funcionario } from "../models/Funcionario.js";

class FuncionarioService {

  static async findAll() {
    const objs = await Funcionario.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id, { include: { all: true, nested: true } });
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

    return await Funcionario.findByPk(obj.id, { include: { all: true, nested: true } });
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

    const obj = await Funcionario.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw "Funcionário não encontrado!";

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

    return await Funcionario.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id);
    if (obj == null) throw "Funcionário não encontrado!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover este funcionário pois está vinculado a outros registros.";
    }
  }

}

export { FuncionarioService };
