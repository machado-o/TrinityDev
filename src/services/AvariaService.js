import { Avaria } from "../models/Avaria.js";

class AvariaService {

  static async findAll() {
    const objs = await Avaria.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Avaria.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const { nome, valor } = req.body;
    const obj = await Avaria.create({ nome, valor });
    return await Avaria.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, valor } = req.body;
    const obj = await Avaria.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw 'Avaria nÃ£o encontrada!';
    const patch = { nome, valor };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Avaria.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Avaria.findByPk(id);
    if (obj == null) throw 'Avaria nÃ£o encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover esta avaria pois ela estÃ¡ vinculada a um checkout!";
    }
  }

}

export { AvariaService };
