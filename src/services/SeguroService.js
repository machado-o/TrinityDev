import { Seguro } from "../models/Seguro.js";

class SeguroService {

  static async findAll() {
    const objs = await Seguro.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Seguro.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia, coberturaIds } = req.body;
    const obj = await Seguro.create({ nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia });
    if (coberturaIds) await obj.setCoberturas(coberturaIds);
    return await Seguro.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia, coberturaIds } = req.body;
    const obj = await Seguro.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw 'Seguro nÃ£o encontrado!';
    const patch = { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    if (coberturaIds !== undefined) await obj.setCoberturas(coberturaIds);
    return await Seguro.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Seguro.findByPk(id);
    if (obj == null) throw 'Seguro nÃ£o encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover este seguro pois ele estÃ¡ vinculado a reservas!";
    }
  }

}

export { SeguroService };
