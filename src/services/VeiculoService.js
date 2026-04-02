import { Veiculo } from "../models/Veiculo.js";

class VeiculoService {

  static async findAll() {
    const objs = await Veiculo.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Veiculo.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { placa, chassi, status, marca, modelo, cor, anoFabricacao, quilometragem, categoriaVeiculoId, agenciaId } = req.body;
    const obj = await Veiculo.create({ placa, chassi, status, marca, modelo, cor, anoFabricacao, quilometragem, categoriaVeiculoId, agenciaId });
    return await Veiculo.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { placa, chassi, status, marca, modelo, cor, anoFabricacao, quilometragem, categoriaVeiculoId, agenciaId } = req.body;
    const obj = await Veiculo.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Veículo não encontrado!';

    const patch = {
      placa,
      chassi,
      status,
      marca,
      modelo,
      cor,
      anoFabricacao,
      quilometragem,
      categoriaVeiculoId,
      agenciaId,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await Veiculo.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Veiculo.findByPk(id);
    if (obj == null) throw 'Veiculo não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover veículos...!";
    }
  }
}

export { VeiculoService };


