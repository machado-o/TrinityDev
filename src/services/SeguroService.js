import { Seguro } from "../models/Seguro.js";

class SeguroService {

  static async findAll() {
    const objs = await Seguro.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Seguro.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia } = req.body;
    const obj = await Seguro.create({ nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia });
    return await Seguro.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia } = req.body;
    const obj = await Seguro.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Seguro não encontrado!';
    const patch = { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Seguro.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Seguro.findByPk(id);
    if (obj == null) throw 'Seguro não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover este seguro pois ele está vinculado a reservas!";
    }
  }

}

export { SeguroService };