import sequelize from "../config/database-connection.js";
import { Seguro } from "../models/Seguro.js";

class SeguroService {

  static async findAll() {
    const objs = await Seguro.findAll({ include: { all: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Seguro.findByPk(id, { include: { all: true } });
    return obj;
  }

  static async create(req) {
    const { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia, coberturaIds } = req.body;
    return await sequelize.transaction(async (t) => {
      const obj = await Seguro.create({ nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia }, { transaction: t });
      if (coberturaIds) await obj.setCoberturas(coberturaIds, { transaction: t });
      return await Seguro.findByPk(obj.id, { include: { all: true }, transaction: t });
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia, coberturaIds } = req.body;
    const obj = await Seguro.findByPk(id, { include: { all: true } });
    if (obj == null) throw 'Seguro não encontrado!';
    return await sequelize.transaction(async (t) => {
      const patch = { nome, empresaSeguradora, descricao, valorDiariaAdicional, franquia };
      Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
      Object.assign(obj, patch);
      await obj.save({ transaction: t });
      if (coberturaIds !== undefined) await obj.setCoberturas(coberturaIds, { transaction: t });
      return await Seguro.findByPk(obj.id, { include: { all: true }, transaction: t });
    });
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