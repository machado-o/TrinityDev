import { Agencia } from "../models/Agencia.js";

class AgenciaService {

  static async findAll() {
    const objs = await Agencia.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Agencia.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const { nome, cnpj, endereco, telefone, status, limiteDiasDesconto, percentualDesconto } = req.body;
    const obj = await Agencia.create({ nome, cnpj, endereco, telefone, status, limiteDiasDesconto, percentualDesconto });
    return await Agencia.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cnpj, endereco, telefone, status, limiteDiasDesconto, percentualDesconto } = req.body;
    const obj = await Agencia.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw 'AgÃªncia nÃ£o encontrada!';
    const patch = { nome, cnpj, endereco, telefone, status, limiteDiasDesconto, percentualDesconto };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Agencia.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Agencia.findByPk(id);
    if (obj == null) throw 'AgÃªncia nÃ£o encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover esta AgÃªncia pois ela estÃ¡ vinculada a reservas";
    }
  }

}

export { AgenciaService };
