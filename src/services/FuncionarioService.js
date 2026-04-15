import { Funcionario } from "../models/Funcionario.js";
import { Agencia } from "../models/Agencia.js";
import { validarModel } from "./_validarModel.js";

class FuncionarioService {

  static async findAll() {
    return await Funcionario.findAll({ attributes: { exclude: ['senha'] }, include: { all: true } });
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await Funcionario.findByPk(id, { attributes: { exclude: ['senha'] }, include: { all: true } });
  }

  static async create(req) {
    const { nome, cpf, cargo, dataNascimento, telefone, email, senha, agenciaId } = req.body;
    const erros = [];

    const agencia = await Agencia.findByPk(agenciaId);
    if (!agencia) erros.push("Agência não encontrada!");

    erros.push(...await validarModel(Funcionario.build({ nome, cpf, cargo, dataNascimento, telefone, email, senha, agenciaId })));

    if (erros.length > 0) throw erros.join(" ");

    const obj = await Funcionario.create({ nome, cpf, cargo, dataNascimento, telefone, email, senha, agenciaId });
    return await Funcionario.findByPk(obj.id, { attributes: { exclude: ['senha'] }, include: { all: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cpf, cargo, dataNascimento, telefone, email, senha, agenciaId } = req.body;

    const obj = await Funcionario.findByPk(id, { include: { all: true } });
    if (obj == null) throw "Funcionário não encontrado!";

    const erros = [];

    if (agenciaId !== undefined) {
      const agencia = await Agencia.findByPk(agenciaId);
      if (!agencia) erros.push("Agência não encontrada!");
    }

    const patch = { nome, cpf, cargo, dataNascimento, telefone, email, senha, agenciaId };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);

    erros.push(...await validarModel(obj));

    if (erros.length > 0) throw erros.join(" ");

    await obj.save({ validate: false });
    return await Funcionario.findByPk(obj.id, { attributes: { exclude: ['senha'] }, include: { all: true } });
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
