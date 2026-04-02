import { Checkin } from "../models/Checkin.js";

class CheckinService {

  static async findAll() {
    const objs = await Checkin.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Checkin.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const {
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    } = req.body;

    const obj = await Checkin.create({
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    });

    return await Checkin.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    } = req.body;

    const obj = await Checkin.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw "Checkin não encontrado!";

    const patch = {
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();

    return await Checkin.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Checkin.findByPk(id);
    if (obj == null) throw "Checkin não encontrado!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover este checkin pois está vinculado a outros registros.";
    }
  }

}

export { CheckinService };
