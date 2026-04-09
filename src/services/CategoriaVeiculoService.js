import { CategoriaVeiculo } from "../models/CategoriaVeiculo.js";

class CategoriaVeiculoService {

  static async findAll() {
    const objs = await CategoriaVeiculo.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await CategoriaVeiculo.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade } = req.body;
    const obj = await CategoriaVeiculo.create({ nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade });
    return await CategoriaVeiculo.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade } = req.body;
    const obj = await CategoriaVeiculo.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Categoria de Veiculo não encontrada!';
    const patch = { nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await CategoriaVeiculo.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await CategoriaVeiculo.findByPk(id);
    if (obj == null) throw 'Categoria de Veiculo não encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta categoria pois está vinculada a veículos ou reservas!";
    }
  }
}

export { CategoriaVeiculoService };
