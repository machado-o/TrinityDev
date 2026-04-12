import { Veiculo } from "../models/Veiculo.js";

class VeiculoService {

  static async findAll() {
    const objs = await Veiculo.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Veiculo.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const { placa, chassi, status, marca, modelo, cor, anoFabricacao, quilometragem, categoriaVeiculoId, agenciaId } = req.body;
    const obj = await Veiculo.create({ placa, chassi, status, marca, modelo, cor, anoFabricacao, quilometragem, categoriaVeiculoId, agenciaId });
    return await Veiculo.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const { placa, chassi, status, marca, modelo, cor, anoFabricacao, quilometragem, categoriaVeiculoId, agenciaId } = req.body;
    const obj = await Veiculo.findByPk(id, { include: { all: true, nested: false } });

    if (obj == null) throw 'VeÃ­culo nÃ£o encontrado!';

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
    return await Veiculo.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Veiculo.findByPk(id);
    if (obj == null) throw 'Veiculo nÃ£o encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover este veÃ­culo pois estÃ¡ vinculado a outros registros!";
    }
  }
}

export { VeiculoService };
