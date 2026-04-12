import { CategoriaVeiculo } from "../models/CategoriaVeiculo.js";

class CategoriaVeiculoService {

  static async findAll() {
    const objs = await CategoriaVeiculo.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await CategoriaVeiculo.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const { nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade } = req.body;
    const obj = await CategoriaVeiculo.create({ nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade });
    return await CategoriaVeiculo.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade } = req.body;
    const obj = await CategoriaVeiculo.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw 'Categoria de Veiculo nÃ£o encontrada!';
    const patch = { nome, descricao, valorDiaria, tipoCarroceria, propulsao, cambio, arCondicionado, capacidade };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();
    return await CategoriaVeiculo.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await CategoriaVeiculo.findByPk(id);
    if (obj == null) throw 'Categoria de Veiculo nÃ£o encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover esta categoria pois estÃ¡ vinculada a veÃ­culos ou reservas!";
    }
  }
}

export { CategoriaVeiculoService };
