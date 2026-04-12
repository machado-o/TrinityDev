import { Multa } from "../models/Multa.js";

class MultaService {

  static async findAll() {
    const objs = await Multa.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Multa.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const { valor, dataEmissao, descricao, clienteId, status } = req.body;
    const obj = await Multa.create({ valor, dataEmissao, descricao, clienteId, status });
    return await Multa.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const { valor, dataEmissao, descricao, clienteId, status } = req.body;
    const obj = await Multa.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw 'Multa nÃ£o encontrada!';
    const patch = { valor, dataEmissao, descricao, clienteId, status };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Multa.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Multa.findByPk(id);
    if (obj == null) throw 'Multa nÃ£o encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover esta multa pois ela estÃ¡ vinculada a um cliente!";
    }
  }

}

export { MultaService };
