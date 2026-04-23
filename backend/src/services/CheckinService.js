import { Op } from "sequelize";
import sequelize from "../config/database-connection.js";
import { Checkin } from "../models/Checkin.js";
import { Reserva } from "../models/Reserva.js";
import { Veiculo } from "../models/Veiculo.js";
import { CategoriaVeiculo } from "../models/CategoriaVeiculo.js";
import { Multa } from "../models/Multa.js";
import { Funcionario } from "../models/Funcionario.js";
import { validarModel } from "./_validarModel.js";

async function buscarVeiculoUpgrade(categoriaVeiculoId) {
  const categoriasSuperiores = await CategoriaVeiculo.findAll({
    where: { id: { [Op.gt]: categoriaVeiculoId } },
    order: [["id", "ASC"]],
  });

  for (const cat of categoriasSuperiores) {
    const veiculo = await Veiculo.findOne({ where: { categoriaVeiculoId: cat.id, status: "Disponível" } });
    if (veiculo) return veiculo.id;
  }

  return null;
}

async function validarVeiculoSolicitado(reserva, veiculoId) {
  const erros = [];

  if (!veiculoId) {
    erros.push("Informe o veículo para realizar o check-in!");
    return { veiculoFinalId: null, erros };
  }

  const veiculo = await Veiculo.findByPk(veiculoId);
  if (!veiculo) {
    erros.push("Veículo não encontrado!");
    return { veiculoFinalId: null, erros };
  }
  if (veiculo.status !== "Disponível") erros.push("O veículo selecionado não está disponível!");
  if (veiculo.categoriaVeiculoId !== reserva.categoriaVeiculoId) erros.push("O veículo selecionado não pertence à categoria da reserva!");

  return { veiculoFinalId: veiculoId, erros };
}

async function resolverVeiculoParaCheckin(reserva, veiculoId) {
  const veiculosNaCategoria = await Veiculo.findAll({
    where: { categoriaVeiculoId: reserva.categoriaVeiculoId, status: "Disponível" },
  });

  if (veiculosNaCategoria.length === 0) {
    const veiculoFinalId = await buscarVeiculoUpgrade(reserva.categoriaVeiculoId);
    const erros = veiculoFinalId ? [] : ["Não há veículos disponíveis para esta reserva e não foi possível realizar upgrade de categoria!"];
    return { veiculoFinalId, erros };
  }

  return validarVeiculoSolicitado(reserva, veiculoId);
}

class CheckinService {

  static async findAll() {
    return await Checkin.findAll({ include: { all: true } });
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await Checkin.findByPk(id, { include: { all: true } });
  }

  static async create(req) {
    const { dataCheckin, cnhCondutor, cnhValidade, quilometragemCheckin, reservaId, veiculoId, funcionarioId } = req.body;
    const erros = [];

    const [reserva, funcionario] = await Promise.all([
      Reserva.findByPk(reservaId, { include: { all: true } }),
      Funcionario.findByPk(funcionarioId),
    ]);

    if (!reserva) {
      erros.push("Reserva não encontrada!");
    } else {
      if (reserva.status !== 'Pendente') erros.push("Só é possível realizar check-in em reservas com status Pendente!");
      if (cnhCondutor !== reserva.cliente.cnh) erros.push("A CNH informada não corresponde à CNH cadastrada para o cliente da reserva!");
      const debitosPendentes = await Multa.count({ where: { clienteId: reserva.clienteId, status: "Pendente" } });
      if (debitosPendentes > 0) erros.push("O cliente possui débitos pendentes e não pode realizar o check-in!");
    }

    if (!funcionario) erros.push("Funcionário não encontrado!");

    let veiculoFinalId = veiculoId;
    if (reserva) {
      const { veiculoFinalId: idResolvido, erros: errosVeiculo } = await resolverVeiculoParaCheckin(reserva, veiculoId);
      erros.push(...errosVeiculo);
      if (idResolvido) veiculoFinalId = idResolvido;
    }

    erros.push(...await validarModel(Checkin.build({ dataCheckin, cnhCondutor, cnhValidade, quilometragemCheckin, reservaId, veiculoId: veiculoFinalId, funcionarioId })));

    if (erros.length > 0) throw erros.join(" ");

    return await sequelize.transaction(async (t) => {
      const obj = await Checkin.create({ dataCheckin, cnhCondutor, cnhValidade, quilometragemCheckin, reservaId, veiculoId: veiculoFinalId, funcionarioId }, { transaction: t });

      const veiculo = await Veiculo.findByPk(veiculoFinalId, { transaction: t });
      veiculo.status = 'Reservado';
      await veiculo.save({ transaction: t });

      reserva.status = 'Confirmada';
      await reserva.save({ transaction: t });

      return await Checkin.findByPk(obj.id, { include: { all: true }, transaction: t });
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { dataCheckin, cnhCondutor, cnhValidade, quilometragemCheckin, reservaId, veiculoId, funcionarioId } = req.body;

    const obj = await Checkin.findByPk(id, { include: { all: true } });
    if (obj == null) throw "Checkin não encontrado!";

    const patch = { dataCheckin, cnhCondutor, cnhValidade, quilometragemCheckin, reservaId, veiculoId, funcionarioId };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);

    const erros = await validarModel(obj);
    if (erros.length > 0) throw erros.join(" ");

    await obj.save({ validate: false });
    return await Checkin.findByPk(obj.id, { include: { all: true } });
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
