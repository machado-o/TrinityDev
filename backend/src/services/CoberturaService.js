import { Cobertura } from "../models/Cobertura.js";

class CoberturaService {

  static async findAll() {
    const objs = await Cobertura.findAll({ include: { all: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cobertura.findByPk(id, { include: { all: true } });
    return obj;
  }

  static async create(req) {
    const { nome, descricao, valorIndenizacaoMax } = req.body;
    const obj = await Cobertura.create({ nome, descricao, valorIndenizacaoMax });
    return await Cobertura.findByPk(obj.id, { include: { all: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, descricao, valorIndenizacaoMax } = req.body;
    const obj = await Cobertura.findByPk(id, { include: { all: true } });
    if (obj == null) throw 'Cobertura não encontrada!';
    const patch = { nome, descricao, valorIndenizacaoMax };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Cobertura.findByPk(obj.id, { include: { all: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Cobertura.findByPk(id);
    if (obj == null) throw 'Cobertura não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta cobertura pois ela está vinculada a um seguro!";
    }
  }

}

export { CoberturaService };