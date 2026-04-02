import { Avaria } from "../models/Avaria.js";

class AvariaService {

  static async findAll() {
    const objs = await Avaria.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Avaria.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, valor } = req.body;
    const obj = await Avaria.create({ nome, valor });
    return await Avaria.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, valor } = req.body;
    const obj = await Avaria.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Avaria não encontrada!';
    const patch = { nome, valor };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Avaria.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Avaria.findByPk(id);
    if (obj == null) throw 'Avaria não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta avaria pois ela está vinculada a um checkout!";
    }
  }

}

export { AvariaService };