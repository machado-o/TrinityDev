import { Reserva } from "../models/Reserva.js";

class ReservaService {

  static async findAll() {
    const objs = await Reserva.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const {
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    } = req.body;

    const obj = await Reserva.create({
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    });

    return await Reserva.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    } = req.body;

    const obj = await Reserva.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw "Reserva não encontrada!";

    const patch = {
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();

    return await Reserva.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id);
    if (obj == null) throw "Reserva não encontrada!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta reserva pois está vinculada a outros registros.";
    }
  }

}

export { ReservaService };
