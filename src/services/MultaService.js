import { Multa } from "../models/Multa.js";

class MultaService {

  static async findAll() {
    const objs = await Multa.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Multa.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { valor, dataEmissao, descricao, clienteId, status, reservaId } = req.body;
    const obj = await Multa.create({ valor, dataEmissao, descricao, clienteId, status, reservaId });
    return await Multa.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { valor, dataEmissao, descricao, clienteId, status, reservaId } = req.body;
    const obj = await Multa.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Multa não encontrada!';
    const patch = { valor, dataEmissao, descricao, clienteId, status, reservaId };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Multa.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Multa.findByPk(id);
    if (obj == null) throw 'Multa não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta multa pois ela está vinculada a um cliente!";
    }
  }

}

export { MultaService };