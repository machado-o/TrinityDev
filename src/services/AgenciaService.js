import { Agencia } from "../models/Agencia.js";

class AgenciaService {

  static async findAll() {
    const objs = await Agencia.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Agencia.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, cnpj, endereco, telefone, status } = req.body;
    const obj = await Agencia.create({ nome, cnpj, endereco, telefone, status });
    return await Agencia.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cnpj, endereco, telefone, status } = req.body;
    const obj = await Agencia.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Agência não encontrada!';
    const patch = { nome, cnpj, endereco, telefone, status };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Agencia.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Agencia.findByPk(id);
    if (obj == null) throw 'Agência não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta Agência pois ela está vinculada a reservas";
    }
  }

}

export { AgenciaService };