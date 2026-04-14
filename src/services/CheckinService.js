import { Op } from "sequelize";
import sequelize from "../config/database-connection.js";
import { Checkin } from "../models/Checkin.js";
import { Reserva } from "../models/Reserva.js";
import { Veiculo } from "../models/Veiculo.js";
import { CategoriaVeiculo } from "../models/CategoriaVeiculo.js";
import { Multa } from "../models/Multa.js";

class CheckinService {

  static async findAll() {
    const objs = await Checkin.findAll({ include: { all: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Checkin.findByPk(id, { include: { all: true } });
    return obj;
  }

  static async create(req) {
    const {
      dataCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    } = req.body;

    const reserva = await Reserva.findByPk(reservaId, { include: { all: true } });
    if (!reserva) throw "Reserva não encontrada!";

    // Item 7B: Validar que a CNH informada corresponde à CNH do cliente da reserva
    if (cnhCondutor !== reserva.cliente.cnh)
      throw "A CNH informada não corresponde à CNH cadastrada para o cliente da reserva!";

    // Regra 4: Bloquear check-in se o cliente tiver débitos pendentes
    const debitosPendentes = await Multa.count({
      where: { clienteId: reserva.clienteId, status: "Pendente" },
    });
    if (debitosPendentes > 0)
      throw "O cliente possui débitos pendentes e não pode realizar o check-in!";

    // Regra 3: Verificar disponibilidade na categoria da reserva e aplicar upgrade se necessário
    const veiculosNaCategoria = await Veiculo.findAll({
      where: { categoriaVeiculoId: reserva.categoriaVeiculoId, status: "Disponível" },
    });

    let veiculoFinalId = veiculoId;

    if (veiculosNaCategoria.length === 0) {
      // Nenhum veículo disponível na categoria solicitada — buscar upgrade pela próxima categoria (ID maior)
      const categoriasSuperiores = await CategoriaVeiculo.findAll({
        where: { id: { [Op.gt]: reserva.categoriaVeiculoId } },
        order: [["id", "ASC"]],
      });

      let veiculoUpgrade = null;
      for (const cat of categoriasSuperiores) {
        veiculoUpgrade = await Veiculo.findOne({
          where: { categoriaVeiculoId: cat.id, status: "Disponível" },
        });
        if (veiculoUpgrade) break;
      }

      if (!veiculoUpgrade)
        throw "Não há veículos disponíveis para esta reserva e não foi possível realizar upgrade de categoria!";

      veiculoFinalId = veiculoUpgrade.id;
    } else {
      // Há veículos na categoria — validar o veículo informado
      if (!veiculoId) throw "Informe o veículo para realizar o check-in!";

      const veiculoSolicitado = await Veiculo.findByPk(veiculoId);
      if (!veiculoSolicitado) throw "Veículo não encontrado!";
      if (veiculoSolicitado.status !== "Disponível")
        throw "O veículo selecionado não está disponível!";
      if (veiculoSolicitado.categoriaVeiculoId !== reserva.categoriaVeiculoId)
        throw "O veículo selecionado não pertence à categoria da reserva!";
    }

    return await sequelize.transaction(async (t) => {
      const obj = await Checkin.create({
        dataCheckin,
        cnhCondutor,
        cnhValidade,
        quilometragemCheckin,
        reservaId,
        veiculoId: veiculoFinalId,
        funcionarioId,
      }, { transaction: t });

      // Item 10: Atualizar status do veículo para 'Reservado'
      const veiculo = await Veiculo.findByPk(veiculoFinalId, { transaction: t });
      veiculo.status = 'Reservado';
      await veiculo.save({ transaction: t });

      // Item 11: Atualizar status da reserva para 'Confirmada'
      reserva.status = 'Confirmada';
      await reserva.save({ transaction: t });

      return await Checkin.findByPk(obj.id, { include: { all: true }, transaction: t });
    });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      dataCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    } = req.body;

    const obj = await Checkin.findByPk(id, { include: { all: true } });
    if (obj == null) throw "Checkin não encontrado!";

    const patch = {
      dataCheckin,
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
